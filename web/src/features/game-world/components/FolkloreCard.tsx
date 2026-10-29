import plan from '../data/folklore-plan.json';
import s from './characters.module.css';
type Companion=typeof plan.companions[number];
export function FolkloreCard({companion:c}:{companion:Companion}){return <article className={s.card}>
 <div className={s.meta}><span>설화 동료</span><span>{c.status}</span></div>
 <div className={s.cleanIdentity}><div><strong>{c.family}</strong><img src={c.portrait} width={80} height={100} loading="lazy" alt={`${c.name} 초상화`}/></div><div className={s.cleanNames}><h3>{c.name}</h3></div><figure><a href={c.staticModel} target="_blank" rel="noreferrer" aria-label={`${c.name} 모습 확대`}><img src={c.staticModel} width={128} height={128} loading="lazy" alt={`${c.name} 5시 방향 모습`}/></a><figcaption>5시 방향 · 정지 모습</figcaption></figure></div>
 <div className={s.tags}><span>설화 존재</span><span>{c.family}</span></div><p>{c.role}</p>
 <details><summary>기원 · 전승과 창작</summary><h4>기원</h4><p>{c.origin}</p><h4>자료에서 확인한 전승</h4><p>{c.basis}</p><h4>게임용 창작 · 시대 주의</h4><p>이름·성격·외형·합류 사건·능력은 게임용 창작입니다.</p><p>{c.caution}</p><a href={c.source} target="_blank" rel="noreferrer">전승 근거 ↗</a></details>
 <details><summary>동료 이야기 · 성격</summary><p>{c.personality}</p><p>{c.join}</p><p>{c.appearance}</p><ol>{c.story.map(x=><li key={x}>{x}</li>)}</ol><p>{c.learn}</p></details>
 <details><summary>전투 역할 · 외형</summary><p>{c.play}</p><p>기획 단계의 전투 역할입니다. 확정되지 않은 능력치는 표시하지 않습니다.</p><a href={c.image} target="_blank" rel="noreferrer">전신 콘셉트 보기 ↗</a></details>
 </article>}
