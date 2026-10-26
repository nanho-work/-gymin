import data from '../data/items.json';
import weapons from '../data/weapon-proposals.json';
import armor from '../data/armor-proposals.json';
import accessories from '../data/accessory-proposals.json';
import consumables from '../data/consumable-proposals.json';
import companions from '../data/companion-equipment.json';
export const itemMenus=[['weapons','무기'],['armor','방어구'],['accessories','보조'],['treasures','보물'],['consumables','소모품']] as const;
export type ItemMenu=typeof itemMenus[number][0];
const treasures=new Set([...Array.from({length:17},(_,i)=>21+i),...Array.from({length:9},(_,i)=>44+i),55,56,60,61,62,63,69,...Array.from({length:15},(_,i)=>72+i)]);
const proposals=[...weapons.records,...armor.records,...accessories.records,...consumables.records];
export type CatalogItem={id:string;menu:ItemMenu;name:string;family:string;image:string;description:string;effect:string;stats:[string,string][];jobs:string[];wearers:string[];price:number|null;draft:boolean};
function clean(text:string){return text.replace(/원본 수치·조건 유지|원본 효과 유지|원본 수치 유지/g,'').replace(/원본 /g,'').replace(/게임용 창작 설정\.|실존 유물·전승이 아닌 게임용 창작안\./g,'').replace(/ · $/,'').trim();}
export const catalog:CatalogItem[]=data.records.map(i=>{
 const p=proposals.find(p=>p.originalId===i.id)!;
 const menu:ItemMenu=i.category==='소모품'?'consumables':treasures.has(i.id)?'treasures':i.category==='무기'?'weapons':i.category==='방어구'?'armor':'accessories';
 const stats:[string,string][]=[];
 if(i.category==='무기'||i.category==='방어구'){
 stats.push([i.category==='방어구'?'기본 방어력':['부채','보검'].includes(i.family)?'기본 정신력':'기본 공격력',String(i.base)],['성장값',String(i.growth)],['강화 한도',`${treasures.has(i.id)?9:3}강`]);
 }else if(i.category==='소모품'){
 const label=i.id<=89?'HP 회복':i.id<=91?'MP 회복':i.id>=98&&i.id<=102?['무력','지력','통솔력','민첩성','운'][i.id-98]+' 증가':i.id===103?'경험치 증가':'';
 if(label)stats.push([label,i.id===89?'전부':String(i.base)]);
 stats.push(['사용 방식','사용 시 소모']);
 }else {
 const labels:Record<number,string>={59:'이동력 증가',60:'이동력 증가',61:'이동력 증가',64:'최대 MP 증가',65:'최대 MP 증가',66:'최대 MP 증가',67:'최대 MP 증가',68:'최대 MP 증가',69:'최대 MP 증가',73:'턴당 경험치',79:'턴당 무기 경험치',80:'턴당 방어구 경험치'};
 if(labels[i.id])stats.push([labels[i.id],String(i.base)]);
 }
 const family='family' in p?String(p.family):i.family==='곤봉'?'몽둥이':i.family;
 return {id:`item-${i.id}`,menu,name:p.name,family,image:p.image,description:clean(p.description),effect:clean(p.effect),stats,jobs:i.allowedJobs,wearers:p.folklore.filter(f=>/배정 제안|착용 제안/.test(f.status)&&!f.status.includes('비배정')).map(f=>f.name),price:i.purchasePrice,draft:false};
});
for(const c of companions.records){catalog.push({id:`companion-${c.characterId}`,menu:'treasures',name:c.treasureName,family:`${c.family} · 고유 무기`,image:c.image,description:weapons.signatures.find(s=>s.characterId===c.characterId)?.description||c.role,effect:c.option,stats:[['기본 능력값',String(c.base)],['강화당 증가',String(c.growth)],['강화 한도',`${c.maxUpgrade}강`]],jobs:[],wearers:[c.name],price:null,draft:true});}

// Explicit effect groups avoid matching incidental words in lore descriptions.
const effectIds:Record<string,number[]>={
 '방어·회피':[23,24,25,44,45,46,47,48,49,53,54,55,56,57,58],
 '이동':[59,60,61,62,63], '명중':[36,70,71],
 '기력':[35,37,51,64,65,66,67,68,69],
 '회복':[52,75,76,77,81], '성장':[73,74,79,80],
 '공격':[21,22,26,27,31,82], '상태이상':[28,29,30,32],
 '책략':[33,34,50,78,83,84,85,86], '공격 범위':[72]
};
const companionEffects:Record<string,string[]>={18:['책략'],24:['방어·회피'],25:['명중','상태이상'],1001:['책략'],1002:['공격'],1003:['방어·회피'],1004:['책략'],1005:['회복'],1006:['공격'],1007:['방어·회피']};
export function itemFamily(item:CatalogItem){return item.family.split(' · ')[0].replace('곤봉','몽둥이');}
export function itemEffects(item:CatalogItem):string[]{
 if(item.id.startsWith('companion-'))return companionEffects[item.id.slice(10)]||[];
 const id=Number(item.id.slice(5));
 if(item.menu==='consumables')return [id<=89?'HP 회복':id<=91?'MP 회복':id<=96?'상태이상 해제':'성장·승급'];
 return Object.entries(effectIds).filter(([,ids])=>ids.includes(id)).map(([label])=>label);
}
