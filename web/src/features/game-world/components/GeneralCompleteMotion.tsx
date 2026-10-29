"use client";
import {useEffect,useState} from 'react';
import data from '../data/motion-pilots.json';
import monarchs from '../data/monarch-motions.json';
import specials from '../data/special-motions.json';
import folkloreMotions from '../data/folklore-motions.json';

import s from './playable.module.css';
const dirs=[['nw','11시'],['ne','2시'],['se','5시'],['sw','7시']];
const defaultActions=['대기','이동','공격','스킬'];
type Props={name:string;originalName:string;portrait:string;jobId:number;originalId?:number;companionId?:number};
export function GeneralCompleteMotion({name,originalName,portrait,jobId,originalId,companionId}:Props){
 const monarch=monarchs.find(x=>originalId!==undefined&&x.originalIds.includes(originalId));
 const special=companionId!==undefined?folkloreMotions.find(x=>x.companionId===companionId):specials.find(x=>x.stages.some(stage=>stage.id===jobId));
 const family=monarch??special??data.find(x=>x.stages.some(stage=>stage.id===jobId));
 const actions=special?.actions??defaultActions;
 const ranks=family!.stages;
 const cavalry=jobId===0||!!family?.cavalry;
 const [rank,setRank]=useState(monarch?0:Math.max(0,ranks.findIndex(x=>x.id===jobId))),[mode,setMode]=useState('combat'),[dir,setDir]=useState('se'),[action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 const current=ranks[rank],a=mode==='combat'?action:0;
 const root=mode==='scenario'?current.scenario:mode==='weak'?current.weakened:current.combat;
 const ms=mode==='scenario'?360:mode==='weak'?300:[320,170,190,240][a];
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>{if(!document.hidden)setFrame(f=>(f+1)%4)},ms);return()=>clearInterval(timer)},[playing,ms]);
 const reset=()=>setFrame(0);
 return <section className={`${s.preview} ${s.hongPreview}`} aria-label={`${name} 모션`}>
 <div className={s.hongTop}><div className={s.hongPortrait}><strong>{current.name}</strong><img src={portrait} width={80} height={100} alt={`${name} 초상화`}/></div><div className={s.hongNames}>{originalName&&originalName!==name&&<><strong>{originalName}</strong><span>↓</span></>}<strong>{name}</strong></div><img src={`${root}/${dir}-${a}-${frame}.webp`} width={128} height={128} style={{maxWidth:'100%',objectFit:'contain'}} alt={`${name} ${current.name} ${dir} ${mode==='scenario'?'빈손 서 있기':mode==='weak'?'쇠약':actions[a]} ${frame+1}프레임`}/></div>
 {current.notes.some(x=>x.startsWith('검수 초안'))&&<p className={s.caption}>검수 초안 · 팔·손 배치 및 동작 보완 중</p>}
 <div className={s.hongQuickControls}><div role="group" aria-label="탑승 상태">{[['combat',cavalry?'탑승':actions.length===2?'일반':'전투'],...(current.scenario?[['scenario','서 있기']]:[]),...(current.weakened?[['weak','쇠약']]:[])].map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>{setMode(id);reset()}}>{label}</button>)}</div><div role="group" aria-label="방향">{dirs.map(([id,label])=><button key={id} aria-pressed={dir===id} onClick={()=>{setDir(id);reset()}}>{label}</button>)}</div><button onClick={()=>setPlaying(v=>!v)}>{playing?'정지':'재생'}</button></div>
 <div className={s.controls} role="group" aria-label="동작">{(mode==='combat'?actions:[mode==='scenario'?'빈손 서 있기':'쇠약']).map((label,i)=><button key={label} aria-pressed={a===i} onClick={()=>{setAction(i);reset()}}>{label}</button>)}</div>
 {ranks.length>1&&<div className={s.controls} role="group" aria-label="승급">{ranks.map((x,i)=><button key={x.id} aria-pressed={rank===i} onClick={()=>{setRank(i);reset()}}>{x.name}</button>)}</div>}
 <details><summary>모션 정보 · 프레임 확인</summary>
 <div className={s.controls}><button onClick={()=>{setPlaying(false);setFrame(f=>(f+3)%4)}}>이전 프레임</button><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button><small>{frame+1} / 4</small></div>
 <p>{monarch?`${monarch.name} 전용 모델`:companionId!==undefined?'설화 동료 모델':'병과 공통 대표 모델'} · 고정 외형. 개별 장비는 외형에 반영하지 않습니다.{current.scenario&&' 서 있기는 무기 없는 시나리오 모습입니다.'}{current.weakened&&' 쇠약은 실제 상태 판정과 별개인 시각 미리보기입니다.'}{actions.length===2&&' 비전투 역할은 대기·이동만 제공합니다.'}</p>
 <ul>{current.notes.map(note=><li key={note}>{note}</li>)}</ul></details>
 </section>;
}
