
import Foundation
struct Request:Decodable {var command:String;var id:Int?;var x:Int?;var y:Int?;var target:Int?;var spell:Int?;var item:Int?;var token:String?;var choice:Int?;var disposition:String?}
struct Cell:Encodable {var x:Int;var y:Int}
struct HostUnit:Encodable {var id:Int;var x:Int;var y:Int;var hp:Int;var maxHP:Int;var mp:Int;var maxMP:Int;var level:Int;var job:Int;var side:Int;var facing:Int;var hidden:Bool;var acted:Bool;var moved:Bool;var canAct:Bool;var attack:Int;var defense:Int}
struct HostSpell:Encodable {var id:Int;var name:String;var mp:Int}
struct HostPending:Encodable {var token=UUID().uuidString;var kind:String;var id:Int = -1;var x:Int = 0;var y:Int = 0;var pose:Int = 0;var duration:Double = 0.05;var text:String = "";var target:Int = -1;var sound:Int = -1;var impact:Int = -1;var targetIDs:[Int] = []}
struct Reply:Encodable {var ok:Bool;var error:String;var round:Int;var side:Int;var outcome:String;var units:[HostUnit];var range:[Cell];var targets:[Int];var spells:[HostSpell];var log:[String];var money:Int;var inventory:[Int];var unsupported:[Int];var pendingMove:Int;var hasPending:Bool;var pending:HostPending?;var stateVersion:Int=1}

