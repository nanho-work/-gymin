import type {Loadout} from './hongEquipment';
export type HongStance='mounted'|'dismounted';
export type Direction='se'|'sw'|'nw'|'ne';
type Point={x:number;y:number};
export type RigPart={id:string;src:string;x:number;y:number;width:number;height:number;angle?:number;px?:number;py?:number;flipX?:boolean;matrix?:number[];cropFraction?:number;clipHalf?:'left'|'right';shoulder?:Point;grip?:Point};
export const rigWeapons=[3,4,5,25,26,27];
export const rigArmor=[38,39,40,44,45,46,47,48];
export const rigMounts=[-1,57,58,60,61,62,63];
export function hongMountId(accessory:number){return rigMounts.includes(accessory)?accessory:-1;}
export const hongDirections=[{dir:'nw',label:'① 11시 ↖',rightNear:true},{dir:'ne',label:'② 2시 ↗',rightNear:false},{dir:'se',label:'③ 5시 ↘',rightNear:true},{dir:'sw',label:'④ 7시 ↙',rightNear:false}] as const;
const root='/images/playable/hong-yu/layers-v1';
function rotate(p:Point,pivot:Point,degrees:number):Point{const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return{x:pivot.x+(p.x-pivot.x)*c-(p.y-pivot.y)*s,y:pivot.y+(p.x-pivot.x)*s+(p.y-pivot.y)*c};}
// Map the sleeve's shoulder and palm to two world-space anchors with a similarity transform.
export function fitHongArm(id:string,src:string,shoulder:Point,grip:Point,back:boolean,mirror:boolean,bend=1):RigPart{
 const sourceShoulder=back?{x:18,y:5}:{x:16,y:4};
 const sourceGrip=back?{x:5,y:26}:{x:26,y:26};
 const reflect=(p:Point)=>({x:mirror?32-p.x:p.x,y:p.y});
 const p=reflect(sourceShoulder),q=reflect(sourceGrip),u={x:q.x-p.x,y:q.y-p.y},v={x:grip.x-shoulder.x,y:grip.y-shoulder.y};
 const den=u.x*u.x+u.y*u.y,a=(v.x*u.x+v.y*u.y)/den,b=(v.y*u.x-v.x*u.y)/den;
 const tx=shoulder.x-a*p.x+b*p.y,ty=shoulder.y-b*p.x-a*p.y;
 const matrix=mirror?[-a,-b,-b,a,tx+32*a,ty+32*b]:[a,b,-b,a,tx,ty];
 // Compress only the bend perpendicular to the shoulder–hand axis for a resting arm.
 const length=Math.hypot(v.x,v.y),nx=v.x/length,ny=v.y/length;
 const xx=nx*nx+bend*ny*ny,xy=(1-bend)*nx*ny,yy=ny*ny+bend*nx*nx;
 const [ma,mb,mc,md,me,mf]=matrix;
 const fitted=[xx*ma+xy*mb,xy*ma+yy*mb,xx*mc+xy*md,xy*mc+yy*md,
 shoulder.x+xx*(me-shoulder.x)+xy*(mf-shoulder.y),shoulder.y+xy*(me-shoulder.x)+yy*(mf-shoulder.y)];
 return{id,src,x:0,y:0,width:32,height:32,matrix:fitted,shoulder,grip};
}
/** Appearance rig draft, not hand-painted gameplay animation. */
export function composeHongRig(loadout:Loadout,dir:Direction,action:number,frame:number,stance:HongStance='mounted'):RigPart[]{
 const onFoot=stance==='dismounted',back=dir==='nw'||dir==='ne';
 const mirror=dir==='sw'||dir==='ne',side=dir==='se'||dir==='ne'?1:-1;
 const sourceDir=back?'nw':'se';
 if(onFoot)action=0;
 const t=frame%4,wave=[0,1,0,-1][t],bob=onFoot?0:action===1?-Math.abs(wave)*2:action===0?wave*.5:0;
 const cx=160-side*7,top=(onFoot?175:145)+bob;
 const lean=action===2?[0,-4,6,2][t]*side:action===3?[0,-2,-4,0][t]*side:0;
 const pivot={x:cx,y:top+48};
 const part=(id:string,file:string,x:number,y:number,width:number,height:number,angle=0):RigPart=>({id,src:`${root}/${file}-${sourceDir}.webp`,x,y,width,height,angle,px:pivot.x,py:pivot.y,flipX:mirror});
 const mount=part('mount',`mount-${hongMountId(loadout.accessory)}`,104,166,112,92);
 const nearLeg=part('leg-near','core-legs',cx-25,185+bob,50,40,lean*.15);
 const farLeg={...nearLeg,id:'leg-far'};
 // Clip in source space, before reflection: the near leg is left in SE, right in NW.
 nearLeg.clipHalf=back?'right':'left';farLeg.clipHalf=back?'left':'right';
 const torso=part('armor',`${back?'standing-rear-v2':'standing-suit'}-${loadout.armor}`,cx-27,top,54,onFoot?83:54,lean);
 if(!onFoot)torso.cropFraction=.65;
 const head=part('head','core-head',cx-27,top-36,54,46,lean);
 // The file named NW actually faces NE. Body and head need separate art orientation.
 head.flipX=back?!mirror:mirror;
 // Anatomical handedness does not change when the view is reflected.
 const rightNear=hongDirections.find(d=>d.dir===dir)!.rightNear;
 // Explicit anatomical anchors around one torso center; neither hand crosses its midline.
 const pose={
  se:{r:[-14,13,-8,35],l:[17,13,20,35]},
  sw:{r:[-17,13,-22,33],l:[14,13,12,39]},
  nw:{r:[14,13,8,35],l:[-17,13,-20,35]},
  ne:{r:[17,13,22,33],l:[-14,13,-12,39]},
 }[dir];
 const point=(x:number,y:number)=>rotate({x:cx+x,y:top+y},pivot,lean);
 const shoulder=point(pose.r[0],pose.r[1]);
 const hand=point(pose.r[2]+(action===2?[0,0,3,1][t]*side:0),pose.r[3]+(action===3?[0,-3,-6,0][t]:0));
 const sleeveSrc=`${root}/standing-sleeve-${sourceDir}.webp`;
 // Sleeve chirality is explicit per view; front/back art cannot share one mirror rule.
 const rightArm=fitHongArm('arm-right',sleeveSrc,shoulder,hand,back,dir==='nw'?true:mirror);
 const leftShoulder=point(pose.l[0],pose.l[1]);
 const leftHand=point(pose.l[2],onFoot?pose.l[3]+3:pose.l[3]);
 const leftArm=fitHongArm('arm-left',sleeveSrc,leftShoulder,leftHand,back,dir!=='se',.55);
 const nearArm=rightNear?rightArm:leftArm,farArm=rightNear?leftArm:rightArm;
 const w=loadout.weapon===3?87:loadout.weapon===4?112:124;
 const weapon=part('weapon',`weapon-${loadout.weapon}`,hand.x-w*(side===1?.32:.68),hand.y-w*.68,w,w);
 // Weapon art has its own front orientation: mirror from SE for both left-facing views.
 weapon.src=`${root}/weapon-${loadout.weapon}-se.webp`;weapon.flipX=side===-1;
 weapon.angle=(action===2?[0,-12,30,8][t]:action===3?[0,-15,-30,0][t]:0)*side+lean;weapon.px=hand.x;weapon.py=hand.y;weapon.grip=hand;
 // The far leg is occluded by the horse. Arms stay on their own side of the torso.
 const body=back?[weapon,farArm,nearArm,torso,head]:rightNear?[farArm,torso,head,weapon,nearArm]:[weapon,farArm,torso,head,nearArm];
 return onFoot?body:[farLeg,mount,nearLeg,...body];
}
export function hongPartTransform(p:RigPart){
 if(p.matrix)return `matrix(${p.matrix.join(' ')})`;
 const rotation=`rotate(${p.angle||0} ${p.px} ${p.py})`;
 return p.flipX?`${rotation} translate(${2*p.x+p.width} 0) scale(-1 1)`:rotation;
}
