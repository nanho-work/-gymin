import {spawnSync} from 'node:child_process';
import {readdir,readFile,mkdir} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {repo,toolSettings} from './environment.mjs';
const {project,editor}=toolSettings();
const contents=path.resolve(path.dirname(editor),'..');
const mono=path.join(contents,'MonoBleedingEdge/bin/mono');
const compiler=path.join(contents,'MonoBleedingEdge/lib/mono/4.5/csc.exe');
const output=path.join(os.tmpdir(),'sanha-unity-check'); await mkdir(output,{recursive:true});
async function files(root){const result=[];for(const e of await readdir(root,{withFileTypes:true})){const f=path.join(root,e.name);if(e.isDirectory())result.push(...await files(f));else if(f.endsWith('.cs'))result.push(f);}return result;}
function run(command,args){const p=spawnSync(command,args,{stdio:'inherit'});if(p.error)throw p.error;if(p.status!==0)throw Error('Check failed: '+command+' ('+p.status+')');}
const core=(await files(path.join(project,'Assets/Game/Features'))).filter(f=>f.includes('/Core/'));
for(const file of core) if(/UnityEngine|UnityEditor|Resources\.Load|Environment\.GetEnvironmentVariable/.test(await readFile(file,'utf8')))throw Error('Core dependency violation: '+file);
run(process.execPath,['--test',path.join(repo,'scripts/game/unity/tests/campaign.test.mjs'),path.join(repo,'scripts/game/unity/tests/deployment.test.mjs')]);
const exe=path.join(output,'ScenarioCoreTests.exe');
run(mono,[compiler,'/nologo','/out:'+exe,...core,...await files(path.join(project,'Tests'))]);
run(mono,[exe]);
console.log('Pure C# engine and exporter tests passed. This is NOT Unity Play/build verification.');

if(process.argv.includes('--compile-unity')){
 const managed=path.join(contents,'Managed/UnityEngine');
 const references=(await readdir(managed)).filter(x=>x.endsWith('.dll')).map(x=>'/r:'+path.join(managed,x));
 references.push('/r:'+path.join(contents,'UnityReferenceAssemblies/unity-4.8-api/Facades/netstandard.dll'));
 const coreDll=path.join(output,'Sanha.Scenario.Core.dll');
 const runtimeDll=path.join(output,'Sanha.Runtime.dll');
 const all=await files(path.join(project,'Assets/Game'));
 const runtime=all.filter(f=>!f.includes('/Editor/')&&!f.includes('/Core/'));
 const editorFiles=all.filter(f=>f.includes('/Editor/'));
 run(mono,[compiler,'/nologo','/target:library','/out:'+coreDll,...core]);
 run(mono,[compiler,'/nologo','/target:library','/out:'+runtimeDll,'/r:'+coreDll,...references.filter(x=>!path.basename(x.slice(3)).startsWith('UnityEditor')),...runtime]);
 run(mono,[compiler,'/nologo','/target:library','/out:'+path.join(output,'Sanha.Editor.dll'),'/r:'+coreDll,'/r:'+runtimeDll,...references,...editorFiles]);
 console.log('Runtime and editor sources compiled against installed Unity assemblies. Import/Play still unverified.');
}
