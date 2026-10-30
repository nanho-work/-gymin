"use client";

import {useState} from 'react';
import story from '../data/story-site.json';
import monarchs from '../data/monarch-motions.json';
import pilots from '../data/motion-pilots.json';
import portraits from '../data/general-portraits.json';
import s from './scenario-preview.module.css';

type Line = {speaker:string; text:string};
type Scene = {id:string; type:string; trigger:string; direction:string; lines:Line[]};
const stage = story.stages[0];
const introduction = story.interludes.find(x=>x.title.startsWith('I00 '))!;
const introLines = introduction.body.split('\n').flatMap(line=>{
  const match=line.match(/^(설명|궁예|왕건): “(.+)”$/);
  return match ? [{speaker:match[1],text:match[2]}] : [];
});
const scenes:Scene[]=[{id:'I00',type:'송악에서 남쪽으로',trigger:'첫 스테이지에 앞선 도입',direction:'궁예의 명령을 받은 왕건. 기존 마당 배경을 군영의 임시 공간으로 사용.',lines:introLines},...stage.scenes];
const army = pilots.find(x=>x.id===3)!;
const caster = pilots.find(x=>x.id===24)!;
const bandit = pilots.find(x=>x.id===21)!;
const wang = monarchs.find(x=>x.name==='왕건')!.stages[0];
const gung = monarchs.find(x=>x.name==='궁예')!.stages[0];
const actors:Record<string,{scenario:string;combat:string;portrait?:string}>={
  '왕건':{...wang,portrait:portraits.records.find(x=>x.name==='왕건')?.portrait},
  '궁예':{...gung,portrait:portraits.records.find(x=>x.name==='궁예')?.portrait},
  '길목 수장':bandit,'군관':army,'전령':army,'기록관':caster,
};
const stageCast:Record<string,string[]>={I00:['왕건','궁예'],'B00-P00':[], 'B00-P01':['왕건','길목 수장'],'B00-P02':['왕건','군관'],'B00-P03':['왕건'],'B00-P04':['왕건','전령'],'B00-P05':['왕건'],'B00-P06':['왕건','기록관'],'B00-P07':[]};

export function ScenarioPreview(){
  const [sceneIndex,setSceneIndex]=useState(0);
  const [lineIndex,setLineIndex]=useState(0);
  const scene=scenes[sceneIndex];
  const line=scene.lines[lineIndex];
  const last=sceneIndex===scenes.length-1&&lineIndex===scene.lines.length-1;
  const first=sceneIndex===0&&lineIndex===0;
  const battlefield=['B00-P03','B00-P04','B00-P05'].includes(scene.id);
  const mapScene=battlefield||scene.id==='B00-P00'||scene.id==='B00-P07';
  const background=mapScene?stage.mapDetails[0].image:stage.backgroundImages[0].image;
  const cast=stageCast[scene.id]??[];
  const active=actors[line.speaker];
  const total=scenes.reduce((n,x)=>n+x.lines.length,0);
  const progress=scenes.slice(0,sceneIndex).reduce((n,x)=>n+x.lines.length,0)+lineIndex+1;
  function select(index:number){setSceneIndex(index);setLineIndex(0);}
  function next(){if(lineIndex<scene.lines.length-1)setLineIndex(lineIndex+1);else if(!last)select(sceneIndex+1);}
  function previous(){if(lineIndex>0)setLineIndex(lineIndex-1);else if(sceneIndex>0){setSceneIndex(sceneIndex-1);setLineIndex(scenes[sceneIndex-1].lines.length-1);}}
  return <section className={s.player} aria-label="첫 스테이지 시나리오 미리보기" onKeyDown={e=>{
    if(e.target instanceof HTMLSelectElement)return;
    if(e.key==='ArrowRight'){e.preventDefault();next();}
    if(e.key==='ArrowLeft'){e.preventDefault();previous();}
  }}>
    <div className={s.toolbar}>
      <label>장면 <select aria-label="미리보기 장면" value={sceneIndex} onChange={e=>select(Number(e.target.value))}>{scenes.map((x,i)=><option key={x.id} value={i}>{i+1}. {x.type}</option>)}</select></label>
      <span>{sceneIndex+1} / {scenes.length}장면</span>
    </div>
    <div className={s.stage} key={scene.id}>
      <img className={`${s.background} ${mapScene?s.map:''}`} src={background} alt={mapScene?'기존 첫 전장 지도':'기존 마당 배경 · 군영 임시 공간'}/>
      <div className={s.location}>{stage.period}년 · {mapScene?'남부 진출로':'군영'}<small>{scene.type}</small></div>
      {cast.map((name,i)=>{const actor=actors[name];const direction=i===0?'se':'sw';return <div key={name} className={`${s.actor} ${i===0?s.left:s.right} ${line.speaker===name?s.speaking:''}`}>
        <img src={`${battlefield?actor.combat:actor.scenario}/${direction}-0-0.webp`} width={160} height={160} alt={`${name} · ${battlefield?'전투 대기':'빈손 서 있기'}`}/><span>{name}</span>
      </div>})}
      <span className={s.previewLabel}>{battlefield?'전장 연출 예시 · 실제 병력 배치 아님':'기존 에셋 연출 초안'}</span>
    </div>
    <div className={s.dialogue} aria-live="polite" aria-atomic="true">
      {active?.portrait&&<img src={active.portrait} width={64} height={80} alt={`${line.speaker} 초상`}/>}
      <div><strong>{line.speaker==='설명'?'이야기':line.speaker}</strong><p>{line.text}</p></div>
      <small>{lineIndex+1} / {scene.lines.length}</small>
    </div>
    <progress value={progress} max={total} aria-label="전체 대사 진행"/>
    <div className={s.controls}>
      <button onClick={previous} disabled={first}>← 이전</button>
      <span>{progress} / {total}</span>
      <button className={s.next} onClick={next} disabled={last}>{last?'미리보기 완료':lineIndex===scene.lines.length-1?'다음 장면 →':'다음 대사 →'}</button>
      <button onClick={()=>select(0)} disabled={first}>처음부터</button>
    </div>
    {last&&<p className={s.end}>첫 스테이지 미리보기가 끝났습니다. 위 장면 선택으로 다시 확인할 수 있습니다.</p>}
    <details className={s.notes}><summary>현재 장면의 연출·에셋 정보</summary><p><b>{scene.id}</b> · {scene.trigger}</p><p>{scene.direction}</p><p>배경: {background.split('/').pop()}. 군관·전령은 경보병, 길목 수장은 적병, 기록관은 책사 에셋을 임시 사용합니다. 왕건과 궁예는 기본 단계 외형입니다.</p><p>조건부 준비·전투 중 장면도 검토를 위해 순서대로 보여줍니다. 실제 전투·지급·분기 판정은 실행하지 않습니다. 정지 대기 프레임으로 대화 배치를 확인하는 화면입니다.</p></details>
  </section>;
}
