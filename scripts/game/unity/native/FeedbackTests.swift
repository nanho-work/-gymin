import Foundation
@main struct FeedbackTests {
 static func main() throws {
  let root=URL(fileURLWithPath:CommandLine.arguments[1])
  let data=try JSONDecoder().decode(CampaignData.self,from:Data(contentsOf:root.appendingPathComponent("first-battle.json")))
  var state=CampaignState(data:data);let target=state.index(146)!,source=state.index(0)!
  state.units[source].hidden=false;state.units[source].hp=40;state.units[source].mp=20
  state.units[target].hidden=false;state.units[target].hp=40;state.units[target].mp=15
  let before=state.units;let rng=state.randomState
  state.units[target].hp=0;state.units[target].mp=4
  var result=BattleFeedback.changes(before:before,state:state,data:data,hints:[HostResultHint(id:146,kind:"attack",landed:true,critical:true)])
  assert(result.count==1 && result[0].hpBefore==40 && result[0].hpAfter==0 && result[0].mpBefore==15 && result[0].mpAfter==4 && result[0].critical,"lethal/capped HP and shield MP loss use actual state")
  state.units=before
  result=BattleFeedback.changes(before:before,state:state,data:data,hints:[HostResultHint(id:146,kind:"attack",landed:false,critical:true)])
  assert(result.count==1 && !result[0].landed && result[0].hpAfter==40,"miss remains visible with zero delta")
  result=BattleFeedback.changes(before:before,state:state,data:data,hints:[HostResultHint(id:146,kind:"attack",landed:true,critical:false)])
  assert(result.count==1 && result[0].landed,"immune zero damage remains distinct from miss")
  state.units[target].hp=50;state.units[source].mp=14
  result=BattleFeedback.changes(before:before,state:state,data:data,hints:[])
  assert(result.count==2 && result.contains{$0.id==146&&$0.hpAfter-$0.hpBefore==10} && result.contains{$0.id==0&&$0.mpAfter-$0.mpBefore == -6},"healing and caster MP cost are separate facts")
  state.units=before
  let hidden=state.units.indices.first{state.units[$0].hidden}!
  state.units[hidden].hidden=false;state.units[hidden].hp=20
  result=BattleFeedback.changes(before:before,state:state,data:data,hints:[])
  assert(result.isEmpty,"spawns never appear as healing")
  assert(state.randomState==rng,"feedback does not draw new randomness")
  var criticalSeen=false,missSeen=false,counterSeen=false
  for mode in 0...1 {for seed in 1...16 {
   var fight=CampaignState(data:data)
   for i in fight.units.indices {fight.units[i].hidden=true}
   for (i,tile,side) in [(source,Tile(x:10,y:10),0),(target,Tile(x:10,y:11),1)] {
    fight.units[i].hidden=false;fight.units[i].hp=120;fight.units[i].job=3;fight.units[i].level=10;fight.units[i].tile=tile;fight.units[i].side=side;fight.units[i].controlMode=side==0 ? 7:0;fight.units[i].gear=[255,255,255];fight.units[i].stats=[40,80,40,40,40,200,40]
   }
   fight.units[source].stats[3]=mode==0 ? 1:255;fight.units[target].stats[3]=mode==0 ? 255:1
   fight.units[source].stats[4]=255;fight.units[target].stats[4]=1;fight.randomState=UInt32(seed)
   assert(fight.beginPhysicalExecution(source,target:target,data:data))
   for _ in 0..<200 {
    guard let execution=fight.physicalExecution else{break}
    if !execution.growth.isEmpty {assert(fight.acknowledgePhysicalGrowth(id:execution.id,revision:execution.revision));continue}
    let units=fight.units,hints=BattleFeedback.physical(execution,state:fight),random=fight.randomState
    assert(fight.randomState==random)
    assert(fight.advancePhysicalExecution(id:execution.id,revision:execution.revision,data:data))
    let changes=BattleFeedback.changes(before:units,state:fight,data:data,hints:hints)
    for hint in hints {
     let value=changes.first{$0.id==hint.id}!
     assert(value.landed==hint.landed && value.critical==hint.critical)
     let old=units.first{$0.id==hint.id}!,current=fight.units.first{$0.id==hint.id}!
     assert(value.hpBefore==old.hp && value.hpAfter==current.hp && value.mpAfter==current.mp)
     missSeen = missSeen || !hint.landed;criticalSeen = criticalSeen || (hint.landed&&hint.critical)
     counterSeen = counterSeen || execution.action.exchange.group.strike.counter
    }
   }
   assert(fight.physicalExecution==nil)
  }}
  assert(criticalSeen&&missSeen&&counterSeen,"real strike stages cover critical, miss and counter target")
  var heal=CampaignState(data:data)
  for i in heal.units.indices {heal.units[i].hidden=true}
  for (i,tile) in [(source,Tile(x:10,y:10)),(target,Tile(x:11,y:10))] {
   heal.units[i].hidden=false;heal.units[i].hp=1;heal.units[i].tile=tile;heal.units[i].side=0;heal.units[i].controlMode=7;heal.units[i].gear=[255,255,255]
  }
  heal.units[source].job=0;heal.units[source].level=10;heal.units[source].mp=50
  let spells=try JSONDecoder().decode([OriginalSpell].self,from:Data(contentsOf:root.appendingPathComponent("original-spells.json")))
  assert(heal.cast(39,source:source,target:target,data:data,catalog:spells))
  var healingSeen=false,costSeen=false
  for _ in 0..<100 {
   guard let execution=heal.spellExecution else{break}
   if !execution.growth.isEmpty {assert(heal.acknowledgeSpellGrowth(id:execution.id,revision:execution.revision));continue}
   let units=heal.units,hints=BattleFeedback.spell(execution,state:heal)
   assert(heal.advanceSpellExecution(id:execution.id,revision:execution.revision,data:data,catalog:spells))
   let changes=BattleFeedback.changes(before:units,state:heal,data:data,hints:hints)
   healingSeen = healingSeen || changes.contains{$0.id==146&&$0.hpAfter>$0.hpBefore&&$0.kind=="heal"}
   costSeen = costSeen || changes.contains{$0.id==0&&$0.mpAfter-$0.mpBefore == -6}
  }
  assert(healingSeen&&costSeen&&heal.spellExecution==nil,"real heal and caster MP use generate separate matching results")
  print("PASS real physical critical/miss/counter and staged healing/MP feedback")
  print("PASS native feedback: actual capped/lethal HP and MP changes, critical/miss/zero distinction, healing, caster cost, spawn exclusion, unchanged RNG")
 }
}
