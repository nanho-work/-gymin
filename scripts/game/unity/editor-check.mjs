import {spawn} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import {readFile,rm} from 'node:fs/promises';
import {toolSettings} from './environment.mjs';
const {project,editor}=toolSettings();
const log=path.join(os.tmpdir(),'sanha-unity-editor-check.log');
await rm(log,{force:true});
const child=spawn(editor,['-batchmode','-nographics','-projectPath',project,'-executeMethod','Sanha.Editor.ProjectSetup.PrepareAndValidate','-quit','-logFile',log],{stdio:'inherit'});
child.on('error',e=>{console.error(e.message);process.exitCode=1;});
child.on('close',async code=>{
 const text=await readFile(log,'utf8').catch(()=>'');
 if(code!==0||!text.includes('SANHA_CAMPAIGN_VALIDATED:')){console.error('Unity validation did not finish. Check prerequisites and log: '+log);process.exitCode=1;}
 else console.log('Unity validation completed: '+log);
});
