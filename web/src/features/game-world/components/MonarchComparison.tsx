import s from "./monarch-comparison.module.css";
const kings = [
 {id:"wang-geon",name:"왕건",detail:"남색 관복 · 검은 관모",role:"절제된 군주의 위엄"},
 {id:"gung-ye",name:"궁예",detail:"먹빛 승복 · 황토색 가사",role:"염주와 삭발의 종교적 권위"},
 {id:"gyeon-hwon",name:"견훤",detail:"붉은 천 · 넓은 어깨 갑옷",role:"수염과 낮은 관의 무장 군주"},
];
export function MonarchComparison(){return <section className={s.panel} aria-label="세 군주 외형 비교"><div className={s.heading}><strong>세 군주 외형 비교</strong><span>기본 승급 · 5시 · 정지</span></div><div className={s.grid}>{kings.map(k=><figure key={k.id}><img src={`/images/playable/monarch-comparison-v1/${k.id}.webp`} width={160} height={160} alt={`${k.name} 기본 승급 5시 방향 탑승 모습`}/><figcaption><strong>{k.name}</strong><span>{k.detail}</span><small>{k.role}</small></figcaption></figure>)}</div><p>동일한 기본 말·짧은 검으로 복식과 실루엣을 비교하는 창작 초안입니다. 기존 전투 모션은 유지하며, 복식은 역사적 재현 확정안이 아닙니다.</p></section>}
