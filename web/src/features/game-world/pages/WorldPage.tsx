"use client";
import { useState } from "react";
import seed from "../data/world.json";
import styles from "./world.module.css";
const world = seed;
const statusName = (value: string) => value === "confirmed" ? "확정" : "초안";
export function WorldPage() {
 const [tab,setTab]=useState("world");

    return <div className={styles.app}>
 <header className={styles.sidebar}><a href="/" className={styles.brand}><span className={styles.seal}>山</span><span>산하의 맹약<small>THE OATH OF MOUNTAINS</small></span></a><nav aria-label="게임 소개">{[["world","세계관"],["story","이야기"],["characters","인물"],["history","개발 기록"]].map(([id,label])=><button key={id} aria-current={tab===id?"page":undefined} className={tab===id?styles.active:""} onClick={()=>{setTab(id);window.scrollTo({top:0,behavior:"smooth"})}}>{label}</button>)}</nav><span className={styles.headerNote}>후삼국 · 왕건 · 역사 판타지</span></header>
 <main className={styles.main}>
 {tab === "world" && <><section className={styles.hero}><div className={styles.heroArt} aria-hidden="true" /><div className={styles.heroCopy}><span className={styles.eyebrow}>KOREAN FANTASY · TACTICAL RPG</span><span className={styles.heroKicker}>신라 말의 혼란에서, 새로운 나라의 시작까지</span><h1>{world.title}</h1><h2>{world.subtitle}</h2><p>{world.premise}</p><a className={styles.heroLink} href="#world-foundation">세계관 살펴보기 <span>↓</span></a></div><div className={styles.heroBottom}><span>ORIGINAL WORLD <b>01</b></span><span>후삼국 역사 판타지 · 가칭 / 이미지는 고증 전 콘셉트</span></div></section>
 <section id="world-foundation" className={styles.section}><div className={styles.heading}><div><span>THE FOUNDATION</span><h2>확정한 세계의 뼈대</h2></div><p>확정한 방향과 아직 논의할 세부 설정을 구분합니다.</p></div><div className={styles.cards}>{world.sections.map(s => <article key={s.id} className={styles.card}><div className={styles.cardTop}><span>{s.label}</span><b className={s.status === "confirmed" ? styles.confirmed : styles.draft}>{statusName(s.status)}</b></div><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section>
 <section className={styles.section}><div className={styles.heading}><div><span>HISTORY & FICTION</span><h2>역사를 따라, 그 사이의 이야기를 쓰다</h2></div></div><p>가상 국가와 지역 지도 초안을 내려두고 실제 후삼국 시대를 기준으로 다시 구성합니다. 세력의 영역과 지명은 시기별로 검토한 뒤 소개합니다.</p><p>역사적 기준 자료: {world.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer" style={{color:"#c6ac77",marginRight:16}}>{source.title}</a>)}</p></section>
 <section className={styles.questions}><div><span>NEXT DECISIONS</span><h2>아직 쓰이지 않은 이야기</h2><p>확정하기 전, 서로 다른 방향을 비교합니다.</p></div><ol>{world.questions.map(q => <li key={q}>{q}<span>미정</span></li>)}</ol></section></>}
 {tab === "story" && <section className={styles.section}><div className={styles.heading}><div><span>NARRATIVE OUTLINE</span><h1>시작과 끝을 잇는 길</h1></div><span className={styles.draft}>역사적 기준 · 시작점 미정</span></div><p>건국과 통일의 큰 흐름을 기준으로 삼되, 첫 장면과 세부 시나리오는 함께 정합니다.</p><div className={styles.timeline}>{world.chapters.map((c, i) => <article key={c.label}><span>{String(i + 1).padStart(2, "0")} / {c.label}</span><h2>{c.title}</h2><p>{c.body}</p></article>)}</div><div className={styles.questions}><div><h2>다음 논의 · 이야기의 시작점</h2></div><p>추천 후보는 궁예 휘하에서 첫 임무를 맡는 젊은 왕건입니다. 작은 부대부터 전술을 익히고 동료를 만날 수 있습니다. 아직 확정된 첫 전투나 역사적 사건의 묘사는 아닙니다.</p></div></section>}
 {tab === "characters" && <section className={styles.section}><div className={styles.heading}><div><span>CHARACTERS</span><h1>이 시대를 걸어갈 사람들</h1></div><span>주인공 확정 · 동료 미정</span></div>{world.characters.map(c=><article className={styles.card} key={c.name}><span className={styles.confirmed}>{c.role}</span><h3>{c.name}</h3><p>{c.description}</p></article>)}<p>기존 메인 이미지의 인물은 분위기를 위한 콘셉트이며 왕건의 확정 외형이 아닙니다.</p></section>}
 {tab === "history" && <section className={styles.section}><div className={styles.heading}><div><span>DECISION LOG</span><h1>무엇을, 왜 바꿨는가</h1></div></div><p>논의하며 결정한 내용과 변경 이유를 기록합니다.</p><div className={styles.history}>{world.history.map(h => <article key={h.id}><time>{h.date}</time><div><h3>{h.title}</h3><p>{h.reason}</p><details><summary>변경 내용 보기</summary><pre>{h.changes}</pre></details></div></article>)}</div></section>}
 <footer className={styles.bottom}>산하의 맹약 · 개발 중인 프로젝트 <span>시대·주인공·기본 방향 확정 / 제목·세부 설정·이미지는 초안</span></footer></main>
 </div>;
}
