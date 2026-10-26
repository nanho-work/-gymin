"use client";
import {useId} from 'react';
import {composeHongRig,hongPartTransform,type Direction,type HongStance,type HongRank,type HongStyle} from '../model/hongRig';
import type {Loadout} from '../model/hongEquipment';
export function HongLayerRig({loadout,dir,action,frame,stance='mounted',rank='light',debug=false,compact=false,style='mobile'}:{loadout:Loadout;dir:Direction;action:number;frame:number;stance?:HongStance;rank?:HongRank;debug?:boolean;compact?:boolean;style?:HongStyle}){
 const clipId=useId().replace(/:/g,'');
 const parts=composeHongRig(loadout,dir,action,frame,stance,rank,style);
 const body=parts.find(p=>p.id==='armor')!;
 return <svg viewBox={compact?"55 80 210 190":"0 0 320 320"} width="256" height="256" role="img" aria-label={`홍유 ${stance==='mounted'?'탑승':'하마'} · ${dir} · ${['대기','이동','공격','스킬'][action]} ${frame+1}단계`} style={{maxWidth:'100%',overflow:'visible'}}>
  <defs>{parts.filter(p=>p.clipHalf).map(p=><clipPath id={`${clipId}-${p.id}`} key={p.id}><rect x={p.x+(p.clipHalf==='right'?p.width/2:0)} y={p.y} width={p.width/2} height={p.height}/></clipPath>)}</defs>
  {parts.map(p=><g key={p.id} data-layer={p.id} transform={hongPartTransform(p)}><g clipPath={p.clipHalf?`url(#${clipId}-${p.id})`:undefined}>{p.cropFraction?<svg x={p.x} y={p.y} width={p.width} height={p.height} viewBox={`0 0 ${p.width} ${p.height}`} overflow="hidden"><image href={p.src} width={p.width} height={p.height/p.cropFraction} preserveAspectRatio="none"/></svg>:<image href={p.src} x={p.x} y={p.y} width={p.width} height={p.height} preserveAspectRatio="none"/>}</g></g>)}
  {debug&&<g transform={`rotate(${body.angle||0} ${body.px} ${body.py})`}><line x1={body.x+body.width/2} y1={body.y-28} x2={body.x+body.width/2} y2={body.y+65} stroke="#ffffff" strokeWidth=".7" strokeDasharray="3 3"/><circle cx={body.px} cy={body.py} r="3" fill="none" stroke="#fff"/></g>}
  {debug&&parts.filter(p=>p.id==='arm-right'||p.id==='arm-left').map(p=><g key={`anchor-${p.id}`} fill={p.id==='arm-right'?'#ffbb42':'#49dbff'} stroke="#101c15" strokeWidth=".6"><line x1={p.shoulder!.x} y1={p.shoulder!.y} x2={p.grip!.x} y2={p.grip!.y} stroke={p.id==='arm-right'?'#ffbb42':'#49dbff'} strokeWidth="1"/><circle cx={p.shoulder!.x} cy={p.shoulder!.y} r="2.5"/><circle cx={p.grip!.x} cy={p.grip!.y} r="2.5"/><text x={p.shoulder!.x+(p.shoulder!.x<160?-18:6)} y={p.shoulder!.y-5} fontSize="11" fontWeight="bold">{p.id==='arm-right'?'R':'L'}</text></g>)}
  {action===3&&frame===2&&<ellipse cx="160" cy="255" rx="48" ry="10" fill="none" stroke="#efce77" strokeWidth="2" opacity=".8"/>}
 </svg>;
}
