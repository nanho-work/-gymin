import sharp from '../../web/node_modules/sharp/lib/index.js';
import fs from 'node:fs/promises';
const config=JSON.parse(await fs.readFile(new URL('./mongdang-motion-v2-prompts.json',import.meta.url),'utf8'));
const out=new URL('../../web/public/images/folklore/mongdang-motion-v2/',import.meta.url);await fs.mkdir(out,{recursive:true});
const report=[];
for(const entry of config.entries){
 const {width,height}=await sharp(entry.source).metadata();
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const left=0,top=Math.round(row*height/4),w=width,h=Math.round((row+1)*height/4)-top;
  const {data}=await sharp(entry.source).extract({left,top,width:w,height:h}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // Keep the largest connected silhouette, discarding isolated pixels from neighboring cells.
  const seen=new Uint8Array(w*h);let largest=[];const components=[];
  for(let i=0;i<w*h;i++){if(seen[i]||data[i*4+3]<32)continue;const queue=[i];seen[i]=1;for(let n=0;n<queue.length;n++){const j=queue[n],x=j%w,y=Math.floor(j/w);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,k=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!seen[k]&&data[k*4+3]>=32){seen[k]=1;queue.push(k)}}}components.push(queue);}
  const figures=components.sort((a,b)=>b.length-a.length).slice(0,4).sort((a,b)=>a.reduce((s,i)=>s+i%w,0)/a.length-b.reduce((s,i)=>s+i%w,0)/b.length); largest=figures[col];
  const keep=new Set(largest);for(let i=0;i<w*h;i++)if(!keep.has(i))data[i*4+3]=0;
  let minX=w,maxX=0,minY=h,maxY=0;for(const i of largest){minX=Math.min(minX,i%w);maxX=Math.max(maxX,i%w);minY=Math.min(minY,Math.floor(i/w));maxY=Math.max(maxY,Math.floor(i/w));}
  const bw=maxX-minX+1,bh=maxY-minY+1;
  // Common scale per sheet; align visible contact pixels to exactly y=147.
  const scale=0.39;const rw=Math.max(1,Math.round(bw*scale)),rh=Math.max(1,Math.round(bh*scale));
  const footXs=largest.filter(i=>Math.floor(i/w)>=maxY-8).map(i=>i%w).sort((a,b)=>a-b);const anchor=(footXs[0]+footXs.at(-1))/2;
  const x=Math.max(4,Math.min(156-rw,Math.round(80-(anchor-minX)*scale))),y=148-rh;
  const buf=await sharp(data,{raw:{width:w,height:h,channels:4}}).extract({left:minX,top:minY,width:bw,height:bh}).resize(rw,rh).png().toBuffer();
  const file=`${entry.id}-${row}-${col}.webp`;
  await sharp({create:{width:160,height:160,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:buf,left:x,top:y}]).webp({quality:72,alphaQuality:85}).toFile(new URL(file,out).pathname);
  report.push({file,baseline:148,bytes:(await fs.stat(new URL(file,out))).size});
 }
}
await fs.writeFile(new URL('./mongdang-motion-v2-manifest.json',import.meta.url),JSON.stringify({frameSize:160,baseline:148,frames:report},null,2)+'\n');console.log({frames:report.length,bytes:report.reduce((s,f)=>s+f.bytes,0)});
