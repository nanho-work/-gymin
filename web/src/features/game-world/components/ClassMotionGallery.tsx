"use client";
import {useState} from 'react';
import {CharacterMotion} from './CharacterMotion';
import data from '../data/motion-pilots.json';
import s from './job-models.module.css';
const standing=[{name:'서 있기',ms:360}];
const weakened=[{name:'쇠약',ms:300}];
export function ClassMotionGallery(){
 const [job,setJob]=useState(9),[mode,setMode]=useState('combat'),[stage,setStage]=useState(0);
 const selected=data.find(x=>x.id===job)!;
 const current=selected.stages[stage];
 const root=mode==='scenario'?current.scenario:mode==='weak'?current.weakened:current.combat;
 return <div><div className={s.controls} role="group" aria-label="모션 병과">{data.map(x=><button key={x.id} aria-pressed={job===x.id} onClick={()=>{setJob(x.id);setStage(0);setMode('combat')}}>{x.name}</button>)}</div>
 <div className={s.controls} role="group" aria-label="승급 단계">{selected.stages.map((x,i)=><button key={x.id} aria-pressed={stage===i} onClick={()=>setStage(i)}>{i===0?'기본':i===1?'1차 승급':'최종 승급'} · {x.name}</button>)}</div><h3>{current.name} · 모션 초안</h3>
 <div className={s.controls} role="group" aria-label="장면">{[['combat','전투'],['scenario','시나리오 · 빈손'],...(selected.cavalry?[['weak','탑승 · 쇠약']]:[])].map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)}>{label}</button>)}</div>
 <CharacterMotion name={current.name} asset="" root={root} actions={mode==='scenario'?standing:mode==='weak'?weakened:undefined} caption={mode==='weak'?'HP 30% 이하·상태 이상용 공통 시각 초안입니다. 실제 상태 판정은 미연결입니다.':mode==='scenario'?'무기 없는 시나리오용 서 있기. 기병은 하마 모습입니다.':'4방향 · 대기·이동·공격·스킬 · 각 4프레임. 승급별 고정 외형을 비교합니다.'}/>
 <aside><strong>검토 중인 부분</strong><ul>{current.notes.map(note=><li key={note}>{note}</li>)}</ul></aside>
 </div>;
}
