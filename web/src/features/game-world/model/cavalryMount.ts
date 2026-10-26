/** Shared mount playback: equipment selects art, never the gait phase. */
export type CavalryDirection='nw'|'ne'|'se'|'sw';
export const cavalryMountIds=[-1,57,58,60,61,62,63] as const;
export const cavalryWalkFrameCount=4;
export const cavalryWalkFrameMs=190;
export function cavalryMountId(accessory:number){return cavalryMountIds.includes(accessory as typeof cavalryMountIds[number])?accessory:-1;}
export function cavalryMountPose(accessory:number,direction:CavalryDirection,walking:boolean,frame:number){
 const id=cavalryMountId(accessory),sourceDirection=direction==='nw'||direction==='ne'?'nw':'se';
 const phase=((frame%cavalryWalkFrameCount)+cavalryWalkFrameCount)%cavalryWalkFrameCount;
 // One saddle registration and one vertical motion are shared by mount and rider.
 const saddleBob=walking?[0,-1,0,-1][phase]:0;
 return {
  id,phase,sourceDirection,flipX:direction==='sw'||direction==='ne',
  src:walking?`/images/mounts/walk-v1/${id}/${sourceDirection}-${phase}.webp`:`/images/playable/hong-yu/layers-v1/mount-${id}-${sourceDirection}.webp`,
  x:104,y:166+saddleBob,width:112,height:92,riderOffsetY:saddleBob,
 };
}
