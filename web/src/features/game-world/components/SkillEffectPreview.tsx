"use client";
import {useEffect,useState} from 'react';
import s from './fireball.module.css';
import effectData from '../data/skill-effects.json';
import elementScenes from '../data/skill-effect-scenes-element.json';
import supportScenes from '../data/skill-effect-scenes-support.json';
import actors from '../data/skill-effect-actors.json';
import {SkillTarget,TargetConditionControls} from './SkillTarget';
type Sheet={file:string;name:string;frameCount:number;cols:number;rows:number;frameMs:number};
type Effect=Sheet&{id:number;scope:string;note?:string;followup?:Sheet};
export const skillEffects:Record<number,Effect>=Object.fromEntries(effectData.map(x=>[x.id,x]));
const scenes=Object.fromEntries([...elementScenes,...supportScenes].map(x=>[x.id,x]));
const results=[{id:33,label:'독'},{id:31,label:'혼란'},{id:35,label:'이동 불가'},{id:37,label:'침묵'},{id:23,label:'순발 약화'},{id:25,label:'사기 약화'},{id:27,label:'공격 계열 약화'},{id:29,label:'방어 약화'},{id:49,label:'순발 강화'},{id:51,label:'사기 강화'},{id:53,label:'공격 계열 강화'},{id:55,label:'방어 강화'},{id:40,label:'HP 완전 회복'}];
export function SkillEffectPreview({id}:{id:number}){
 const effect=skillEffects[id],scene=scenes[id],actor=actors.find(x=>x.id===id);
 const [playing,setPlaying]=useState(false),[tick,setTick]=useState(0),[resultId,setResultId]=useState(33),[outcome,setOutcome]=useState('성공');
 const [condition,setCondition]=useState({lowHp:false,status:false});
 const random=id===38||id===66,instant=id===9||id===21,status=id>=23&&id<=37;
 const followup=random?skillEffects[resultId]:effect?.followup;
 const targets=scene?.targets??[{x:70,y:50,delay:0}],delay=Math.max(...targets.map(x=>x.delay));
 const summon=scene?.kind==='summon'||random;
 const base=effect?.frameCount??8,following=followup?.frameCount??0;
 const duration=base+(summon?following:0)+delay+(id===67?8:0),total=4+duration+8,local=tick-4;
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setTick(t=>(t+1)%total),effect?.frameMs??120);return()=>clearInterval(timer)},[playing,total,effect?.frameMs]);
 if(!effect||!actor)return null;
 const counter=(id>=23&&id<=30)||(id>=48&&id<=56)||id===61||id===63;
 const ended=local>=duration,cast=tick<4,absorb=scene.kind==='absorb',self=id>=61&&id<=63;
 const positions=[...new Map(targets.map(t=>[`${t.x},${t.y}`,t])).values()];
 const resultText=outcome==='상쇄'?'반대 효과 상쇄':instant?(outcome==='성공'?'퇴각':outcome==='면역'?'즉사 면역':'실패'):status?(outcome==='성공'?'효과 적용':id>=33&&id<=36?'피해 · 상태이상 실패':'효과 실패'):id===67?'HP 회복 · 상태 정화':random?(results.find(x=>x.id===resultId)?.label??'피해'):id===64?'5회 타격 예시':id>=58&&id<=60?'날씨 변경':id===62?'HP 소모 → MP 회복':id===57?'다시 행동 가능':id===20?'HP 흡수·회복':id===22?'MP 흡수·회복':id===46||id===47?'상태 정화':id===44||id===45?'MP 회복':id>=39&&id<=43?'HP 회복':id>=48?'강화 적용':'명중';
 function sprite(sheet:Sheet,frame:number,x:number,y:number,key:string){if(frame<0||frame>=sheet.frameCount)return null;return <span key={key} role="img" aria-label={`${sheet.name} ${frame+1}번 프레임`} className={s.sceneEffect} style={{left:`${x}%`,top:`${y}%`,backgroundImage:`url('${sheet.file}')`,backgroundSize:`${sheet.cols*96}px ${sheet.rows*96}px`,backgroundPosition:`-${frame%sheet.cols*96}px -${Math.floor(frame/sheet.cols)*96}px`}}/>}
 const reset=()=>{setPlaying(false);setTick(0)};
 return <section className={s.preview} aria-label={`${effect.name} 이펙트 미리보기`}>
 <div className={s.battleStage}>
 <img className={s.unit} style={{left:'25%',top:id===67||id===66?'60%':'52%'}} src={`${actor.root}/se-${cast?3:0}-${cast?tick:0}.webp`} alt={`${actor.name} ${cast?'시전':'대기'}`}/>
 {!self&&scene.kind!=='weather'&&positions.filter((p,i)=>!([66,67].includes(id)&&p.x===25)&&(id!==4||i%2===1)).map((p,i)=><SkillTarget key={i} x={p.x} y={p.y} tick={tick} condition={condition} index={i+1} hidden={instant&&ended&&outcome==='성공'} hitAt={((id<=20&&!instant)||[33,34,35,36,64,65].includes(id)||(id===38&&resultId===1))?targets.filter(t=>t.x===p.x&&t.y===p.y).map(t=>4+(summon?base:0)+t.delay+Math.min(3,(summon?following:base)-1)):[]}/>)} {absorb?sprite(effect,local,local<4?70:local<8?70-(local-4)*45/3:25,50,'absorb'):summon?<>{sprite(effect,local,50,34,'summon')}{followup&&targets.map((p,i)=>sprite(followup,local-base-p.delay,p.x,p.y,`follow-${i}`))}{id===67&&targets.map((p,i)=>sprite(skillEffects[46],local-base-following-delay,p.x,p.y,`cleanse-${i}`))}</>:targets.map((p,i)=>sprite(effect,local-p.delay,p.x,p.y,`effect-${i}`))}
 <span className={s.scenePhase}>{cast?'시전':ended?resultText:'효과 진행'}</span>
 <span className={s.scope}>{scene.kind==='weather'?'전장 날씨 예시':self?'시전자 자신':`시전자 · ${id===66?'적·아군':id>=39&&id!==64&&id!==65?'아군':'적'} 대상 예시`}</span>
 </div>
 <small>{scene.label}</small>
 {random&&<label className={s.scrub}>결과 예시<select value={resultId} onChange={e=>{setResultId(Number(e.target.value));reset()}}>{id===38&&<option value={1}>피해</option>}{results.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>}
 {(instant||status||counter)&&<label className={s.scrub}>판정 예시<select value={outcome} onChange={e=>{setOutcome(e.target.value);reset()}}><option>성공</option>{(instant||status)&&<option>실패</option>}{counter&&<option value="상쇄">반대 효과 상쇄</option>}{instant&&<option>면역</option>}</select></label>}
 {!self&&scene.kind!=='weather'&&<TargetConditionControls value={condition} onChange={setCondition}/>}
 <div className={s.controls}><button onClick={()=>setPlaying(!playing)}>{playing?'정지':'재생'}</button><button onClick={reset}>처음</button></div>
 <label className={s.scrub}>프레임 확인<input aria-label={`${effect.name} 재생 위치`} type="range" min="0" max={total-1} value={tick} onChange={e=>{setPlaying(false);setTick(Number(e.target.value))}}/></label>
 <small>{tick+1} / {total}프레임 · 시전 → 효과 → 결과</small>
 <details><summary>연출 예시 안내</summary><p>배치·시간차·결과는 시각 검토용이며 실제 전투 판정이 아닙니다. 정확한 사거리와 범위는 아래 그림을 기준으로 봅니다. 피격은 선택한 병과의 지친 모션을 4프레임 재생한 뒤 대기로 돌아옵니다. 선택한 저체력·상태이상 조건에서는 계속 유지하며 회복·강화는 피격을 유발하지 않습니다.</p>{random&&<p>선택한 대표 결과를 보여줍니다. 능력치 조합·확률을 재현하지 않으며 현무는 아군과 적군 모두에게 적용됩니다.</p>}</details>
 </section>
}
