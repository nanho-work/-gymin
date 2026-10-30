import Foundation
// Isolated in-memory fixtures. Never changes the authoring data or a user's campaign.
@main struct ActionQueryTests {
 static func main() throws {
  let root=URL(fileURLWithPath:CommandLine.arguments[1]),decoder=JSONDecoder()
  var json=try JSONSerialization.jsonObject(with:Data(contentsOf:root.appendingPathComponent("first-battle.json"))) as! [String:Any]
  json["events"]=[[],[],[]] as [[Any]]
  let data=try decoder.decode(CampaignData.self,from:JSONSerialization.data(withJSONObject:json))
  let spells=try decoder.decode([OriginalSpell].self,from:Data(contentsOf:root.appendingPathComponent("original-spells.json")))
  let labels=try decoder.decode(ActionLabels.self,from:Data(contentsOf:URL(fileURLWithPath:CommandLine.arguments[2])))
  var state=CampaignState(data:data)
  for i in state.units.indices {state.units[i].hidden=true}
  let source=state.index(0)!,enemy=state.index(146)!,ally=state.index(258)!
  for (i,tile,side) in [(source,Tile(x:10,y:10),0),(enemy,Tile(x:10,y:9),1),(ally,Tile(x:11,y:10),0)] {
   state.units[i].hidden=false;state.units[i].tile=tile;state.units[i].side=side;state.units[i].hp=40;state.units[i].gear=[255,255,255];state.units[i].controlMode=side==0 ? 7:0
  }
  state.units[source].level=10;state.units[source].job=0;state.units[source].mp=50;state.inventory=[87,87,97]
  assert(state.canAct(source))
  let before=state.units,rng=state.randomState,inventory=state.inventory
  let (skills,items)=BattleActionQuery.options(source:source,state:state,data:data,spells:spells,labels:labels)
  assert(skills.contains{$0.id==10&&$0.cost==6&&$0.enabled},"learned wind skill and actual cost")
  assert(items.first{$0.id==87}?.count==2 && !items.contains{$0.id==76},"owned consumables only, unique entries with exact count")
  let wind=BattleActionQuery.aim(kind:"skill",id:10,source:source,target:enemy,state:state,data:data,spells:spells)
  assert(wind.valid && wind.targets.contains(146) && !wind.targets.contains(258) && wind.affected==[146],"enemy targeting and original one-cell area")
  assert(wind.range.allSatisfy{(0..<data.width).contains($0.x)&&(0..<data.height).contains($0.y)})
  let fullHP=state.displayed(state.units[ally],data:data)[5];state.units[ally].hp=fullHP
  assert(BattleActionQuery.spellReason(39,source:source,target:ally,state:state,data:data,spells:spells)==nil,"manual full-HP heal remains selectable")
  assert(BattleActionQuery.itemReason(87,source:source,target:ally,state:state,data:data)==nil,"manual full-HP item remains selectable")
  assert(BattleActionQuery.itemReason(87,source:source,target:enemy,state:state,data:data) != nil,"items reject enemies")
  assert(BattleActionQuery.itemReason(97,source:source,target:source,state:state,data:data) != nil,"promotion level prerequisite")
  var far=state;far.units[enemy].tile=Tile(x:19,y:19);far.units[ally].tile=Tile(x:19,y:18)
  assert(BattleActionQuery.spellReason(10,source:source,target:enemy,state:far,data:data,spells:spells) != nil)
  assert(BattleActionQuery.itemReason(87,source:source,target:ally,state:far,data:data) != nil)
  var enemyTurn=state;enemyTurn.side=1
  assert(BattleActionQuery.options(source:enemy,state:enemyTurn,data:data,spells:spells,labels:labels).0.isEmpty,"AI phase cannot open manual actions")
  assert(BattleActionQuery.spellReason(10,source:enemy,target:source,state:enemyTurn,data:data,spells:spells) != nil,"AI phase rejects manual cast commands")
  assert(BattleActionQuery.options(source:source,state:far,data:data,spells:spells,labels:labels).0.contains{$0.id==10&&$0.enabled},"out-of-range skills may preview reach without confirming")
  let outside=BattleActionQuery.aim(kind:"skill",id:10,source:source,target:-1,state:far,data:data,spells:spells)
  assert(!outside.valid && outside.targets.isEmpty && !outside.range.isEmpty,"range preview works even without a legal target")
  var poor=state;poor.units[source].mp=0
  assert(BattleActionQuery.options(source:source,state:poor,data:data,spells:spells,labels:labels).0.allSatisfy{!$0.enabled&&$0.reason.contains("MP")},"MP shortage blocks confirmation")
  var group=state;group.units[source].job=27
  let area=BattleActionQuery.aim(kind:"skill",id:49,source:source,target:ally,state:group,data:data,spells:spells)
  assert(area.valid && Set(area.area.map{Tile(x:$0.x,y:$0.y)})==Set(AreaRules.cells(type:spells[49].area,from:group.units[source].tile,target:group.units[ally].tile)),"area uses original geometry")
  assert(state.randomState==rng && state.inventory==inventory && state.units[source]==before[source] && state.units[enemy]==before[enemy],"all previews leave RNG, inventory and actors unchanged")
  var used=state;used.units[source].hp=1
  assert(used.useItem(87,source:source,target:source,data:data))
  assert(used.units[source].hp==31 && used.inventory.filter{$0==87}.count==1 && used.units[source].acted && used.units[source].mp==50,"real item effect, one debit and action completion")
  var cast=state
  assert(cast.cast(10,source:source,target:enemy,data:data,catalog:spells))
  for _ in 0..<100 {
   guard let e=cast.spellExecution else{break}
   if !e.growth.isEmpty {assert(cast.acknowledgeSpellGrowth(id:e.id,revision:e.revision))}
   else {assert(cast.advanceSpellExecution(id:e.id,revision:e.revision,data:data,catalog:spells))}
  }
  assert(cast.spellExecution==nil && cast.units[source].mp==44 && cast.units[source].acted,"real staged cast debits MP once and completes action")
  print("PASS native action queries: manual targets, MP, owned item counts, range/area, nonmutating preview, promotion gate, real item/cast consumption")
 }
}
