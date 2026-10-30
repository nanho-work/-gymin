import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {repo,toolSettings} from './unity/environment.mjs';
const {project,originalAssets}=toolSettings();const {default:sharp}=await import(pathToFileURL(path.join(repo,'web/node_modules/sharp/lib/index.js')));
const units=JSON.parse(await readFile(path.join(project,'Assets/Resources/Battle/first-units.json'))).units;
const spells=JSON.parse(await readFile(path.join(originalAssets,'original-spells.json'))),source=JSON.parse(await readFile(path.join(originalAssets,'campaign-effects.json')));
const selected=spells.filter(s=>s.id>=0&&s.id<68);const atlases=new Map();let bytes=0;
for(const spell of selected){const id=source.mapping[spell.id];if(id<0||atlases.has(id))continue;const e=source.effects[id];if(!e?.frames.length)throw Error('Missing original effect '+spell.id);
 const layers=[];for(let i=0;i<e.frames.length;i++)layers.push({input:await readFile(path.join(originalAssets,e.frames[i].image)),left:(i%8)*e.width,top:Math.floor(i/8)*e.height});
 const height=Math.ceil(e.frames.length/8)*e.height,key='Battle/Presentation/spell-'+id;
 const image=await sharp({create:{width:e.width*8,height,channels:4,background:'#00000000'}}).composite(layers).png({palette:true,quality:100,effort:8}).toBuffer();await writeFile(path.join(project,'Assets/Resources',key+'.png'),image);bytes+=image.length;atlases.set(id,{atlas:key,atlasHeight:height,...e});
}
await writeFile(path.join(project,'Assets/Resources/Battle/Presentation/spells.json'),JSON.stringify({records:selected.map(s=>({id:s.id,name:s.name,...(source.mapping[s.id]<0?{name:s.name,atlas:"",atlasHeight:0,width:0,height:0,interval:.1,sound:-1,frames:[]}:atlases.get(source.mapping[s.id]))}))}));
console.log(`${selected.length} skills, ${atlases.size} shared original effect atlases, ${bytes} bytes`);
