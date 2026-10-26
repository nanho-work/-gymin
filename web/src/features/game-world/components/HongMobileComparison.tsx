"use client";
import {useState} from 'react';
import {HongLayerRig} from './HongLayerRig';
import {defaultLoadout} from '../model/hongEquipment';
import s from './hong-mobile.module.css';
const backgrounds=[['grass','풀밭'],['earth','흙길'],['dark','어두운 땅']] as const;
export function HongMobileComparison(){
 const [size,setSize]=useState(96);
 const [background,setBackground]=useState('grass');
 return <section className={s.comparison} aria-label="홍유 모바일 가독성 비교">
  <h3>모바일 스타일 · 변경 전후</h3>
  <p>중기병 · 5시 · 짧은창 · 기본 말 · 현재 적용 · 대기 1단계</p>
  <div className={s.controls} role="group" aria-label="모바일 비교 표시 크기">{[64,80,96].map(n=><button key={n} aria-pressed={size===n} onClick={()=>setSize(n)}>{n}px</button>)}</div>
  <div className={s.controls} role="group" aria-label="모바일 비교 배경">{backgrounds.map(([id,label])=><button key={id} aria-pressed={background===id} onClick={()=>setBackground(id)}>{label}</button>)}</div>
  <div className={s.grid}>{['변경 전','현재 · 모바일 스타일'].map((label,i)=><figure key={label}>
   <div className={`${s.stage} ${s[background]}`}><div className={s.sprite} style={{width:size,height:size}}><HongLayerRig compact loadout={defaultLoadout} dir="se" action={0} frame={0} stance="mounted" rank="heavy" style={i===0?'legacy':'mobile'}/></div></div>
   <figcaption>{label}</figcaption>
  </figure>)}</div>
  <p className={s.note}>표시 크기는 투명 여백을 포함합니다. 같은 장비·중기병·5시 방향으로 변경 전후를 비교합니다. 위 미리보기에는 모바일 스타일이 적용됩니다.</p>
 </section>;
}
