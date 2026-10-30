
import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';import path from 'node:path';import {createHash} from 'node:crypto';
import {repo,toolSettings} from './unity/environment.mjs';
const {project,originalAssets}=toolSettings(),source=path.dirname(originalAssets);
const temp=path.join(project,'Library/SanhaNative');await mkdir(temp,{recursive:true});
const script=await readFile(path.join(source,'test.sh'),'utf8');
const line=script.split('\n').find(l=>l.startsWith('swiftc ')&&l.includes('CampaignTests.swift'));
if(!line)throw Error('Missing existing core compile recipe');
let names=line.slice(line.indexOf(' Movement.swift')+1,line.indexOf(' CampaignTests.swift')).split(/\s+/);
names=names.filter(n=>n.endsWith('.swift'));
for(const n of ['CampaignJourney.swift','CampaignCatalog.swift','CampaignAlignment.swift','OriginalScenarioCamera.swift','PhysicalPresentation.swift','SpellPresentation.swift'])if(!names.includes(n))names.push(n);
const cinema=await readFile(path.join(source,'CampaignCinema.swift'),'utf8');
await writeFile(path.join(temp,'CinemaData.swift'),cinema.slice(0,cinema.indexOf('// Explicit drawing')).replace('import Cocoa','import Foundation'));
const files=names.map(n=>path.join(source,n));
files.push(path.join(repo,'scripts/game/unity/native/BattleFeedback.swift'));
if(process.argv.includes('--check-actions')||process.argv.includes('--check-feedback')){
 const test=process.argv.includes('--check-feedback')?'FeedbackTests.swift':'ActionQueryTests.swift';
 const exe=path.join(temp,'action-query-tests');
 await new Promise((resolve,reject)=>{const p=spawn('/usr/bin/swiftc',['-module-cache-path',path.join(temp,'ModuleCache'),...files,path.join(temp,'CinemaData.swift'),path.join(repo,'scripts/game/unity/native/BattleActionQuery.swift'),path.join(repo,'scripts/game/unity/native/'+test),'-o',exe],{stdio:'inherit'});p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error('Action test compile failed')));});
 await new Promise((resolve,reject)=>{const p=spawn(exe,[originalAssets,path.join(project,'Assets/Resources/Battle/Actions/catalog.json')],{stdio:'inherit'});p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error('Action tests failed')));});
 process.exit(0);
}
const native=path.join(project,'Assets/StreamingAssets/SanhaNative');await mkdir(native,{recursive:true});
for(const n of ['first-battle.json','original-spells.json','original-tutorial-text.json'])await copyFile(path.join(originalAssets,n),path.join(native,n));
for(const n of await readdir(originalAssets))if(/^SE(?:_M_|_E_)?\d{2}\.WAV$/.test(n))await copyFile(path.join(originalAssets,n),path.join(native,n));
const presentation=path.join(project,'Assets/Resources/Battle/Presentation');await mkdir(presentation,{recursive:true});
const exporter=path.join(temp,'export-presentation');
await new Promise((resolve,reject)=>{const p=spawn('/usr/bin/swiftc',['-module-cache-path',path.join(temp,'ModuleCache'),...['OriginalMCALL.swift','OriginalMCALLPixels.swift','OriginalMCALLPalette.swift','OriginalMCALLRenderer.swift'].map(n=>path.join(source,n)),path.join(repo,'scripts/game/unity/native/PresentationExport.swift'),'-o',exporter],{stdio:'inherit'});p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error('Presentation export compile failed')));});
await new Promise((resolve,reject)=>{const p=spawn(exporter,[originalAssets,presentation],{stdio:'inherit'});p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error('Presentation export failed')));});
await copyFile(path.join(project,'Assets/Resources/Battle/Actions/catalog.json'),path.join(native,'action-labels.json'));
const bin=path.join(native,'sanha-battle');
const args=['-module-cache-path',path.join(temp,'ModuleCache'),...files,path.join(temp,'CinemaData.swift'),path.join(repo,'scripts/game/unity/native/BattleActionQuery.swift'),path.join(repo,'scripts/game/unity/native/BattleHost.swift'),'-o',bin];
await new Promise((resolve,reject)=>{const p=spawn('/usr/bin/swiftc',args,{stdio:'inherit'});p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error('Swift compile failed '+code)));});
const evidence=[];for(const f of files)evidence.push({file:f.startsWith(source+path.sep)?path.relative(source,f):path.relative(repo,f),sha256:createHash('sha256').update(await readFile(f)).digest('hex')});
await writeFile(path.join(project,'native-engine-manifest.json'),JSON.stringify({platform:'macOS local validation only',source:'existing Swift restoration core; readonly',sources:evidence,cinemaDataExtraction:'CampaignCinemaActor/Scene definitions only; no Cocoa UI',limits:['C# port and mobile backend remain future work','No original animation/audio timing claim','Unhandled modal/event fails visibly']},null,2)+'\n');
console.log('Built local macOS battle backend: '+bin);
