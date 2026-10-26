import s from './playable.module.css';
import {HongLayerRig} from './HongLayerRig';
import {hongRanks} from '../model/hongRig';
import {defaultLoadout} from '../model/hongEquipment';
const notes=['상투·붉은 끈 / 가죽 복장','금속 머리띠 / 밝은 철색 찰갑','개방형 투구 / 흑색·금테 찰갑'];
export function HongPromotionComparison(){return <section className={s.promotion} aria-label="홍유 승급 외형 비교"><h3>승급 외형 · 모바일 스타일</h3><p>같은 짧은창 · 기본 말 / 5시 방향</p><div className={s.promotionGrid}>{hongRanks.map((r,i)=><figure key={r.id}><HongLayerRig compact loadout={defaultLoadout} dir="se" action={0} frame={0} rank={r.id}/><figcaption><strong>{r.name}</strong><small>{notes[i]}</small></figcaption></figure>)}</div><p>모든 승급에 같은 체형 기준을 적용합니다. 머리 보호구·복장으로 승급을 구분하며 무기·탈것은 선택 장비에 따라 바뀝니다.</p></section>}
