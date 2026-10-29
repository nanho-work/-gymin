import s from "./monarch-comparison.module.css";
const kings = [
 {id:"wang-geon",name:"왕건",details:["남색 관복 · 검은 관모","금테 관모 · 정돈한 예복","왕관 · 남색 왕의 망토"]},
 {id:"gung-ye",name:"궁예",details:["먹빛 승복 · 가사","넓은 가사 · 염주 · 의장 마구","의례관 · 겹가사 · 연꽃 마갑"]},
 {id:"gyeon-hwon",name:"견훤",details:["낮은 관 · 붉은 무장 복식","관형 투구 · 어깨 갑옷","붉은 술 투구 · 망토 · 중갑"]},
];
export function MonarchComparison(){return <section className={s.panel} aria-label="세 군주 승급 외형 비교"><div className={s.heading}><strong>세 군주 승급 외형 비교</strong><span>5시 방향 · 정지 초안</span></div>{kings.map(k=><section key={k.id} className={s.king} aria-label={`${k.name} 승급 비교`}><h3>{k.name}</h3><div className={s.grid}>{['기본 · 군웅','중간 · 영웅','최종 · 패왕'].map((rank,i)=><figure key={rank}><img src={i===0?`/images/playable/monarch-comparison-v1/${k.id}.webp`:`/images/playable/monarch-promotion-v1/${k.id}-${i}.webp`} width={160} height={160} alt={`${k.name} ${rank} 5시 방향 탑승 모습`}/><figcaption><strong>{rank}</strong><span>{k.details[i]}</span></figcaption></figure>)}</div></section>)}<p>승급에 따라 복식·대표 무기·마구가 함께 바뀌는 창작 비교안입니다. 각 인물 카드에서 승급별 전용 모션을 확인할 수 있으며 능력치는 유지합니다. 복식은 역사적 재현 확정안이 아닙니다.</p></section>}
