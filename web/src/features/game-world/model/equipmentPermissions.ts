import items from '../data/items.json';
// 사용자 확정 규칙. 원본 추출 데이터는 보존한다.
const armorJobs=new Set(items.records.filter(i=>i.category==='방어구'&&i.family==='갑옷').flatMap(i=>i.allowedJobs));
const clothAccessories=new Set([67,68,69,70]); // 복건·관건·제갈건·무명장갑
export const banditJobs=['적병','의적','호걸'];
const casterJobs=['책사','참모','군사','기마책사','기마참모','기마군사','도사','환술사','요술사','풍수사','방술사','선술사','주술사','선인'];
const magicOnly:Record<number,string[]>={
 73:casterJobs,76:casterJobs,77:casterJobs,78:casterJobs,
 83:['기마책사','기마참모','기마군사'],84:['책사','참모','군사'],
 85:['도사','환술사','요술사'],86:['풍수사','방술사','선술사'],
};
export function restrictedEquipmentJobs(id:number){return id===59?['경포차','중포차','벽력차']:id===72?banditJobs:magicOnly[id];}
export function equipmentRestriction(id:number){
 if(id===59)return '포차 계열(경포차·중포차·벽력차) 전용';
 if(magicOnly[id])return id>=83?magicOnly[id].join('·')+' 전용':'마법 병과 전용 · 물리 병과 착용 불가';
 return id===72?'산적 계열(적병·의적·호걸) 전용':clothAccessories.has(id)?'갑옷 병과 착용 불가 · 그 외 병과의 개별 허용 조건은 별도 적용':'';
}
export function passesEquipmentRestriction(id:number,job:string){
 const jobs=restrictedEquipmentJobs(id);
 if(jobs)return jobs.includes(job);
 return !(clothAccessories.has(id)&&armorJobs.has(job));
}
