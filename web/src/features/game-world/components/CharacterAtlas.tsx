"use client";
import { MonarchComparison } from "./MonarchComparison";
import { useState } from "react";
import portraits from "../data/general-portraits.json";
import proposals from "../data/ally-proposals.json";
import folklore from "../data/folklore-plan.json";
import playable from "../data/playable-characters.json";
import { GeneralCompleteMotion } from "./GeneralCompleteMotion";
import motions from '../data/motion-pilots.json';
import models from '../data/job-models.json';
import { FolkloreCard } from "./FolkloreCard";
import layout from "./items.module.css";
import atlas from "../data/characters.json";
import s from "./characters.module.css";
const generals=atlas.records.filter(p=>!folklore.companions.some(c=>c.id===p.id)).map(p=>{
 const portrait=portraits.records.find(c=>c.originalId===p.id); const play=playable.records.find(c=>c.originalId===p.id); const proposal=proposals.find(a=>a.id===p.id); const spirit=folklore.companions.find(a=>a.id===p.id);
 const kind=p.id===0||play||proposal||p.recommendation==="역사 인물 추천"?"실존 인물":spirit?"설화 존재":p.category==="동일 인물 변형"||p.id>=210?"통합 검토":p.category==="주민·소품"?"배역·소품":"창작 인간";
 const classification=kind==="통합 검토"?"동일 인물의 상태·외형 또는 공통 부대 유형으로 묶는 안. 원본 삭제는 하지 않음.":kind==="배역·소품"?"주민·동물·소품을 유지할지 시나리오 필요에 따라 검토.":kind==="창작 인간"?"실존 대응을 아직 정하지 않은 임시 분류. 역사 인물이 없다는 판정이 아니며 가칭·관계 모두 재검토.":kind==="설화 존재"?"전승 모티프를 바탕으로 새 동료를 만드는 안. 역사 인물의 자리를 무조건 대체하지 않음.":"역사 인물 중심으로 설계. 왕건 외 대응은 추천이며 관계와 연표 추가 검토.";
 return {...p,portrait:portrait?.portrait??p.portrait,hasNewPortrait:!!portrait||!!play,portraitInfo:portrait,play,proposal,kind,classification,replacement:play?.name??proposal?.name??spirit?.name??p.replacement,reason:play?.description??proposal?.why??spirit?.role??p.reason,recommendation:play?"새 게임 플레이 외형 초안":proposal?"역사 인물 추천":spirit?spirit.status:p.recommendation};
});
const records=[...generals.map(p=>({...p,spirit:undefined as typeof folklore.companions[number]|undefined})),...folklore.companions.map(c=>({...generals[0],id:c.id,name:c.name,replacement:c.name,kind:'설화 존재',category:'이름 있는 인물',job:c.family,spirit:c}))];
const categories=["전체","이름 있는 인물","동일 인물 변형","주민·소품","일반 부대"];
export function CharacterAtlas(){
 const [kind,setKind]=useState("전체");
 const [query,setQuery]=useState("");const [category,setCategory]=useState("이름 있는 인물");const [job,setJob]=useState("");const [limit,setLimit]=useState(24);
 const rows=records.filter(p=>(kind==="전체"||p.kind===kind)&&(category==="전체"||p.category===category)&&(!job||p.job===job)&&`${p.name} ${p.replacement} ${p.id}`.includes(query.trim()));
 const reset=()=>setLimit(24);
 return <section className={s.section} aria-label="인물 목록">
<div className={layout.itemToolbar}>
 <nav className={s.typeTabs} aria-label="인물 유형">{['전체','실존 인물','창작 인간','설화 존재','통합 검토','배역·소품'].map(k=><button key={k} aria-pressed={kind===k} onClick={()=>{setKind(k);setJob('');setCategory(k==='전체'?'이름 있는 인물':'전체');reset()}}>{k}</button>)}</nav>
 <form className={layout.itemSearch} role="search" onSubmit={e=>e.preventDefault()}><input aria-label="인물 검색" value={query} placeholder="이름 또는 원본 ID 검색" onChange={e=>{setQuery(e.target.value);reset()}}/>{query&&<button type="button" aria-label="검색어 지우기" onClick={()=>{setQuery('');reset()}}>×</button>}<button type="submit" aria-label="검색">⌕</button></form></div>
 <div className={layout.browseLayout}><aside className={layout.browseSidebar} aria-label="인물 필터"><fieldset className={layout.filterGroup}><legend>{kind==='설화 존재'?'설화 종류':'병과 · 종류'}</legend>{['',...Array.from(new Set(records.filter(p=>kind==='전체'||p.kind===kind).map(p=>p.job))).sort()].map(j=><button key={j} aria-pressed={job===j} onClick={()=>{setJob(j);reset()}}><span>{j||'전체'}</span><small>{records.filter(p=>(kind==='전체'||p.kind===kind)&&(!j||p.job===j)&&(category==='전체'||p.category===category)&&`${p.name} ${p.replacement} ${p.id}`.includes(query.trim())).length}</small></button>)}</fieldset>{kind!=='설화 존재'&&<fieldset className={layout.filterGroup}><legend>등장 구분</legend>{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);reset()}}>{c}</button>)}</fieldset>}</aside><div className={layout.catalogBody}>
 <MonarchComparison/>
 <div className={s.grid}>{rows.slice(0,limit).map(p=>p.spirit?<FolkloreCard key={p.id} companion={p.spirit}/>:<article className={s.card} key={p.id}><div className={s.meta}><span>#{String(p.id).padStart(3,"0")} · {p.category}</span><span>{p.id===0?"주인공":""}</span></div>{(p.id===0||motions.some(x=>x.stages.some(stage=>stage.id===p.jobId)))?<GeneralCompleteMotion name={p.replacement} originalName={p.name} portrait={p.play?.portrait??p.portrait} jobId={p.id===0?0:p.jobId}/>:<div className={s.cleanIdentity}><div><strong>{p.job}</strong><img width={80} height={100} loading="lazy" src={p.play?.portrait??p.portrait} alt={`${p.replacement} 초상화`}/></div><div className={s.cleanNames}><h2>{p.name}</h2><span>↓</span><h3>{p.replacement}</h3></div><figure><img width={128} height={128} loading="lazy" src={models.records.find(x=>x.id===p.jobId)?.image??p.sprite} alt={`${p.job} 대표 모습`}/><figcaption>{models.records.some(x=>x.id===p.jobId)?'병과 대표 · 정지 모습':'원본 모습'} · 모션 준비 중</figcaption></figure></div>}
 <div className={s.tags}><span>{p.kind}</span><span>{p.job}</span><span>이동 {p.movement??'미정'}</span></div>
 <p>{p.reason}</p><details><summary>인물 이야기 · 역사와 창작</summary><p>{p.classification}</p>{p.portraitInfo&&<details><summary>초상화 · 복식 참고와 창작 구분</summary><p><b>{p.portraitInfo.appearance}</b></p><p>{p.portraitInfo.referenceNote}</p>{p.portraitInfo.source&&<a href={p.portraitInfo.source.url} target="_blank" rel="noreferrer">{p.portraitInfo.source.title} ↗</a>}</details>}{p.proposal&&<div className={s.proposal}><h4>{p.play?`유지 병과 · ${p.job}`:`제안 병과 · ${p.proposal.job}`}</h4><p><b>왕건과의 관계</b><br/>{p.proposal.relation}</p><details><summary>역사 · 성격 · 추천 근거 자세히</summary>{[["역사 기록",p.proposal.fact],["성격 제안 · 창작",p.proposal.personality],["전투 역할 · 창작",p.proposal.play],["합류·퇴장 설계",p.proposal.timing],["그대로 옮기지 않을 것",p.proposal.caution]].map(([label,value])=><p key={label}><b>{label}</b><br/>{value}</p>)}<a href={p.proposal.source} target="_blank" rel="noreferrer">역사 근거 읽기 ↗</a></details></div>}</details><details><summary>기본 능력치 · 장비</summary><h4>원본 기본 수치</h4><dl className={s.values}>{["공격 계열","방어 계열","정신 계열","순발 계열","사기 계열","HP 기본","MP 기본"].map((label,i)=><div key={label}><dt>{label}</dt><dd>{p.base[i]}</dd></div>)}</dl><p>첫 5개 값은 추출된 기본 성장 입력값입니다. 최종 전투 수치나 100점 환산 능력치로 읽지 않습니다.</p><h4>기본 장비 슬롯</h4><p>{p.gear.join(" · ")}</p><h4>교체할 항목</h4><p>이름 / 초상화 / 시나리오·전투 외형 / 소속·관계 / 등장·퇴장 / 대사 · 원본 병과·이동·능력치 유지</p><small>얼굴 #{p.faceId} · 몸체 #{p.bodyId} · 병과 #{p.jobId}<br/>원본 상태 바이트 {p.rawState} (의미 미확정, 생존 상태 아님)<br/>초상화는 기본 flags=0, progress=0 기준. 상황별 표정과 전투 동작 전체는 이 미리보기에 포함하지 않습니다.</small></details></article>)}</div>
 {rows.length===0&&<p className={s.note}>검색 결과가 없습니다. 이름이나 병과 필터를 바꿔주세요.</p>}{limit<rows.length&&<button className={s.more} onClick={()=>setLimit(limit+24)}>24개 더 보기</button>}
 </div></div><aside className={s.note}><strong>추천을 읽는 기준</strong><p>역사 인물 추천은 서사·전투 역할의 참고안입니다. 원본의 성격·가족관계·사망 사건을 일대일로 옮기지 않습니다. 창작 이름은 자동 배정한 가칭이며 아직 인물 설정이 아닙니다. 예를 들어 신숭겸은 공산 전투의 역사적 죽음을 유지하고, 후반 등장 명단은 따로 정합니다.</p>{atlas.sources.map(x=><a key={x.url} href={x.url} target="_blank" rel="noreferrer">{x.title} ↗ </a>)}</aside></section>
}
