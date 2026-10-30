import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildCampaign} from './unity/campaign.mjs';
import {repo,toolSettings} from './unity/environment.mjs';
const {project,exportConfig:configPath}=toolSettings();
const {default:sharp}=await import(pathToFileURL(path.join(repo,'web/node_modules/sharp/lib/index.js')));
const dataRoot=path.join(repo,'web/src/features/game-world/data');
const read=async name=>JSON.parse(await readFile(path.join(dataRoot,name),'utf8'));
const config=JSON.parse(await readFile(configPath,'utf8'));
const data=await read('story-site.json');
const monarchs=await read('monarch-motions.json');
const pilots=await read('motion-pilots.json');
const stage=data.stages.find(x=>x.id===config.visualStageId);
if(!stage) throw Error('Unknown visual stage');
const plans=[{url:stage.backgroundImages[0]?.image,name:'courtyard'},{url:stage.mapDetails[0]?.image,name:'battlefield'}];
const actors={};
for(const binding of config.actors){
 const model=binding.catalog==='monarch'?monarchs.find(x=>x.name===binding.match)?.stages[0]:binding.catalog==='pilot'?pilots.find(x=>x.id===binding.match):null;
 if(!model||!/^actor-[a-z0-9-]+$/.test(binding.assetName)||!['se','sw','ne','nw'].includes(binding.direction)||actors[binding.name]) throw Error('Invalid actor config: '+binding.name);
 actors[binding.name]={};
 for(const mode of ['scenario','combat']){
   const name=`${binding.assetName}-${mode}`;
   plans.push({url:`${model[mode]}/${binding.direction}-0-0.webp`,name});
   actors[binding.name][mode]='Campaign/'+name;
 }
}
if(new Set(plans.map(x=>x.name)).size!==plans.length) throw Error('Duplicate output asset name');
// Validate complete bindings and read all sources before writing generated files.
const campaign=buildCampaign(data,config,{background:'Campaign/courtyard',map:'Campaign/battlefield',actors});
const publicRoot=path.join(repo,'web/public');
for(const plan of plans){
 if(!plan.url?.startsWith('/images/')) throw Error('Invalid image path');
 const source=path.resolve(publicRoot,plan.url.slice(1));
 if(!source.startsWith(publicRoot+path.sep)) throw Error('Asset path outside public folder');
 plan.input=await readFile(source);
}
const output=path.join(project,'Assets/Resources/Campaign');
await mkdir(output,{recursive:true});
const files=[];
for(const plan of plans){
 const target=path.join(output,plan.name+'.png');
 await sharp(plan.input).png({palette:true,quality:90,effort:8}).toFile(target);
 files.push({source:plan.url,target:'Campaign/'+plan.name,sha256:createHash('sha256').update(plan.input).digest('hex'),bytes:(await stat(target)).size});
}
await writeFile(path.join(output,'campaign.json'),JSON.stringify(campaign));
await writeFile(path.join(project,'export-manifest.json'),JSON.stringify({source:'web/src/features/game-world/data/story-site.json',stageCount:campaign.stages.length,visualStages:[config.visualStageId],files},null,2)+'\n');
console.log(`Exported ${campaign.stages.length} script packages; visual: ${config.visualStageId}; ${files.length} images, ${files.reduce((n,x)=>n+x.bytes,0)} bytes. No combat rules implemented.`);
