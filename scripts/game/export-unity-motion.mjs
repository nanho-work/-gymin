
import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
import {repo,toolSettings} from './unity/environment.mjs';
const {project}=toolSettings();const {default:sharp}=await import(pathToFileURL(path.join(repo,'web/node_modules/sharp/lib/index.js')));
const file=path.join(project,'Assets/Resources/Battle/first-units.json'),data=JSON.parse(await readFile(file));const roots=new Map();
for(const u of data.units)roots.set(path.posix.dirname(u.image),null);
let total=0;
for(const root of roots.keys()){
 const frames=[];let left=9999,top=9999,right=0,bottom=0,foot=0,refHeight=0,refWidth=0;
 for(const d of ['nw','ne','se','sw'])for(let a=0;a<4;a++)for(let f=0;f<4;f++){
  const input=await readFile(path.join(repo,'web/public',root,`${d}-${a}-${f}.webp`));const {data:rgba,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});let l=info.width,t=info.height,r=0,b=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(rgba[(y*info.width+x)*4+3]>8){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x+1);b=Math.max(b,y+1)}
  left=Math.min(left,l);top=Math.min(top,t);right=Math.max(right,r);bottom=Math.max(bottom,b);
  if(a===0&&f===0){foot=Math.max(foot,b);refHeight=Math.max(refHeight,b-t);refWidth=Math.max(refWidth,r-l);}
  frames.push(input);
 }
 const w=right-left,h=bottom-top,scale=Math.min(64/w,64/h),rw=Math.max(1,Math.round(w*scale)),rh=Math.max(1,Math.round(h*scale));
 const composites=[];
 for(let i=0;i<frames.length;i++)composites.push({input:await sharp(frames[i]).extract({left,top,width:w,height:h}).resize(rw,rh).png().toBuffer(),left:(i%8)*64,top:Math.floor(i/8)*64});
 const key='Battle/motion-'+createHash('sha256').update(root).digest('hex').slice(0,12);const output=await sharp({create:{width:512,height:512,channels:4,background:'#00000000'}}).composite(composites).png({palette:true,quality:90,effort:8}).toBuffer();
 await writeFile(path.join(project,'Assets/Resources',key+'.png'),output);total+=output.length;
 roots.set(root,{atlas:key,cellWidth:64,frameWidth:rw,frameHeight:rh,pivotX:((left+right)/2-left)*scale/rw,pivotY:(bottom-foot)*scale/rh,ppu:Math.max(refHeight*scale/1.35,refWidth*scale/1.05),source:root});
}
await writeFile(path.join(project,'Assets/Resources/Battle/motions.json'),JSON.stringify({records:data.units.map(u=>({id:u.id,...roots.get(path.posix.dirname(u.image))}))}));
console.log(`${roots.size} shared motion atlases, ${total} bytes; fixed crop and feet anchor across 64 frames each.`);
