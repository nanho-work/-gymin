"use client";
import {ClassMotionGallery} from './ClassMotionGallery';
import {PromotionModelGallery} from './PromotionModelGallery';
import {useState} from 'react';
import data from '../data/job-models.json';
import s from './job-models.module.css';
export function JobModelGallery(){
 const [group,setGroup]=useState('모션 비교');
 const rows=data.records.filter(x=>group==='전체'||x.group===group);
 return <section className={s.section} aria-labelledby="job-model-title"><h2 id="job-model-title">병과별 플레이 모델</h2><p>왕건은 주인공 전용이며 병과 공통 모델과 설화 동료 전용 모델을 구분해 비교합니다. 머리·몸·팔이 연결된 완성 정지 그림으로 비교합니다. 승급 비교에서 기본·중간·최종 외형을 확인할 수 있습니다. 모션 비교에서 경기병·경보병·궁병·책사의 기본 단계 동작을 확인할 수 있습니다.</p><div className={s.controls} role="group" aria-label="모델 유형">{['모션 비교','승급 비교','기본 병과','특수 유형','설화 동료','전체'].map(g=><button key={g} aria-pressed={group===g} onClick={()=>setGroup(g)}>{g} ({g==='모션 비교'?4:g==='승급 비교'?13:data.records.filter(x=>g==='전체'||x.group===g).length})</button>)}</div>{group==='모션 비교'?<ClassMotionGallery/>:group==='승급 비교'?<PromotionModelGallery/>:<div className={s.grid}>{rows.map(x=><figure key={x.id}><a href={x.image} target="_blank" rel="noreferrer" aria-label={`${x.name} 모델 크게 보기`}><img src={x.image} width={160} height={160} alt={`${x.name} 5시 방향 완성 정지 모델`} loading="lazy"/></a><figcaption><strong>{x.name}</strong><small>{x.note}</small></figcaption></figure>)}</div>}<p className={s.note}>현재 원본 병과명을 비교용으로 유지했습니다. 한국풍 복식은 게임용 창작이며 실제 역사 복식의 복원은 아닙니다. 맹호대→쿵돌, 곰부대→쇠동, 나무인형→길목, 흙인형→사금 외형을 연결했습니다. 설화 동료의 기존 역할 설정과 원본 병과 기능은 별개이며, 수치·장착 규칙은 유지합니다. 기존 인물·능력치·장착 규칙은 변경하지 않았습니다.</p></section>;
}
