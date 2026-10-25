"use client";
import {useState} from 'react';
import plan from '../data/campaign.json';
import styles from '../pages/world.module.css';
export function CampaignPlan(){
 const [route,setRoute]=useState('all');
 const common=plan.stages.filter(s=>s.route==='common').length;
 const routeCount=plan.stages.filter(s=>s.route==='A').length;
 return <section className={styles.section}>
  <div className={styles.heading}><div><span>CAMPAIGN · DESIGN v{plan.version}</span><h1>왕건의 길, 여섯 개의 장</h1></div><span className={styles.draft}>전체 설계 초안</span></div>
  <p>{plan.status}</p><p>{plan.summary}</p>
  <div className={styles.campaignStats}><strong>{plan.stages.length}<small>고유 전투안</small></strong><strong>{common+routeCount}<small>한 회차 전투안</small></strong><strong>2<small>후반 경로</small></strong><strong>936<small>공유하는 역사적 도달점</small></strong></div>
  <div className={styles.branchFlow}><div>1~4막 · C01–C20<br/><b>공통 성장과 공산의 패배</b></div><span>↓ 선택 직전 저장 · 직접 경로 선택</span><div className={styles.branchPaths}>{plan.routes.map(r=><article key={r.id}><span>{r.id}01–{r.id}08 · 8전투</span><h3>{r.name}</h3><p>{r.description}</p><small>{r.companion}</small></article>)}</div><span>↓ F01 합류</span><div>6막 · F01–F08<br/><b>귀부와 통일 · 경로별 후일담</b></div></div>
  <details className={styles.planNotes}><summary>조조전에서 참고하는 구조와 바꾸는 원칙</summary><ul>{plan.reference.map(t=><li key={t}>{t}</li>)}</ul></details>
  <h2>장별 흐름과 전투 목록</h2><p>각 전투를 펼치면 목표·패배조건·선택의 결과를 볼 수 있습니다. ‘역사 기반’도 지도·대사·임무 조건까지 사료로 확인했다는 뜻은 아닙니다.</p>
  <div className={styles.routeFilters} aria-label="경로별 전투 보기">{[['all','전체 설계'],['A','A 경로 한 회차'],['B','B 경로 한 회차']].map(([id,label])=><button key={id} aria-pressed={route===id} onClick={()=>setRoute(id)}>{label}</button>)}</div>
  {plan.acts.map(act=><section key={act.id} className={styles.campaignAct}><span>{act.id}막 · {act.period}</span><h2>{act.title}</h2><p>{act.summary}</p>{plan.stages.filter(s=>s.act===act.id&&(route==='all'||s.route==='common'||s.route===route)).map(s=><details key={s.id} className={styles.stage}><summary><b>{s.id}</b><strong>{s.title}</strong><small>{s.basis}</small></summary><dl><dt>전투 목표</dt><dd>{s.win}</dd><dt>필수 패배조건</dt><dd>{s.lose}</dd><dt>플레이 주제</dt><dd>{s.play}</dd><dt>이야기·선택 결과</dt><dd>{s.consequence}</dd></dl></details>)}</section>)}
  {[["분기와 실패 처리",plan.branchRules],["동료와 성장",plan.progression],["통일 이후의 결산",plan.endings],["다음에 함께 확정할 항목",plan.next]].map(([title,items])=><section className={styles.planNotes} key={String(title)}><h2>{title}</h2><ul>{(items as string[]).map(t=><li key={t}>{t}</li>)}</ul></section>)}
  <div className={styles.planNotes}><h2>역사적 기준 자료</h2>{plan.sources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></p>)}<p>창작 전투의 날짜·인물 참여·지형은 후속 고증 대상입니다. 신령·봉인·의식은 역사적 사실이 아닌 판타지 제안입니다.</p></div>
 </section>;
}