@main struct BattleHost {
 enum HostError:Error {case blocked(String)}
 static func main() throws {
  let root=URL(fileURLWithPath:CommandLine.arguments[1]),decoder=JSONDecoder()
  let data=try decoder.decode(CampaignData.self,from:Data(contentsOf:root.appendingPathComponent("first-battle.json")))
  let spells=try decoder.decode([OriginalSpell].self,from:Data(contentsOf:root.appendingPathComponent("original-spells.json")))
  let tutorialText=try decoder.decode(OriginalTutorialText.self,from:Data(contentsOf:root.appendingPathComponent("original-tutorial-text.json")))
  var state=CampaignState(data:data);state.randomState=1
  var pending:HostPending?
  var completion:(()throws->Void)?
  func hold(_ action:HostPending,_ done:@escaping()throws->Void){pending=action;completion=done}
  func pump() throws {
   if pending != nil{return}
   for _ in 0..<1024 {
    if let n=state.turnLimit?.notice {hold(HostPending(kind:"notice",text:"제한 턴을 넘겼습니다.")){_ = state.acknowledgeTurnLimitNotice(token:n.token,input:n.phase == .polling ? 1:nil,data:data)};return}
    if let r=state.retirement {
     if !r.dialogueAcknowledged {hold(HostPending(kind:"dialogue",id:r.person,text:data.people[r.person].name+" 퇴장")){_=state.acknowledgeRetirementDialogue(r.transaction.context.operationID,data:data)};return}
     if let sound=state.retirementSoundNeeded {hold(HostPending(kind:"sound",id:sound)){_=state.recordRetirementSound(token:r.transaction.context.operationID,disposition:"issued",data:data)};return}
     if let q=r.transaction.restoredFrame ?? state.publishRetirement(data:data) {hold(HostPending(kind:"retirement",id:r.person,pose:q.ordinal,duration:0.05)){guard state.acknowledgeRetirement(q,data:data) else{throw HostError.blocked("retirement receipt")}};return}
    }
    if let e=state.movementExecution {
     let tile=e.path[e.completedSegments+1]
     hold(HostPending(kind:"move",id:e.actorID,x:tile.x,y:tile.y,duration:0.13)){guard state.acknowledgeMovement(token:e.token,segment:e.completedSegments,data:data,catalog:spells) else{throw HostError.blocked("movement receipt")}};return
    }
    if let e=state.physicalExecution {
     var action=HostPending(kind:"delay",duration:0.025)
     if let visual=e.presentation(in:state) {switch visual {
      case .attack(let source,let target,let damage,let mpDamage,_,let critical):
       let group=state.index(source).map{OriginalCombat.group(state.units[$0].job)} ?? 0
       action=HostPending(kind:"attack",id:source,pose:6,duration:0.65,target:target,sound:[0,1,7,9,10,14,15,18].contains(group) ? 34:[2,4].contains(group) ? 37:32,impact:damage+mpDamage==0 ? 30+(critical ? 1:0):35+(critical ? 1:0))
      case .numberPanel:action=HostPending(kind:"panel",duration:0.4)
      case .growth(_,let sound):action=HostPending(kind:"sound",id:sound)
     }}
     hold(action){
      if !e.growth.isEmpty {_=state.acknowledgePhysicalGrowth(id:e.id,revision:e.revision)}else{guard state.advancePhysicalExecution(id:e.id,revision:e.revision,data:data) else{throw HostError.blocked("attack receipt")}}
     };return
    }
    if let e=state.spellExecution {
     var action=HostPending(kind:"delay",duration:0.025)
     if let visual=e.presentation(in:state) {switch visual {
      case .animation(let source,let targets,let spell):action=HostPending(kind:"spell",id:source,pose:spell,duration:0.8,target:targets.first ?? -1,targetIDs:targets)
      case .effect(let person,let spell):action=HostPending(kind:"spellStatus",id:person,pose:spell,duration:0.4,text:spells[spell].name)
      case .numbers:action=HostPending(kind:"panel",duration:0.4)
      case .growth(_,let sound):action=HostPending(kind:"sound",id:sound)
     }}
     hold(action){
      if !e.growth.isEmpty {_=state.acknowledgeSpellGrowth(id:e.id,revision:e.revision)}else{guard state.advanceSpellExecution(id:e.id,revision:e.revision,data:data,catalog:spells) else{throw HostError.blocked("spell receipt")}}
     };return
    }
    if state.tutorial != nil {
     if state.tutorial?.session==nil {guard state.provideTutorialProfile(.explicitFresh(),mask:Array(repeating:1,count:104)) else{throw HostError.blocked("tutorial profile")}}
     state.prepareTutorialStep(data:data);guard state.tutorial != nil else{continue}
     if state.tutorial?.session?.flow.questionAddress != nil {hold(HostPending(kind:"tutorial",text:"전투 안내를 보시겠습니까?")){};return}
     if let c=state.tutorial?.pendingCommand {
      let person=c.args.first ?? -1
      if c.kind=="dialogue",let raw=c.raw,let bytes=OriginalDialogue.parseHex(raw) {
       hold(HostPending(kind:"dialogue",id:person,text:OriginalDialogue.decoded(bytes))){guard state.applyTutorialCommand(data:data) else{throw HostError.blocked("tutorial dialogue")}};return
      }
      if c.kind=="spriteBoundary" {
       hold(HostPending(kind:"pose",id:person,pose:c.args.count>1 ? c.args[1]:0,duration:0.65)){guard state.finishTutorialPresentation() else{throw HostError.blocked("tutorial sprite")};state.prepareTutorialStep(data:data)};return
      }
      if c.kind=="presentationBoundary" && c.address != "0x4559bc" {
       let title=c.address=="0x45dc05" ? "행동 메뉴: 공격 · 책략 · 도구 · 대기":c.address=="0x4425ff" ? "부대 정보를 확인합니다.":c.address=="0x45774d" ? "지형 정보: 병과에 따라 이동 비용과 지형 효과가 달라집니다.":"전장 안내 화면을 확인합니다."
       hold(HostPending(kind:"dialogue",id:person,text:title)){guard state.finishTutorialPresentation() else{throw HostError.blocked("tutorial panel")};state.prepareTutorialStep(data:data)};return
      }
      hold(HostPending(kind:c.kind=="nativeMove" ? "move":"tutorialVisual",id:person,x:c.point?.x ?? 0,y:c.point?.y ?? 0,duration:c.kind=="nativeMove" ? 0.65:0.05,text:c.kind)){
       guard state.applyTutorialCommand(data:data) else{throw HostError.blocked("tutorial command \(c.kind) \(c.address ?? "")")}
      };return
     }
     var text="전투 안내"
     if case .dialogue(let address,let speaker)=state.tutorial?.session?.flow.current {text=data.people[speaker].name+": "+(try tutorialText.dialogue(at:address))}
     else if case .lessonEnd=state.tutorial?.session?.flow.current {text=try tutorialText.dialogue(at:state.tutorial?.lessonEndIndex==1 ? 0x496fa0:0x496f7c)}
     else {throw HostError.blocked("tutorial reward presentation not connected")}
     hold(HostPending(kind:"dialogue",text:text)){guard state.acknowledgeTutorialDialogue(data:data,text:tutorialText) else{throw HostError.blocked("tutorial receipt")}};return
    }
    if let p=state.presentation?.pending {
     if p.geometry==nil {guard state.prepareScenarioPresentation(screenX:(p.operands[0]&255)*48,screenY:(p.operands[1]&255)*48+56,viewportWidth:data.width*48,viewportHeight:data.height*48,data:data) else{throw HostError.blocked("effect geometry")};continue}
     guard let a=p.action else{throw HostError.blocked("effect action")}
     hold(HostPending(kind:"effect",id:a.kind=="mcallLoad" ? a.arguments[0]:state.presentation?.loadedMCALL ?? -1,x:p.operands[0],y:p.operands[1],pose:p.operands[2],duration:0.025,text:a.kind)){guard state.acknowledgeScenarioPresentationAction(p,data:data) else{throw HostError.blocked("effect receipt")}};return
    }
    if let node=state.pendingScenarioMotion {
     let a=node.args.map{$0.number},pose=node.op==80 ? a[1]:0
     hold(HostPending(kind:node.op==9 ? "delay":"pose",id:node.op==80 ? a[0]:-1,pose:pose,duration:node.op==9 ? Double(a.first ?? 1)*0.05:(pose==9 ? 2.4:0.8))){
      guard state.pendingScenarioMotion === node else{throw HostError.blocked("motion receipt")};state.pendingScenarioMotion=nil;state.checkEvents(data:data)
      if state.dialogueTurnEntry==true,state.pendingScenarioMotion==nil,state.pendingScenarioAudio==nil,state.pendingDialogue==nil,state.scenarioExecution==nil {state.dialogueTurnEntry=nil;state.finishTurnEntry(data:data)}
     };return
    }
    if let node=state.pendingScenarioAudio {
     let a=node.args.map{$0.number}
     hold(HostPending(kind:node.op==35 ? "sound":"music",id:a.first ?? -1,pose:a.count>1 ? a[1]:0)){
      guard state.pendingScenarioAudio === node else{throw HostError.blocked("audio receipt")};state.pendingScenarioAudio=nil;state.checkEvents(data:data)
      if state.dialogueTurnEntry==true,state.pendingScenarioMotion==nil,state.pendingScenarioAudio==nil,state.pendingDialogue==nil,state.scenarioExecution==nil {state.dialogueTurnEntry=nil;state.finishTurnEntry(data:data)}
     };return
    }
    if let text=state.pendingDialogue {
     hold(HostPending(kind:"dialogue",text:text)){guard state.pendingDialogue==text else{throw HostError.blocked("dialogue receipt")};state.pendingDialogue=nil;state.checkEvents(data:data)};return
    }
    if state.hasPendingEquipment {throw HostError.blocked("장비함 교환 선택 연결 필요")}
    if state.battleChoice != nil {hold(HostPending(kind:"choice",text:"원본 이벤트 선택")){};return}
    if state.normalAction != nil {state.advanceNormalAction(data:data);continue}
    if state.scenarioExecution != nil {state.resumeScenarioExecution(data:data);continue}
    state.cues.removeAll();return
   };throw HostError.blocked("Engine pump did not settle; no event skipped")
  }
  while let line=readLine(){
   var ok=true,message="",range:[Cell]=[],targets:[Int]=[],available:[HostSpell]=[]
   do {
    let q=try decoder.decode(Request.self,from:Data(line.utf8)),index=q.id.flatMap{state.index($0)}
    if q.command=="ack" {
     guard let action=pending,q.token==action.token else{throw HostError.blocked("stale completion receipt")}
     if action.kind=="tutorial" {guard let c=q.choice,state.answerTutorial(yes:c==1,data:data) else{throw HostError.blocked("tutorial choice")}}
     else if action.kind=="choice" {guard let c=q.choice,state.answerScenarioChoice(c,data:data) else{throw HostError.blocked("scenario choice")}}
     else {try completion?()}
     pending=nil;completion=nil
    }else{
     guard pending==nil||q.command=="new" else{throw HostError.blocked("Presentation completion required")}
     switch q.command {
     case "new":pending=nil;completion=nil;state=CampaignState(data:data);state.randomState=1
     case "select":if let i=index,state.canAct(i){if !state.units[i].moved{range=state.movement(i,data:data).costs.keys.sorted{$0.y == $1.y ? $0.x<$1.x:$0.y<$1.y}.map{Cell(x:$0.x,y:$0.y)}};targets=state.units.indices.filter{state.units[$0].alive && (state.units[$0].side==1) != (state.units[i].side==1) && PhysicalForecast(state.fighter(i,data:data),state.fighter($0,data:data)) != nil}.map{state.units[$0].id}}
     case "move":guard let i=index,let x=q.x,let y=q.y,state.move(i,to:Tile(x:x,y:y),data:data,deferMovement:true) else{throw HostError.blocked("이동할 수 없는 칸입니다")}
     case "cancel":guard state.cancelMove(data:data) else{throw HostError.blocked("취소할 이동이 없습니다")}
     case "wait":guard let i=index,state.wait(i,data:data) else{throw HostError.blocked("대기할 수 없습니다")}
     case "attack":guard let i=index,let t=q.target.flatMap({state.index($0)}),state.attack(i,t,data:data) else{throw HostError.blocked("공격할 수 없습니다")}
     case "cast":guard let i=index,let t=q.target.flatMap({state.index($0)}),let spell=q.spell,state.cast(spell,source:i,target:t,data:data,catalog:spells) else{throw HostError.blocked("책략 조건/사거리/MP를 확인하세요")}
     case "item":guard let i=index,let t=q.target.flatMap({state.index($0)}),let item=q.item,state.useItem(item,source:i,target:t,data:data) else{throw HostError.blocked("아이템 사용 조건을 확인하세요")}
     case "end":guard state.side==0,state.outcome == .battle else{throw HostError.blocked("아군 차례가 아닙니다")};state.nextSide(data:data)
     case "step":if state.outcome == .battle {if state.side==0 {if !state.units.indices.contains(where:{state.canAct($0)}){state.nextSide(data:data)}}else if let i=state.nextAIActor(data:data){state.ai(i,data:data,catalog:spells,deferMovement:true)}else{state.nextSide(data:data)}}
     case "auto":if let i=state.units.indices.first(where:{state.canAct($0)}){state.ai(i,data:data,catalog:spells,deferMovement:true)}else{state.nextSide(data:data)}
     default:throw HostError.blocked("Unknown command")
     }
    }
    try pump()
   }catch{ok=false;message=String(describing:error)}
   let result=Reply(ok:ok,error:message,round:state.round,side:state.side,outcome:state.outcome.rawValue,units:state.units.indices.map{i in let u=state.units[i],s=state.displayed(u,data:data);return HostUnit(id:u.id,x:u.tile.x,y:u.tile.y,hp:u.hp,maxHP:s[5],mp:u.mp,maxMP:s[6],level:u.level,job:u.job,side:u.side,facing:u.effectiveOriginalFacing,hidden:u.hidden,acted:u.acted,moved:u.moved,canAct:state.canAct(i),attack:s[0],defense:s[1])},range:range,targets:targets,spells:available,log:Array(state.log.suffix(8)),money:state.money ?? 0,inventory:state.inventory,unsupported:Array(state.scenarioUnimplemented ?? []).sorted(),pendingMove:state.pendingMove.flatMap{state.units.indices.contains($0.unit) ? state.units[$0.unit].id:nil} ?? -1,hasPending:pending != nil,pending:pending)
   print(String(decoding:try JSONEncoder().encode(result),as:UTF8.self));fflush(stdout)
  }
 }
}
