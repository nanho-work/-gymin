import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildCampaign,validateCampaign} from '../campaign.mjs';
const data=JSON.parse(await readFile(new URL('../../../../web/src/features/game-world/data/story-site.json',import.meta.url),'utf8'));
const config=JSON.parse(await readFile(new URL('../../../../config/unity/export.json',import.meta.url),'utf8'));
const actors=Object.fromEntries(config.actors.map(x=>[x.name,{scenario:x.assetName+'/scenario',combat:x.assetName+'/combat'}]));
const assets={background:'courtyard',map:'battlefield',actors};
test('all packages and first visual episode preserved without mutating authoring data',()=>{
 const before=JSON.stringify(data); const result=buildCampaign(data,config,assets);
 assert.equal(result.stages.length,58); assert.equal(result.stages[0].scenes.length,9);
 assert.equal(result.stages[0].scenes.reduce((n,s)=>n+s.lines.length,0),17);
 assert.equal(result.stages[0].scenes.find(x=>x.id==='B00-P03').actors[0].texture,'actor-1/combat');
 assert.equal(result.stages[0].scenes[0].actors[0].texture,'actor-1/scenario');
 assert.ok(result.stages.slice(1).every(s=>s.scenes.every(x=>!x.background&&x.actors.length===0)));
 assert.equal(JSON.stringify(data),before);
});
test('unknown bindings, missing cast, missing source and malformed dialogue fail',()=>{
 assert.throws(()=>buildCampaign(data,{...config,visualStageId:'NO'},assets));
 assert.throws(()=>buildCampaign(data,{...config,casts:{INVALID:['왕건']}},assets));
 assert.throws(()=>buildCampaign(data,config,{...assets,actors:{}}));
 assert.throws(()=>buildCampaign(data,{...config,introExpectedLines:99},assets));
 const result=buildCampaign(data,config,assets); result.stages.push(result.stages[0]); assert.throws(()=>validateCampaign(result));
});

test('tool environment overrides are resolved without leaking into campaign data',async()=>{
 const {toolSettings,repo}=await import('../environment.mjs');
 const defaults=toolSettings({}); assert.equal(defaults.project,repo+'/unity');
 const configured=toolSettings({SANHA_ORIGINAL_ASSETS:'/tmp/original-assets',SANHA_UNITY_PROJECT:'/tmp/sanha-test',SANHA_EXPORT_CONFIG:'/tmp/bindings.json',SANHA_UNITY_EDITOR:'/tmp/Unity'});
 assert.deepEqual(configured,{originalAssets:'/tmp/original-assets',project:'/tmp/sanha-test',exportConfig:'/tmp/bindings.json',editor:'/tmp/Unity'});
 const result=buildCampaign(data,config,assets);
 assert.ok(!JSON.stringify(result).includes('SANHA_'));
});
