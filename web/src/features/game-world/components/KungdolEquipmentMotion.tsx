"use client";
import {useEffect,useState} from 'react';
import s from './mongdang-mobile.module.css';
const directions=[['nw','11시'],['ne','2시'],['se','5시'],['sw','7시']];
const actions=['대기','이동','공격','스킬'];
export function KungdolEquipmentMotion(){
 const [item,setItem]=useState('pestle'),[action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 const [direction,setDirection]=useState('se');
 const [size,setSize]=useState(128),[terrain,setTerrain]=useState('grass');
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setFrame(f=>(f+1)%4),action===0?320:220);return()=>clearInterval(timer)},[playing,action]);
 const name=item==='pestle'?'기본 절굿공이':'나무몽둥이';
 return <section id="kungdol-motion" className={s.study} aria-label="쿵돌 장비 모션 비교"><h3>쿵돌 · 윤곽 스타일과 장비 비교</h3><p>4방향 정지·재생 시안 · 장비를 바꿔도 동작과 현재 프레임을 유지합니다.</p><div className={s.controls} role="group" aria-label="쿵돌 방향">{directions.map(([id,label])=><button key={id} aria-pressed={direction===id} onClick={()=>setDirection(id)}>{label}</button>)}</div><div className={s.controls} role="group" aria-label="쿵돌 모션 아이템">{[['pestle','기본 절굿공이'],['club','나무몽둥이']].map(([id,label])=><button key={id} aria-pressed={item===id} onClick={()=>setItem(id)}>{label}</button>)}</div><div className={s.controls} role="group" aria-label="쿵돌 시안 동작">{actions.map((a,i)=><button key={a} aria-pressed={action===i} onClick={()=>{setAction(i);setFrame(0)}}>{a}</button>)}<button onClick={()=>setPlaying(p=>!p)}>{playing?'정지':'재생'}</button><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button></div><div className={s.controls}><label>쿵돌 표시 크기 <select value={size} onChange={e=>setSize(Number(e.target.value))}><option value={96}>96px</option><option value={128}>128px</option><option value={160}>160px</option></select></label><label>쿵돌 배경 <select value={terrain} onChange={e=>setTerrain(e.target.value)}><option value="grass">풀밭</option><option value="earth">흙길</option><option value="night">어두운 땅</option></select></label></div><div className={`${s.terrain} ${s[terrain]}`} style={{minHeight:size+24}}><img src={`/images/folklore/kungdol-equipment-v1/${item}-${direction}-${action}-${frame}.webp`} width={size} height={size} alt={`쿵돌 ${name} ${directions.find(d=>d[0]===direction)?.[1]} ${actions[action]} ${frame+1}프레임`}/></div><p>{name} · {directions.find(d=>d[0]===direction)?.[1]} · {actions[action]} · 프레임 {frame+1}/4</p><small>160px 개별 프레임 · 발 접지 기준선 정렬. 4방향 모션 초안입니다. 생성 프레임의 세부 형태와 연결은 추가 다듬기 대상이며 실제 게임 장비 규칙에는 아직 적용하지 않았습니다. 위 전신 일러스트 선택과는 독립적으로 비교합니다.</small></section>
}
