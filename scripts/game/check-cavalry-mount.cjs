const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=process.cwd(),ts=require(root+'/web/node_modules/typescript');
const dir=root+'/web/src/features/game-world/model';
const cache={};function load(name){if(cache[name])return cache[name];const f=dir+'/'+name+'.ts',m=new Module(f,module);m.require=n=>n.startsWith('./')?load(n.slice(2)):require(n);m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);return cache[name]=m.exports;}
const rig=load('hongRig'),mount=load('cavalryMount');let count=0;
const assert=(x,m)=>{if(!x)throw Error(m)};
for(const rank of rig.hongRanks)for(const id of mount.cavalryMountIds)for(const d of ['se','sw','nw','ne']){
 let prior;const images=new Set();
 for(let f=0;f<4;f++){
  const p=rig.composeHongRig({weapon:3,armor:38,accessory:id},d,1,f,'mounted',rank.id);
  const horse=p.find(x=>x.id==='mount'),body=p.find(x=>x.id==='armor');
  assert(fs.existsSync(root+'/web/public'+horse.src),'missing '+horse.src);images.add(fs.readFileSync(root+'/web/public'+horse.src).toString('base64'));
  const registration=body.y-horse.y;
  if(prior!==undefined)assert(Math.abs(registration-prior)<1e-6,'saddle drift');prior=registration;
  assert(horse.flipX===(d==='sw'||d==='ne'),'mirror');
  const hand=p.find(x=>x.id==='arm-right').grip,weapon=p.find(x=>x.id==='weapon').grip;
  assert(hand.x===weapon.x&&hand.y===weapon.y,'weapon detached');count++;
 }
 assert(images.size===4,'walk frames must differ');
 const a=mount.cavalryMountPose(id,d,true,0),b=mount.cavalryMountPose(id,d,true,4);assert(JSON.stringify(a)===JSON.stringify(b),'loop mismatch');
 const foot=rig.composeHongRig({weapon:3,armor:38,accessory:id},d,1,1,'dismounted',rank.id);assert(!foot.some(x=>x.id==='mount'),'horse appears dismounted');
}
assert(mount.cavalryMountId(55)===-1,'non-mount accessory fallback');
console.log(count+' mounted states passed: distinct frames, saddle registration, mirror, grip, loop, dismount');
