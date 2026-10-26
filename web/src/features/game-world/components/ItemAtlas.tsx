"use client";
import {useRef,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {catalog,itemMenus,itemFamily,itemEffects,type ItemMenu} from '../model/itemCatalog';
import s from './items.module.css';
export function ItemAtlas(){
 const path=usePathname(),key=path.split('/')[2];
 const menu:ItemMenu=itemMenus.some(([id])=>id===key)?key as ItemMenu:'weapons';
 return <ItemBrowser key={menu} menu={menu}/>;
}
function ItemBrowser({menu}:{menu:ItemMenu}){
 const [query,setQuery]=useState(''),[family,setFamily]=useState('전체'),[effect,setEffect]=useState('전체');
 const input=useRef<HTMLInputElement>(null);
 const items=catalog.filter(i=>i.menu===menu);
 const families=Array.from(new Set(items.map(itemFamily)));
 const effects=Array.from(new Set(items.flatMap(itemEffects)));
 const showKinds=menu==='weapons'||menu==='armor'||menu==='treasures';
 const showEffects=menu==='accessories'||menu==='consumables'||menu==='treasures';
 const matchesQuery=(i:typeof items[number])=>`${i.name} ${i.description} ${i.effect}`.toLowerCase().includes(query.trim().toLowerCase());
 const shown=items.filter(i=>(family==='전체'||itemFamily(i)===family)&&(effect==='전체'||itemEffects(i).includes(effect))&&matchesQuery(i));
 function group(title:string,values:string[],selected:string,choose:(value:string)=>void,kind:boolean){
  return <fieldset className={s.filterGroup}><legend>{title}</legend>{['전체',...values].map(value=>{
   const count=items.filter(i=>matchesQuery(i)&&(kind?(effect==='전체'||itemEffects(i).includes(effect)):(family==='전체'||itemFamily(i)===family))&&(value==='전체'||(kind?itemFamily(i)===value:itemEffects(i).includes(value)))).length;
   return <button type="button" key={value} aria-pressed={selected===value} onClick={()=>choose(value)}><span>{value}</span><small>{count}</small></button>;
  })}</fieldset>;
 }
 return <section className={s.atlas} aria-label="아이템 목록">
  <div className={s.itemToolbar}>
   <nav className={s.itemTabs} aria-label="아이템 분류">{itemMenus.map(([id,title])=><Link key={id} href={`/items/${id}`} aria-current={menu===id?'page':undefined}>{title}</Link>)}</nav>
   <form className={s.itemSearch} role="search" onSubmit={e=>{e.preventDefault();input.current?.focus()}}>
    <input ref={input} aria-label="아이템 검색" placeholder="이름 또는 효과 검색" value={query} onChange={e=>setQuery(e.target.value)}/>
    {query&&<button type="button" aria-label="검색어 지우기" onClick={()=>{setQuery('');input.current?.focus()}}>×</button>}
    <button type="submit" aria-label="검색"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg></button>
   </form>
  </div>
  <div className={s.browseLayout}>
   <aside className={s.browseSidebar} aria-label="아이템 필터"><div className={s.filterPanel}>
    {showKinds&&group('장비 종류',families,family,setFamily,true)}
    {showEffects&&group(menu==='consumables'?'사용 효과':'장비 효과',effects,effect,setEffect,false)}
   </div></aside>
   <div className={s.catalogBody}>
<div className={s.grid}>{shown.map(i=><article className={`${s.card} ${i.menu==='treasures'?s.treasureCard:''}`} key={i.id}><div className={s.itemSummary}><div className={s.itemVisual}><div className={s.itemTop}><span>{i.menu==='treasures'?'보물':i.menu==='consumables'?'소모품':'일반'}</span><small>{i.family}</small></div><a className={s.itemImage} href={i.image} target="_blank" rel="noreferrer" aria-label={`${i.name} 이미지 크게 보기`}><img src={i.image} alt={i.name} width={96} height={96} loading="lazy"/></a></div><div className={s.itemCopy}><h3 className={s.itemName}>{i.name}</h3>{i.draft&&<small className={s.draft}>신규 보물 · 능력치 검토 중</small>}<p className={s.itemDescription}>{i.description}</p></div></div><div className={s.itemDetails}><dl className={s.itemStats}>{i.stats.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={s.itemEffect}><h4>효과</h4><p>{i.effect||'추가 효과 없음'}</p></div></div>{i.menu!=='consumables'&&<details className={s.itemWearers}><summary>착용 대상</summary><p>{i.jobs.length?i.jobs.join(' · '):i.draft?`${i.wearers.join(' · ')} 전용`:'병과별 착용 조건 확인 중'}</p>{!i.draft&&i.wearers.length>0&&<p>설화 동료 후보: {i.wearers.join(' · ')}</p>}</details>}<footer className={s.itemPrice}><span>구매 가격</span><b>{i.price===null?'비매품':`${i.price.toLocaleString()}금`}</b></footer></article>)}</div>{shown.length===0&&<div className={s.empty}><h3>찾는 아이템이 없습니다</h3><p>검색어 또는 종류를 변경해 주세요.</p></div>}<p className={s.source}>능력치는 장비의 기본값 기준입니다. 신규 고유 보물의 수치와 착용 대상은 검토 중입니다.</p></div></div></section>;
}
