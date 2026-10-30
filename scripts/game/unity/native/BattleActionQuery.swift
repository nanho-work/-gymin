import Foundation
struct ActionCell:Encodable {let x:Int;let y:Int}
struct ActionLabel:Decodable {let id:Int;let name:String;let description:String;let icon:String?}
struct ActionLabels:Decodable {let skills:[ActionLabel];let items:[ActionLabel]}
struct HostAction:Encodable {let id:Int;let name:String;let description:String;let icon:String;let cost:Int;let count:Int;let enabled:Bool;let reason:String}
struct HostAim:Encodable {let kind:String;let id:Int;let target:Int;let valid:Bool;let reason:String;let range:[ActionCell];let area:[ActionCell];let targets:[Int];let affected:[Int]}
enum BattleActionQuery {
 static func cells(_ tiles:[Tile],_ data:CampaignData)->[ActionCell] {Array(Set(tiles)).filter{(0..<data.width).contains($0.x)&&(0..<data.height).contains($0.y)}.sorted{$0.y == $1.y ? $0.x<$1.x:$0.y<$1.y}.map{ActionCell(x:$0.x,y:$0.y)}}
 static func allTiles(_ data:CampaignData)->[Tile] {(0..<data.height).flatMap{y in (0..<data.width).map{Tile(x:$0,y:y)}}}
 static func selfCentered(_ spell:Int)->Bool {(58...63).contains(spell)||[14,66,67].contains(spell)}
 static func spellReason(_ id:Int,source:Int,target:Int,state:CampaignState,data:CampaignData,spells:[OriginalSpell])->String? {
  guard state.side==0,state.canAct(source) else{return "이 부대는 지금 행동할 수 없습니다"}
  guard spells.indices.contains(id),state.units.indices.contains(target),state.units[target].alive else{return "살아 있는 부대를 선택하세요"}
  if selfCentered(id)&&source != target{return "자신을 선택하면 지정된 전체 대상에 적용됩니다"}
  return OriginalSpells.rejection(spells[id],catalog:spells,units:state.field(data:data),source:source,target:target,weather:state.environment.weather)
 }
 static func itemReason(_ id:Int,source:Int,target:Int,state:CampaignState,data:CampaignData)->String? {
  guard state.side==0,state.canAct(source) else{return "이 부대는 지금 행동할 수 없습니다"}
  guard data.items.indices.contains(id),(63...76).contains(data.items[id].type),state.inventory.contains(id) else{return "사용할 수 있는 소모품이 없습니다"}
  guard state.units.indices.contains(target),state.units[target].alive,state.units[target].side != 1 else{return "살아 있는 아군을 선택하세요"}
  let a=state.units[source].tile,b=state.units[target].tile
  guard max(abs(a.x-b.x),abs(a.y-b.y))<=1 else{return "자신 또는 주변 8칸의 아군에게 사용할 수 있습니다"}
  guard state.itemEffectAllowed(id,target:target,data:data) else{return "대상의 레벨·승급 조건을 확인하세요"}
  return nil
 }
 static func aim(kind:String,id:Int,source:Int,target:Int,state:CampaignState,data:CampaignData,spells:[OriginalSpell])->HostAim {
  let isSpell=kind=="skill",field=state.field(data:data),a=state.units[source].tile
  let candidates=state.units.indices.filter{state.units[$0].alive && (isSpell ? spellReason(id,source:source,target:$0,state:state,data:data,spells:spells)==nil:itemReason(id,source:source,target:$0,state:state,data:data)==nil)}
  var range:[Tile]=[],area:[Tile]=[],affected:[Int]=[]
  if isSpell,spells.indices.contains(id) {
   let spell=spells[id]
   range=selfCentered(id) ? [a]:allTiles(data).filter{OriginalSpells.rangeContains(spell.range,friendly:spell.side==1,from:a,to:$0)}
   if state.units.indices.contains(target) {
    area=[14,66,67].contains(id) ? allTiles(data):(58...63).contains(id) ? [a]:AreaRules.cells(type:spell.area,from:a,target:id==64 ? a:state.units[target].tile)
    affected=OriginalSpells.targets(spell,field,source:source,target:target).map{state.units[$0].id}
   }
  } else if !isSpell {
   range=(-1...1).flatMap{dy in (-1...1).map{Tile(x:a.x+$0,y:a.y+dy)}}
   if state.units.indices.contains(target){area=[state.units[target].tile];affected=[state.units[target].id]}
  }
  let prompt=candidates.isEmpty ? "사거리 안에 사용 가능한 대상이 없습니다":selfCentered(id)&&isSpell ? "자신을 선택하면 정해진 대상에 적용됩니다":"지도에서 대상을 선택하세요"
  let reason=target<0 ? prompt:isSpell ? spellReason(id,source:source,target:target,state:state,data:data,spells:spells):itemReason(id,source:source,target:target,state:state,data:data)
  return HostAim(kind:kind,id:id,target:state.units.indices.contains(target) ? state.units[target].id:-1,valid:target>=0&&reason==nil,reason:target<0 ? prompt:reason ?? "",range:cells(range,data),area:cells(area,data),targets:candidates.map{state.units[$0].id},affected:affected)
 }
 static func options(source:Int,state:CampaignState,data:CampaignData,spells:[OriginalSpell],labels:ActionLabels)->([HostAction],[HostAction]) {
  guard state.side==0,state.canAct(source) else{return ([],[])}
  let field=state.field(data:data),fighter=field[source].fighter
  let learned=OriginalSpells.available(spells,units:field,source:source).sorted()
  let skills=learned.map{id -> HostAction in
   let spell=spells[id],label=labels.skills.first{$0.id==id},cost=MagicEquipment.cost(spell.mp,fighter)
   let legal=state.units.indices.contains{state.units[$0].alive&&spellReason(id,source:source,target:$0,state:state,data:data,spells:spells)==nil}
   let ready=fighter.mp>=cost && !fighter.status.silenced && OriginalSpells.sourceRejection(spell,fighter,weather:state.environment.weather)==nil
   let reason=fighter.mp<cost ? "MP가 부족합니다":OriginalSpells.sourceRejection(spell,fighter,weather:state.environment.weather) ?? (fighter.status.silenced ? "스킬을 사용할 수 없는 상태입니다":legal ? "":"사거리 안에 사용 가능한 대상이 없습니다")
   return HostAction(id:id,name:label?.name ?? spell.name,description:label?.description ?? "",icon:"",cost:cost,count:0,enabled:ready,reason:reason)
  }
  let items=Set(state.inventory).sorted().filter{data.items.indices.contains($0)&&(63...76).contains(data.items[$0].type)}.map{id -> HostAction in
   let label=labels.items.first{$0.id==id},legal=state.units.indices.contains{itemReason(id,source:source,target:$0,state:state,data:data)==nil}
   return HostAction(id:id,name:label?.name ?? data.items[id].name,description:label?.description ?? "",icon:label?.icon ?? "",cost:0,count:state.inventory.filter{$0==id}.count,enabled:legal,reason:legal ? "":"사거리 안에 조건을 만족하는 아군이 없습니다")
  }
  return (skills,items)
 }
}
