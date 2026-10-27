"use client";
import {useEffect,useState} from 'react';
import {HongLayerRig} from './HongLayerRig';
import {hongDirections,type Direction,type HongStance} from '../model/hongRig';
import s from './playable.module.css';
const skin={root:'/images/playable/wang-geon/base-v2',weapon:'/images/playable/wang-geon/base-v1/sword.webp'};
const loadout={weapon:0,armor:38,accessory:-1};
const actions=['대기','이동','공격','스킬'];
export function WangGeonLegacyMotion(){
 const [dir,setDir]=useState<Direction>('se'),[stance,setStance]=useState<HongStance>('mounted'),[action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setFrame(f=>(f+1)%4),action===0?320:190);return()=>clearInterval(timer)},[playing,action]);
 return <section className={`${s.preview} ${s.hongPreview}`} aria-label="왕건 기본 장비 모션">
 <div className={s.hongTop}><div className={s.hongPortrait}><strong>군웅</strong><img src="/images/representatives/wang-geon-portrait-v3.webp" width={80} height={100} alt="왕건 초상화"/></div><div className={s.hongNames}><strong>조조</strong><span>↓</span><strong>왕건</strong></div><div className={`${s.stage} ${s.equipmentStage}`}><HongLayerRig compact name="왕건" skin={skin} loadout={loadout} dir={dir} stance={stance} action={action} frame={frame}/></div></div>
 <div className={s.hongQuickControls}><div role="group" aria-label="탑승 상태">{(['mounted','dismounted'] as const).map(v=><button key={v} aria-pressed={stance===v} onClick={()=>{setStance(v);setFrame(0)}}>{v==='mounted'?'탑승':'일반'}</button>)}</div><div role="group" aria-label="방향">{hongDirections.map(d=><button key={d.dir} aria-pressed={dir===d.dir} onClick={()=>{setDir(d.dir);setFrame(0)}}>{d.label.slice(2,5)}</button>)}</div><button onClick={()=>setPlaying(v=>!v)}>{playing?'정지':'재생'}</button></div>
 <div className={s.controls} role="group" aria-label="동작">{actions.map((a,i)=><button key={a} aria-pressed={action===i} onClick={()=>{setAction(i);setFrame(0)}}>{a}</button>)}</div>
 <div className={s.controls}><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button><small>{frame+1} / 4</small></div>
 <p className={s.caption}>단검 · 가죽찰갑 · {stance==='mounted'?'기본 말':'하마'} · 보조 없음<br/>왕건 전용 기본 외형 · 색면 단순화 v2. 말 이동은 공통 4프레임 보행, 인물 동작은 관절 조합 초안입니다.</p>
 <details><summary>기본 장비 · 제작 범위</summary><p>군웅 · 이동 6 · 원본 능력치 유지. 초기 지급 장비만 표현했습니다. 승급 외형과 다른 무기·탈것 선택은 후속 제작 대상입니다. 초상화의 왕관·왕복은 전투 기본 장비에 포함하지 않습니다.</p><p>11시·2시·5시·7시 방향과 탑승·하마에서 대기·이동·공격·스킬을 비교합니다. 게임 엔진의 이동·피격·전투 판정은 포함하지 않습니다.</p></details>
 </section>;
}
