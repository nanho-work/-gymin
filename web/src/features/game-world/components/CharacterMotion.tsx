"use client";
import { useEffect, useState, useRef } from "react";
import s from "./characters.module.css";
const actions=[{name:"대기",ms:320},{name:"이동",ms:170},{name:"공격",ms:190},{name:"스킬",ms:240}];
const directions=[{id:"nw",name:"11시 ↖"},{id:"ne",name:"2시 ↗"},{id:"se",name:"5시 ↘"},{id:"sw",name:"7시 ↙"}];
export function CharacterMotion({name,asset}:{name:string;asset:string}){
 const container=useRef<HTMLElement>(null);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"100px"});if(container.current)observer.observe(container.current);return()=>observer.disconnect()},[]);
 const [action,setAction]=useState(0),[direction,setDirection]=useState(2),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 useEffect(()=>{setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)},[]);
 useEffect(()=>{if(!playing || !visible)return;const timer=window.setInterval(()=>setFrame(f=>(f+1)%4),actions[action].ms);return()=>clearInterval(timer)},[playing,visible,action,direction]);
 const src=`/images/folklore/${asset}/${directions[direction].id}-${action}-${frame}.webp`;
 return <section ref={container} className={s.motion} aria-label={`${name} 4방향 모션`}><div className={s.motionStage}><img width={160} height={160} src={src} alt={`${name} ${directions[direction].name} ${actions[action].name} ${frame+1}프레임`} className={s.motionFrame}/></div><div className={s.motionControls} role="group" aria-label="방향">{directions.map((d,i)=><button key={d.id} type="button" aria-pressed={direction===i} onClick={()=>{setDirection(i);setFrame(0)}}>{d.name}</button>)}</div><div className={s.motionControls} role="group" aria-label="동작">{actions.map((a,i)=><button key={a.name} type="button" aria-pressed={action===i} onClick={()=>{setAction(i);setFrame(0)}}>{a.name}</button>)}</div><div className={s.motionControls}><button type="button" onClick={()=>setPlaying(p=>!p)}>{playing?'정지':'재생'}</button><button type="button" onClick={()=>{setPlaying(false);setFrame(f=>(f+3)%4)}}>이전 프레임</button><button type="button" onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button><span>{frame+1} / 4</span></div><small>4방향 · 동작별 4프레임 · 초안 v2<br/>접지 기준선 정렬 · 이동은 제자리 동작 미리보기</small><div hidden aria-hidden="true">{Array.from({length:4},(_,i)=><img key={`${direction}-${action}-${i}`} src={`/images/folklore/${asset}/${directions[direction].id}-${action}-${i}.webp`} alt=""/>)}</div></section>
}
