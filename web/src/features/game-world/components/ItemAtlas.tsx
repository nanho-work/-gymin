"use client";
import {useState} from 'react';
import {ItemProposalPreview} from './ItemProposalPreview';
import data from '../data/items.json';
import s from './items.module.css';
const categories=['전체','무기','방어구','보조구','소모품'];
export function ItemAtlas(){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('전체'),[job,setJob]=useState('전체');
 const jobs=Array.from(new Set(data.records.flatMap(i=>i.allowedJobs)));
 const shown=data.records.filter(i=>(category==='전체'||i.category===category)&&(job==='전체'||i.allowedJobs.includes(job))&&`${i.id} ${i.name} ${i.family} ${i.description}`.includes(query.trim()));
 return <section className={s.atlas}><span className={s.eyebrow}>ITEM ARCHIVE · ORIGINAL → OUR WORLD</span><h1>장비와 도구, 새로운 모습의 출발점</h1><p>원본 조조전의 아이템 <b>{data.records.length}개</b>를 이미지·설명·장착 조건과 함께 정리했습니다. 두 아이템의 교체 디자인을 먼저 제안하며, 모두 검토 전 초안입니다.</p><div className={s.notice}>원본 비교 자료입니다. 아이콘은 장비를 착용한 캐릭터 모션과 별개입니다. 무기·방어구·승급·탈것에 따른 새 외형은 이후 제작합니다. 말도 원본 장비 슬롯에서는 보조구로 분류됩니다.</div>
 <ItemProposalPreview/><h2>원본 전체 목록 · 104개</h2><div className={s.filters}><label>아이템 검색<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="이름·설명·원본 번호"/></label><label>착용 가능 병과<select value={job} onChange={e=>setJob(e.target.value)}><option>전체</option>{jobs.map(j=><option key={j}>{j}</option>)}</select></label><button onClick={()=>{setQuery('');setCategory('전체');setJob('전체')}}>필터 초기화</button></div><small>병과 필터는 허용표가 있는 무기·방어구에 적용합니다. 보조구 효과의 발동 조건과는 다릅니다.</small>
 <div className={s.tabs} aria-label="아이템 분류">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c} <b>{c==='전체'?data.records.length:data.records.filter(i=>i.category===c).length}</b></button>)}</div><p role="status">{shown.length}개 표시 / 전체 {data.records.length}개</p>
 <div className={s.grid}>{shown.map(i=><article className={s.card} key={i.id}><header><img src={i.image} width={64} height={64} alt={`${i.name} 원본 아이콘`} loading="lazy"/><div><small>#{String(i.id).padStart(3,'0')} · {i.category} / {i.family}</small><h2>{i.name}</h2></div></header><p className={s.description}>{i.description}</p><dl><div><dt>상점 기준 구매가</dt><dd>{i.purchasePrice===null?'구매가 없음':`${i.purchasePrice.toLocaleString()}금`}</dd></div><div><dt>새 게임 교체안</dt><dd>{[9,39].includes(i.id)?'상단에 디자인 초안 제안 · 미확정':`미정 · ${i.visualStatus}`}</dd></div></dl><details><summary>착용 병과 · 수치 · 입수 정보</summary><h3>착용 가능 병과</h3><p>{i.allowedJobs.length?i.allowedJobs.join(' · '):i.permissionNote}</p>{i.allowedJobs.length>0&&<small>{i.permissionNote}</small>}<h3>원본 수치</h3><p>기본값 {i.base} · 성장값 {i.growth} · 효과값 {i.value}</p><small>값의 의미는 아이템 종류에 따라 다릅니다. 실제 장비 레벨 보정이나 전투 중 최종 능력치가 아닙니다.</small><p>종류 코드 {i.type} · 특수효과 코드 {i.special===255?'없음':i.special}</p><h3>상점 진열 시나리오 ID</h3><p>{i.shopScenarios.length?i.shopScenarios.map(n=>String(n).padStart(2,'0')).join(' · '):'원본 상점표에 없음 · 이벤트 등 다른 입수 경로는 별도 정리 예정'}</p><small>원본 내부 ID(0부터 시작)입니다. 새 게임의 스테이지 번호가 아닙니다.</small></details></article>)}</div>{!shown.length&&<p>조건에 맞는 아이템이 없습니다. 필터를 초기화해 주세요.</p>}
 <p className={s.source}>자료: 원본 아이템 104개 · ITEM.E5 아이콘 · IMSG.E5 설명 · 기존 추출 병과 허용표/상점표. 장착 외형과 개별 이벤트 입수 경로는 아직 연결하지 않았습니다.</p></section>
}
