import sharp from '../../web/node_modules/sharp/lib/index.js';
const id=process.argv[2],ims=[];
for(let d=0;d<4;d++)for(let a=0;a<4;a++)for(let f=0;f<4;f++)ims.push({input:`web/public/images/folklore/${id}-motion-v2/${['nw','ne','se','sw'][d]}-${a}-${f}.webp`,left:(d*4+f)*160,top:a*160});
await sharp({create:{width:2560,height:640,channels:4,background:'#20382f'}}).composite(ims).png().toFile(`/tmp/${id}-motion-check.png`);
