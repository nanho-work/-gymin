import items from '../data/items.json';
import weapons from '../data/weapon-proposals.json';
import armor from '../data/armor-proposals.json';
import accessories from '../data/accessory-proposals.json';
export type Loadout = {weapon:number; armor:number; accessory:number};
export const defaultLoadout:Loadout={weapon:3,armor:38,accessory:-1};
export type Slot=keyof Loadout;
const excluded=new Set([59,64,65,66,67,68,69,72,83,84,85,86]);
const mounts=new Set([60,61,62,63]);
const horseArmor=new Set([57,58]);
const proposals=[...weapons.records,...armor.records,...accessories.records];
export const hongEquipment=items.records.filter(i=>i.category==='보조구'||i.allowedJobs.includes('경기병')).map(i=>{
 const p=proposals.find(p=>p.originalId===i.id);
 const slot:Slot=i.category==='무기'?'weapon':i.category==='방어구'?'armor':'accessory';
 const visible=slot!=='accessory'||mounts.has(i.id)||horseArmor.has(i.id);
 const allowed=slot!=='accessory'||!excluded.has(i.id);
 return {...i,name:p?.name||i.name,originalName:i.name,image:p?.image||i.image,slot,allowed,visible,
  treasure:slot==='weapon'?i.id>=21:slot==='armor'?i.id>=44:[55,56,60,61,62,63,69,...Array.from({length:15},(_,n)=>72+n)].includes(i.id),
  permission:slot!=='accessory'?'원본 경기병 허용표':!allowed?'타 병과 전용 · 홍유 제외':horseArmor.has(i.id)?'기병 전용 · 기본 말에만 표시':mounts.has(i.id)?'기마 탈것 교체 · 마갑과 동시 착용 불가':'공용 후보 · 원본 보조 허용표 미확정',
  status:!allowed?'제외':!visible?'상시 외형 미표시':'4방향 조합 외형 초안',
  layer:slot==='weapon'?'weaponBack / weaponFront':slot==='armor'?'torsoArmor / armArmor':mounts.has(i.id)?'mount':horseArmor.has(i.id)?'mountArmor':'상시 레이어 없음',
 };
});
export const layerOrder=['mountBack','weaponBack','mount','mountArmor','riderBody','torsoArmor','armBack','weaponFront','armFront','effect'];
// All visible equipment is available as modular four-direction art. Motion is a rig draft.
export function resolveHongPreview(loadout:Loadout){
 const selected=Object.entries(loadout).map(([slot,id])=>hongEquipment.find(i=>i.slot===slot&&i.id===id));
 const complete=selected[0]?.allowed===true&&selected[1]?.allowed===true&&(loadout.accessory===-1||selected[2]?.allowed===true);
 return {complete,mode:'layer-rig-draft' as const,displayed:[selected[0]?.name,selected[1]?.name,selected[2]?.visible?selected[2].name:'기본 말'].filter(Boolean).join(' + ')};
}
