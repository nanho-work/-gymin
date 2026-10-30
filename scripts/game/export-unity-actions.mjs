import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {repo,toolSettings} from './unity/environment.mjs';
const {project}=toolSettings();const {default:sharp}=await import(pathToFileURL(path.join(repo,'web/node_modules/sharp/lib/index.js')));
const data=path.join(repo,'web/src/features/game-world/data'),load=async name=>JSON.parse(await readFile(path.join(data,name+'.json'),'utf8')).records;
const skills=await load('skills'),skillNames=await load('skill-candidates'),items=await load('items'),proposals=await load('item-proposals');
const out=path.join(project,'Assets/Resources/Battle/Actions');await mkdir(out,{recursive:true});let bytes=0;
const records=[];for(const item of items.filter(x=>x.type>=63&&x.type<=76)){
 const proposal=proposals.find(p=>p.originalId===item.id),icon='Battle/Actions/item-'+item.id;
 const image=await sharp(path.join(repo,'web/public',proposal?.image??item.image)).resize(48,48,{fit:'contain',background:'#00000000'}).png({palette:true,quality:90,effort:8}).toBuffer();await writeFile(path.join(project,'Assets/Resources',icon+'.png'),image);bytes+=image.length;
 records.push({id:item.id,name:proposal?.name??item.replacement??item.name,description:proposal?.description??item.description,icon});
}
const catalog={skills:skills.map(s=>{const alias=skillNames.find(x=>x.id===s.id);return{id:s.id,name:alias?.name??s.name,description:alias?.description??s.description};}),items:records};
await writeFile(path.join(out,'catalog.json'),JSON.stringify(catalog));console.log(`${catalog.skills.length} skill labels, ${records.length} usable item icons: ${bytes} bytes`);
