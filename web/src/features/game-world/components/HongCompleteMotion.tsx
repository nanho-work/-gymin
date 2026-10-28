"use client";
import {useEffect,useState} from 'react';
import data from '../data/motion-pilots.json';
import characters from '../data/playable-characters.json';
import s from './playable.module.css';
const ranks=data.find(x=>x.id===9)!.stages;
const hong=characters.records.find(x=>x.id==='hong-yu')!;
const dirs=[['nw','11시'],['ne','2시'],['se','5시'],['sw','7시']];
const actions=['대기','이동','공격','스킬'];
export function HongCompleteMotion(){
 const [rank,setRank]=useState(0),[mode,setMode]=useState('combat'),[dir,setDir]=useState('se'),[action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 const current=ranks[rank],a=mode==='combat'?action:0;
 const root=mode==='scenario'?current.scenario:mode==='weak'?current.weakened:current.combat;
 const ms=mode==='scenario'?360:mode==='weak'?300:[320,170,190,240][a];
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>{if(!document.hidden)setFrame(f=>(f+1)%4)},ms);return()=>clearInterval(timer)},[playing,ms]);
 const reset=()=>setFrame(0);
 return <section className={`${s.preview} ${s.hongPreview}`} aria-label="홍유 완성 프레임 모션">
 <div className={s.hongTop}><div className={s.hongPortrait}><strong>{current.name}</strong><img src={hong.portrait} width={80} height={100} alt="홍유 초상화"/></div><div className={s.hongNames}><strong>하후돈</strong><span>↓</span><strong>홍유</strong></div><img src={`${root}/${dir}-${a}-${frame}.webp`} width={128} height={128} style={{maxWidth:'100%',objectFit:'contain'}} alt={`홍유 ${current.name} ${dir} ${mode==='scenario'?'빈손 서 있기':mode==='weak'?'쇠약':actions[a]} ${frame+1}프레임`}/></div>
 <div className={s.hongQuickControls}><div role="group" aria-label="탑승 상태">{[['combat','탑승'],['scenario','일반 · 서 있기'],['weak','탑승 · 쇠약']].map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>{setMode(id);reset()}}>{label}</button>)}</div><div role="group" aria-label="방향">{dirs.map(([id,label])=><button key={id} aria-pressed={dir===id} onClick={()=>{setDir(id);reset()}}>{label}</button>)}</div><button onClick={()=>setPlaying(v=>!v)}>{playing?'정지':'재생'}</button></div>
 <div className={s.controls} role="group" aria-label="동작">{(mode==='combat'?actions:[mode==='scenario'?'빈손 서 있기':'쇠약']).map((label,i)=><button key={label} aria-pressed={a===i} onClick={()=>{setAction(i);reset()}}>{label}</button>)}</div>
 <div className={s.controls} role="group" aria-label="승급">{ranks.map((x,i)=><button key={x.id} aria-pressed={rank===i} onClick={()=>{setRank(i);reset()}}>{x.name}</button>)}</div>
 <div className={s.controls}><button onClick={()=>{setPlaying(false);setFrame(f=>(f+3)%4)}}>이전 프레임</button><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button><small>{frame+1} / 4</small></div>
 <p className={s.caption}>{mode==='scenario'?'시나리오용 하마 · 무기 없는 서 있기. 하마 이동·공격은 미제작입니다.':mode==='weak'?'탑승 전용 · HP 30% 이하·상태 이상용 공통 시각 미리보기입니다. 실제 상태 판정은 미연결입니다.':'말과 기수를 함께 그린 완성 프레임. 승급별 복식·무기·말은 고정 세트입니다.'}</p>
 <details><summary>제작 상태·남은 검토 사항</summary><p>현재 제작한 경기병 계열 대표 모델을 홍유에 연결했습니다. 초상화·이름·원본 능력치는 유지합니다. 개별 장비 착용은 외형을 바꾸지 않습니다.</p><ul>{current.notes.map(note=><li key={note}>{note}</li>)}</ul></details>
 </section>;
}
