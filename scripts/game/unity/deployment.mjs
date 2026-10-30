// Existing decoded data only. This is a bounded B00 opening snapshot, not an EEX interpreter.
export function buildInitialDeployment(first,chapter,characters,pilots,monarchs,specials){
 if(first.battleID!==0||chapter.id!==0)throw Error('Only B00 opening snapshot is implemented');
 const units=structuredClone(first.units),byId=new Map(units.map(u=>[u.id,u]));
 if(byId.size!==units.length)throw Error('Duplicate person ID');
 const direction=new Map(),evidence=new Map();
 for(const n of chapter.deploymentCommands){
  if(n.op===70||n.op===71){const stride=n.op===70?11:12,allied=n.op===70;
   for(let i=0;i+stride<=n.args.length;i+=stride){const a=n.args.slice(i,i+stride);if(a[0]===65535)continue;
    const u=byId.get(a[0]);if(!u||u.x!==a[allied?2:3]||u.y!==a[allied?3:4]||u.side!==(allied?2:1)||u.hidden!==![0,65535].includes(a[allied?1:2]))throw Error('Deployment fixture disagrees with original row: '+a[0]);
    direction.set(u.id,a[allied?4:5]);evidence.set(u.id,n.offset);
   }
  }
 }
 function walk(nodes){for(const n of nodes){
  if(n.op===1){if(n.condition?.op!==2)throw Error('Conditional opening block requires event engine');walk(n.body||[]);}
  if(n.op===75 && n.args[0]===0){const u=byId.get(0),a=n.args;if(u.x!==a[1]||u.y!==a[2]||u.hidden!==(a[4]!==0))throw Error('Player deployment mismatch');direction.set(0,a[3]);evidence.set(0,n.offset);}
  if(n.op===83){if(n.args[0]!==0||!byId.has(n.args[1]))throw Error('Unsupported opening retirement');const u=byId.get(n.args[1]);u.openingRetired=true;u.retirementOffset=n.offset;}
  if(n.op===79){const a=n.args,u=byId.get(a[0]);if(!u||u.hidden||u.openingRetired)continue;
   if(a[1]===65535)direction.set(u.id,a[2]);else {const v=byId.get(a[1]);if(!v||v.hidden||v.openingRetired)continue;const dx=v.x-u.x,dy=v.y-u.y;if(dx||dy){let d=Math.abs(dx)>=Math.abs(dy)?(dx<0?3:1):(dy<0?0:2);if(a[3]===1)d=(d+2)%4;direction.set(u.id,d);}}
  }
 }}
 if(chapter.setup.length!==1||chapter.setup[0].conditions.some(n=>![0,2].includes(n.op)))throw Error('Opening setup conditions require engine');
 walk(chapter.setup[0].body);
 return units.map(u=>{
  const person=first.people.find(p=>p.id===u.id),record=characters.find(c=>c.id===u.id);
  if(!person||!evidence.has(u.id))throw Error('Missing deployment/person evidence: '+u.id);
  if(u.x<0||u.x>=first.width||u.y<0||u.y>=first.height)throw Error('Unit outside board');
  const monarch=monarchs.find(m=>m.originalIds.includes(u.id));
  const job=pilots.find(p=>p.id===person.job)||specials.find(p=>p.id===person.job);
  const model=monarch?.stages[0]||job?.stages?.find(s=>s.id===person.job)||job;
  if(!model?.combat)throw Error('Missing created character model for job '+person.job);
  const facing=direction.get(u.id)??2,assetDirection=['nw','ne','se','sw'][facing];
  if(!assetDirection)throw Error('Invalid facing');
  return {id:u.id,originalName:person.name,name:record?.replacement||person.name,jobId:person.job,jobName:record?.job||job?.name||'군웅',side:u.side,x:u.x,y:u.y,level:u.level,movement:first.jobs[person.job].movement,
   state:u.openingRetired?'retired':u.hidden?'reserve':'deployed',originalFacing:facing,direction:assetDirection,
   sourceOffset:evidence.get(u.id),retirementOffset:u.retirementOffset??-1,
   image:`${model.combat}/${assetDirection}-0-0.webp`,modelKind:monarch?'named':'class',
   note:u.openingRetired?'도입 연출 중 퇴장':u.hidden?'원본 등장 이벤트 대기':u.id===234?'도입 연출에서 피해를 받은 동맹':'초기 배치'};
 });
}
