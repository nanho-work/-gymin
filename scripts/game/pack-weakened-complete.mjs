import sharp from '../../web/node_modules/sharp/lib/index.js';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
const repo=fileURLToPath(new URL('../../',import.meta.url)).replace(/\/$/,'');
const manifest=JSON.parse(await fs.readFile(new URL('./weakened-complete-v1-manifest.json',import.meta.url),'utf8'));
const sourceDir=process.env.WEAKENED_SOURCE_DIR;
const reviewDir=process.env.WEAKENED_REVIEW_DIR??'/tmp';
const jobs=manifest.entries;
const dirs=['nw','ne','se','sw'];
async function pixels(file){return sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true})}
function bounds(data,w,h){let x0=w,y0=h,x1=-1,y1=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>=40){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}if(x1<0)throw Error('empty');let lo=w,hi=-1;for(let y=Math.max(y0,y1-5);y<=y1;y++)for(let x=x0;x<=x1;x++)if(data[(y*w+x)*4+3]>=40){lo=Math.min(lo,x);hi=Math.max(hi,x)}return{x0,y0,x1,y1,w:x1-x0+1,h:y1-y0+1,foot:(lo+hi)/2}}
for(const id of process.argv.slice(2)){
 const job=jobs.find(x=>x.id===id);if(!job)throw Error('unknown id '+id);const entry={...job};if(sourceDir)entry.source=path.join(sourceDir,path.basename(entry.source));
 const meta=await sharp(entry.source).metadata();if(!meta.hasAlpha)throw Error('missing transparency '+id);
 const frames=[],refs=[];
 const full=await pixels(entry.source);
 function splits(axis,start,end){const length=axis==='y'?meta.height:meta.width;const result=[0];for(let i=1;i<4;i++){let best=-1,dist=Infinity;for(let v=Math.round(length*(i/4-.09));v<length*(i/4+.09);v++){let ink=0;for(let t=start;t<end;t++){const x=axis==='y'?t:v,y=axis==='y'?v:t;if(full.data[(y*meta.width+x)*4+3]>=40){ink++;break}}if(!ink&&Math.abs(v-length*i/4)<dist){best=v;dist=Math.abs(v-length*i/4)}}if(best<0)throw Error('no safe separator '+id+' '+axis+' '+i);result.push(best)}result.push(length);return result}
 const ys=splits('y',0,meta.width);
 for(let row=0;row<4;row++){
  const ref=await pixels(repo+'/web/public'+job.combat+'/'+dirs[row]+'-0-0.webp');refs.push({...bounds(ref.data,ref.info.width,ref.info.height),width:ref.info.width,height:ref.info.height});
  for(let col=0;col<4;col++){
   const sourceRow=(entry.rowOrder??[0,1,2,3])[row],top=ys[sourceRow],height=ys[sourceRow+1]-top,xs=splits('x',top,top+height),left=xs[col],width=xs[col+1]-left;
   const {data,info}=await sharp(entry.source).extract({left,top,width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   const b=bounds(data,width,height);if((left===0&&b.x0===0)||(top===0&&b.y0===0)||(left+width===meta.width&&b.x1===width-1)||(top+height===meta.height&&b.y1===height-1))throw Error('cell border contact '+id+' '+row+' '+col);
   frames.push({data,info,b,row,col});
  }
 }
 const size=refs[0].width;const scale=Math.min(Math.max(...refs.map(x=>x.h))*.97/Math.max(...frames.map(x=>x.b.h)),(size-16)/Math.max(...frames.map(x=>x.b.w)));
 const root='/images/weakened-complete-v1/unit-'+id;const dest=repo+'/web/public'+root;await fs.mkdir(dest,{recursive:true});let bytes=0;const contact=[];
 for(const f of frames){const ref=refs[f.row],w=Math.max(1,Math.round(f.b.w*scale)),h=Math.max(1,Math.round(f.b.h*scale));
  let left=Math.round(ref.foot-(f.b.foot-f.b.x0)*scale),top=ref.y1+1-h;
  left=Math.max(4,Math.min(size-4-w,left));if(top<4)throw Error('frame too tall '+id);
  const tile=await sharp(f.data,{raw:f.info}).extract({left:f.b.x0,top:f.b.y0,width:f.b.w,height:f.b.h}).resize(w,h).png().toBuffer();
  const file=`${dirs[f.row]}-0-${f.col}.webp`;await sharp({create:{width:size,height:refs[0].height,channels:4,background:'#00000000'}}).composite([{input:tile,left,top}]).webp({quality:76,alphaQuality:95}).toFile(dest+'/'+file);bytes+=(await fs.stat(dest+'/'+file)).size;contact.push({input:dest+'/'+file,left:f.col*size,top:f.row*size});
 }
 await sharp({create:{width:size*4,height:size*4,channels:4,background:'#203932'}}).composite(contact).webp({quality:82}).toFile(reviewDir+'/weak-contact-'+id+'.webp');
 await fs.writeFile(reviewDir+'/weak-packed-'+id+'.json',JSON.stringify({...entry,name:job.name,combat:job.combat,root,frames:16,size,bytes,scale},null,2));console.log(JSON.stringify({id,name:job.name,bytes}));
}
