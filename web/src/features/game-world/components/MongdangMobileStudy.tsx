"use client";
import { useEffect, useState } from "react";
import s from "./mongdang-mobile.module.css";
const actions = ["대기", "이동", "공격", "스킬"];
export function MongdangMobileStudy() {
 const [action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 const [size,setSize]=useState(96),[terrain,setTerrain]=useState("grass");
 useEffect(()=>{if(!playing)return;const t=setInterval(()=>setFrame(f=>(f+1)%4),action===0?320:220);return()=>clearInterval(t)},[playing,action]);
 return <section className={s.study} aria-label="몽당 모바일 스타일 비교">
 <h3>몽당 · 모바일 가독성 시안</h3><p>5시 방향부터 비교합니다. 머리·빗자루·실루엣을 강조한 새 시안입니다.</p>
 <div className={s.controls} aria-label="시안 동작">{actions.map((a,i)=><button key={a} aria-pressed={action===i} onClick={()=>{setAction(i);setFrame(0)}}>{a}</button>)}<button onClick={()=>setPlaying(p=>!p)}>{playing?"정지":"재생"}</button><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button></div>
 <div className={s.controls}><label>표시 크기 <select value={size} onChange={e=>setSize(Number(e.target.value))}><option value={72}>작게 · 72px</option><option value={96}>기본 · 96px</option><option value={128}>크게 · 128px</option></select></label><label>배경 <select value={terrain} onChange={e=>setTerrain(e.target.value)}><option value="grass">풀밭</option><option value="earth">흙길</option><option value="night">어두운 땅</option></select></label></div>
 <div className={s.comparison}>{[{label:"기존 · 세밀한 일러스트",asset:"mongdang-motion-v2"},{label:"새 시안 · 선명한 윤곽",asset:"mongdang-mobile-v3"}].map(v=><figure key={v.asset}><div className={`${s.terrain} ${s[terrain]}`}><img src={`/images/folklore/${v.asset}/se-${action}-${frame}.webp`} width={size} height={size} alt={`${v.label} ${actions[action]} ${frame+1}프레임`}/></div><figcaption>{v.label}</figcaption></figure>)}</div>
 <small>프레임 {frame+1}/4 · 크기는 투명 여백을 포함한 CSS 표시 크기입니다. 배경은 명암 비교용 임시 타일이며 최종 전투 맵이 아닙니다. 4방향 완성본이나 실기기 검증 완료가 아닌 스타일 검토용 초안입니다.</small>
 </section>
}
