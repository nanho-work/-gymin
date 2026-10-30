import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {buildInitialDeployment} from '../deployment.mjs';
import {repo,toolSettings} from '../environment.mjs';
const read=async p=>JSON.parse(await readFile(p));
const {originalAssets}=toolSettings();
const first=await read(path.join(originalAssets,'first-battle.json'));
const chapter=await read(path.join(originalAssets,'campaign/battle-00.json'));
const root=path.join(repo,'web/src/features/game-world/data');
const [chars,pilots,monarchs,specials]=await Promise.all(['characters.json','motion-pilots.json','monarch-motions.json','special-motions.json'].map(n=>read(path.join(root,n))));
const build=(f=first,c=chapter,p=pilots)=>buildInitialDeployment(f,c,chars.records,p,monarchs,specials);
test('original B00 opening placements preserve coordinates and reserve/death states',()=>{
 const before=JSON.stringify(first),result=build();
 assert.equal(result.length,26);assert.equal(result.filter(u=>u.state==='deployed').length,17);
 assert.deepEqual(result.filter(u=>u.state==='retired').map(u=>u.id).sort((a,b)=>a-b),[235,334]);
 assert.equal(result.filter(u=>u.state==='reserve').length,7);
 assert.equal(result.filter(u=>u.side===1&&u.state==='deployed').length,14);
 assert.equal(result.filter(u=>u.side===2&&u.state==='deployed').length,3);
 for(const u of result){const source=first.units.find(s=>s.id===u.id);assert.equal(u.x,source.x);assert.equal(u.y,source.y);assert.equal(u.side,source.side);assert.equal(u.level,source.level);assert.ok(u.image.endsWith('-0-0.webp'));}
 const king=result.find(u=>u.id===0);assert.equal(king.name,'왕건');assert.equal(king.state,'reserve');assert.equal(king.modelKind,'named');
 assert.equal(result.find(u=>u.id===32).name,'견훤');assert.equal(result.find(u=>u.id===146).name,'도무겸');
 assert.equal(JSON.stringify(first),before);
});
test('disagreement with original deployment and missing art fail explicitly',()=>{
 const f=structuredClone(first);f.units.find(u=>u.id===146).x++;assert.throws(()=>build(f),/disagrees/);
 assert.throws(()=>build(first,chapter,pilots.filter(p=>p.id!==3)),/Missing created character/);
 const c=structuredClone(chapter);c.setup[0].body.find(n=>n.op===1).condition.op=63;assert.throws(()=>build(first,c),/requires event engine/);
});
