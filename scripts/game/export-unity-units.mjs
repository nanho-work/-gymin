import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
import {repo,toolSettings} from './unity/environment.mjs';
import {buildInitialDeployment} from './unity/deployment.mjs';
const {project,originalAssets}=toolSettings();
const {default:sharp}=await import(pathToFileURL(path.join(repo,'web/node_modules/sharp/lib/index.js')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=async p=>JSON.parse(await readFile(p));
const sourceNames=['first-battle.json','campaign/battle-00.json'];
const sourceBytes=await Promise.all(sourceNames.map(p=>readFile(path.join(originalAssets,p))));
const root=path.join(repo,'web/src/features/game-world/data');
const catalogNames=['characters.json','motion-pilots.json','monarch-motions.json','special-motions.json'];
const catalogBytes=await Promise.all(catalogNames.map(n=>readFile(path.join(root,n))));
const [chars,pilots,monarchs,specials]=catalogBytes.map(b=>JSON.parse(b));
const units=buildInitialDeployment(JSON.parse(sourceBytes[0]),JSON.parse(sourceBytes[1]),chars.records,pilots,monarchs,specials);
const output=path.join(project,'Assets/Resources/Battle');await mkdir(output,{recursive:true});
const cache=new Map(),assets=[];
for(const u of units){
 if(!u.image.startsWith('/images/'))throw Error('Invalid model path');
 if(!cache.has(u.image)){
  const source=path.resolve(repo,'web/public',u.image.slice(1));
  if(!source.startsWith(path.join(repo,'web/public/images')+path.sep))throw Error('Model path escaped public images');
  const input=await readFile(source);const key='Battle/unit-'+hash(input).slice(0,16);
  // Static idle frame: transparent crop, same feet anchor; no new generated artwork.
  await sharp(input).trim().resize({width:128,height:128,fit:'inside',withoutEnlargement:true}).png({palette:true,quality:90,effort:8}).toFile(path.join(project,'Assets/Resources',key+'.png'));
  assets.push({source:u.image,key,sha256:hash(input),bytes:(await stat(path.join(project,'Assets/Resources',key+'.png'))).size});cache.set(u.image,key);
 }
 u.texture=cache.get(u.image);
}
const visible=units.filter(u=>u.state==='deployed'),occupied=new Set();
for(const u of visible){const key=`${u.x},${u.y}`;if(occupied.has(key))throw Error('Initial occupancy collision');occupied.add(key);}
await writeFile(path.join(output,'first-units.json'),JSON.stringify({schemaVersion:1,stageId:'B00',snapshot:'after-setup-before-turn-events',units}));
const sources=sourceBytes.map((b,i)=>({file:sourceNames[i],sha256:hash(b)}));
await writeFile(path.join(project,'units-export-manifest.json'),JSON.stringify({schemaVersion:1,sources,catalogs:catalogBytes.map((b,i)=>({file:catalogNames[i],sha256:hash(b)})),snapshot:'B00 setup complete; staged retirements applied; no turn events or AI simulated',facingMap:['0=nw','1=ne','2=se','3=sw'],assets,counts:{deployed:visible.length,reserve:units.filter(u=>u.state==='reserve').length,retired:units.filter(u=>u.state==='retired').length},limits:['No runtime EEX execution','HP/MP/combat stats not computed','Reserve units are not auto-spawned until event engine is implemented']},null,2)+'\n');
console.log(`B00 units: ${visible.length} deployed, ${units.filter(u=>u.state==='reserve').length} reserve, ${units.filter(u=>u.state==='retired').length} opening retirements; ${assets.length} small shared images, ${assets.reduce((n,a)=>n+a.bytes,0)} bytes.`);
