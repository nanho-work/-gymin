"use client";
import {useEffect,useState} from 'react';
import s from './fireball.module.css';
import actors from '../data/skill-effect-actors.json';
import {SkillTarget,TargetConditionControls} from './SkillTarget';
export function FireballPreview(){
 const [mode,setMode]=useState('전체');const [play,setPlay]=useState(false);const [tick,setTick]=useState(0);
 const [condition,setCondition]=useState({lowHp:false,status:false});
 const actor=actors.find(x=>x.id===0)!;
 const total=mode==='전체'?32:mode==='불덩이'?4:8;
 const local=mode==='전체'?tick-4:tick,casting=mode==='전체'&&tick<4;
 useEffect(()=>{if(!play)return;const id=setInterval(()=>setTick(t=>(t+1)%total),100);return()=>clearInterval(id)},[play,total]);
 const flight=mode==='불덩이'||(mode==='전체'&&local<12);
 const hidden=mode==='전체'&&local>=20;
 const frame=flight?Math.max(0,local)%4:4+(mode==='명중'?tick:Math.max(0,local-12)%8);
 const x=mode==='전체'?(flight?20+Math.max(0,local)/11*55:75):50;
 return <section className={s.preview} aria-label="파이어볼 이펙트 미리보기"><div className={s.stage}>
 <img className={s.unit} style={{left:"20%",top:"50%"}} src={`${actor.root}/se-${casting?3:0}-${casting?tick:0}.webp`} alt={`${actor.name} 시전자`}/><SkillTarget x={75} y={50} tick={tick} condition={condition} hitAt={mode==='전체'?[16]:mode==='명중'?[0]:[]}/><span className={s.origin}>시전자</span><span className={s.target}>대상</span>
 {!hidden&&!casting&&<span role="img" aria-label={`${flight?'불덩이':'명중'} ${frame+1}번 프레임`} className={s.sprite} style={{left:`${x}%`,backgroundPosition:`-${frame%4*96}px -${Math.floor(frame/4)*96}px`}}/>}
 </div><TargetConditionControls value={condition} onChange={setCondition}/><div className={s.controls}>{['전체','불덩이','명중'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>{setMode(m);setTick(0)}}>{m}</button>)}<button onClick={()=>setPlay(!play)}>{play?'정지':'재생'}</button><button onClick={()=>{setPlay(false);setTick(0)}}>처음</button></div>
 <label className={s.scrub}>프레임 확인 <input aria-label="파이어볼 재생 위치" type="range" min="0" max={total-1} value={tick} onChange={e=>{setPlay(false);setTick(Number(e.target.value))}}/></label>
 <small>{casting?'시전':hidden?'잔불 종료':flight?'비행':'명중'} · 투사체 4 + 명중 8프레임 · 연출 초안</small>
 </section>
}
