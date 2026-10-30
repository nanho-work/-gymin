import Foundation
// Presentation facts only. No RNG calls or rule mutations.
struct HostResultHint:Encodable {
 let id:Int;let kind:String;let landed:Bool;let critical:Bool
}
struct HostFeedback:Encodable {
 let id:Int;let x:Int;let y:Int;let hpBefore:Int;let hpAfter:Int;let mpBefore:Int;let mpAfter:Int;let maxHP:Int;let maxMP:Int
 let kind:String;let hasOutcome:Bool;let landed:Bool;let critical:Bool
}
enum BattleFeedback {
 static func changes(before:[CampaignUnit],state:CampaignState,data:CampaignData,hints:[HostResultHint])->[HostFeedback] {
  state.units.compactMap{unit in
   guard let old=before.first(where:{$0.id==unit.id}),!old.hidden,old.hp>0 else{return nil}
   let hint=hints.first{$0.id==unit.id}
   guard old.hp != unit.hp || old.mp != unit.mp || hint != nil else{return nil}
   let stats=state.displayed(unit,data:data),tile=unit.hidden ? old.tile:unit.tile
   return HostFeedback(id:unit.id,x:tile.x,y:tile.y,hpBefore:old.hp,hpAfter:unit.hp,mpBefore:old.mp,mpAfter:unit.mp,maxHP:stats[5],maxMP:stats[6],kind:hint?.kind ?? "change",hasOutcome:hint != nil,landed:hint?.landed ?? true,critical:hint?.critical ?? false)
  }
 }
 static func physical(_ e:CampaignPhysicalExecution,state:CampaignState)->[HostResultHint] {
  let strike=e.action.exchange.group.strike
  guard strike.phase == .numberPanel,strike.hits.indices.contains(strike.targetCursor) else{return []}
  let hit=strike.hits[strike.targetCursor]
  return [HostResultHint(id:state.units[hit.target].id,kind:"attack",landed:hit.landed,critical:hit.critical)]
 }
 static func spell(_ e:CampaignSpellExecution,state:CampaignState)->[HostResultHint] {
  let a=e.action
  guard [.numberPanel,.statusEffect].contains(a.phase),a.applicationOrder.indices.contains(a.cursor) else{return []}
  let hit=a.hits[a.applicationOrder[a.cursor]]
  // Original damage-event landed flag is amount > 0 for these spell families.
  // Status-only rolls are not persisted by the original stage: never invent a miss.
  if (0...22).contains(a.spell)||[64,65].contains(a.spell) {
   return [HostResultHint(id:state.units[hit.target].id,kind:"spell",landed:hit.amount>0,critical:false)]
  }
  if (39...45).contains(a.spell) {
   return [HostResultHint(id:state.units[hit.target].id,kind:"heal",landed:true,critical:false)]
  }
  return []
 }
}
