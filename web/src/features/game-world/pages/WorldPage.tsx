"use client";
import { useEffect, useState } from "react";
import seed from "../data/world.json";
import styles from "./world.module.css";
type World = typeof seed;
const storageKey = "gymin-game-world-v1";
const statusName = (value: string) => value === "confirmed" ? "확정" : "초안";
export function WorldPage() {
    const [world, setWorld] = useState<World>(seed), [tab, setTab] = useState("world"), [region, setRegion] = useState("capital"), [editing, setEditing] = useState<string | null>(null), [notice, setNotice] = useState("");
    useEffect(() => { try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            const data = JSON.parse(raw);
            if (data.version === 1 && Array.isArray(data.sections) && data.sections.length === 4 && data.sections.every((s: World["sections"][number], i: number) => s.id === seed.sections[i].id && typeof s.body === "string" && typeof s.title === "string" && ["draft", "confirmed"].includes(s.status)) && Array.isArray(data.history) && data.history.every((h: World["history"][number]) => typeof h.id === "string" && typeof h.date === "string" && typeof h.title === "string" && typeof h.reason === "string" && typeof h.changes === "string")) {
                setWorld({ ...seed, sections: data.sections, history: data.history });
                setNotice("이 브라우저에 저장한 변경 내용을 불러왔습니다.");
            }
            else
                setNotice("저장 형식이 달라 원본 초안을 표시합니다. 기존 브라우저 기록은 유지했습니다.");
        }
    }
    catch {
        setNotice("브라우저 기록을 읽지 못했습니다. 원본 초안을 표시합니다.");
    } }, []);
    const selected = world.regions.find(r => r.id === region)!;
    const current = world.sections.find(s => s.id === editing);
    function exportWorld() { const blob = new Blob([JSON.stringify(world, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "sanha-world-v1.json"; link.click(); URL.revokeObjectURL(url); setNotice("세계관과 변경 이력을 JSON으로 내보냈습니다."); }
    function save(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!current)
            return;
        const form = new FormData(event.currentTarget);
        const title = String(form.get("title") ?? "").trim(), body = String(form.get("body") ?? "").trim(), reason = String(form.get("reason") ?? "").trim(), status = String(form.get("status"));
        if (!title || !body || !reason)
            return;
        const next = { ...world, sections: world.sections.map(s => s.id === editing ? { ...s, title, body, status } : s), history: [{ id: crypto.randomUUID(), date: new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }), title: `${current.title} 수정`, reason, changes: `이전 [${statusName(current.status)}] ${current.title}\n${current.body}\n\n변경 [${statusName(status)}] ${title}\n${body}` }, ...world.history] };
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
            setWorld(next);
            setEditing(null);
            setNotice("이 브라우저에 저장했습니다. 프로젝트 파일에 반영하려면 JSON을 내보내 주세요.");
        }
        catch {
            setNotice("저장 공간 또는 브라우저 권한 문제로 저장하지 못했습니다. 편집 내용은 창에 남아 있습니다.");
        }
    }
    return <div className={styles.app}>
 <aside className={styles.sidebar}><a href="/" className={styles.brand}><span className={styles.seal}>山</span><span>산하의 맹약<small>GAME WORLD ARCHIVE</small></span></a><div className={styles.projectLabel}>PROJECT / 001 <span>기획 중</span></div><nav aria-label="기획 영역">{[["world", "01", "세계관"], ["story", "02", "이야기 흐름"], ["characters", "03", "인물 도감"], ["history", "04", "변경 기록"]].map(([id, n, label]) => <button key={id} aria-current={tab === id ? "page" : undefined} className={tab === id ? styles.active : ""} onClick={() => setTab(id)}><span>{n}</span>{label}{id === "history" && <b>{world.history.length}</b>}</button>)}</nav><div className={styles.sideNote}><span>현재 작업</span><strong>세계의 첫 장을 여는 중</strong><p>설정은 작게 시작하고,<br />결정의 이유를 함께 남깁니다.</p><div className={styles.progress}><i /></div><small>세계관 초안 → 인물 → 첫 전투</small></div><footer>GYMIN → GAME PROJECT<br /><span>이름·지명은 모두 작업용 가칭</span></footer></aside>
 <main className={styles.main}><header className={styles.top}><div>기획 기록실 <span>/</span> {tab === "world" ? "세계관" : tab === "story" ? "이야기 흐름" : tab === "characters" ? "인물 도감" : "변경 기록"}</div><button onClick={exportWorld}>↓ 기록 내보내기</button></header>
 <div className={styles.storage}>● 프로젝트에 초안 저장됨 <span>화면에서 수정한 내용은 이 브라우저에 저장됩니다. 서버 공유 저장은 아직 연결하지 않았습니다.</span></div>
 {notice && <div role="status" className={styles.notice}>{notice}<button aria-label="안내 닫기" onClick={() => setNotice("")}>×</button></div>}
 {tab === "world" && <><section className={styles.hero}><div className={styles.heroArt} aria-hidden="true"><svg viewBox="0 0 900 420" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="mist" x2="0" y2="1"><stop stopColor="#708c87"/><stop offset="1" stopColor="#233b39"/></linearGradient></defs><circle cx="680" cy="100" r="60" fill="#c6ad79" opacity=".7"/><path d="M200 420L470 100 560 200 630 140 900 390V420Z" fill="url(#mist)"/><path d="M320 420L540 210 590 270 730 100 900 300V420Z" fill="#385653"/><path d="M440 420L640 250 710 330 800 240 960 400Z" fill="#1b3332"/><path d="M400 420L580 290 660 350 720 320 900 410" fill="none" stroke="#abbdab" opacity=".3"/><path d="M688 200h70l-35-14zM699 204h47v25h-47z" fill="#112623"/><path d="M687 232h72" stroke="#bea36a" strokeWidth="2"/><path d="M550 349Q700 320 920 360M500 373Q710 350 920 395" stroke="#c7d5c4" strokeWidth="12" opacity=".07" fill="none"/></svg></div><div className={styles.heroCopy}><span className={styles.eyebrow}>KOREAN FANTASY · TACTICAL RPG</span><h1>{world.title}</h1><h2>{world.subtitle}</h2><p>{world.premise}</p><div className={styles.tags}><span>한국풍 가상 세계</span><span>인간과 신령</span><span>선택과 책임</span></div></div><div className={styles.heroBottom}><span>WORLD BIBLE <b>v0.1</b></span><span>제안 초안 · 아직 확정된 설정이 아닙니다</span></div></section>
 <section className={styles.section}><div className={styles.heading}><div><span>THE FOUNDATION</span><h2>이 세계를 지탱하는 네 가지</h2></div><p>각 카드를 수정하며 설정을 구체화하세요.</p></div><div className={styles.cards}>{world.sections.map(s => <article key={s.id} className={styles.card}><div className={styles.cardTop}><span>{s.label}</span><b className={s.status === "confirmed" ? styles.confirmed : styles.draft}>{statusName(s.status)}</b></div><h3>{s.title}</h3><p>{s.body}</p><button onClick={() => setEditing(s.id)}>설정 수정 <span>↗</span></button></article>)}</div></section>
 <section className={styles.section}><div className={styles.heading}><div><span>LANDS & FACTIONS</span><h2>하나의 땅, 서로 다른 명분</h2></div><p>지역을 누르면 세력과 갈등을 볼 수 있습니다.</p></div><div className={styles.mapGrid}><div className={styles.map}><span className={styles.mapCaption}>해온 · 관계를 위한 개념 지도 <small>실제 전투 지도 아님</small></span><svg viewBox="0 0 600 400" aria-hidden="true"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#738b7f" opacity=".1"/></pattern></defs><rect width="600" height="400" fill="url(#grid)"/><path d="M280 35L360 60 390 100 443 121 440 180 490 226 453 306 380 350 324 320 265 358 210 303 142 271 125 215 183 172 205 91Z" fill="#e4dfcc" stroke="#a6b2a2" strokeWidth="2"/><path d="M299 74Q340 130 290 180T320 310M300 180Q215 210 175 259" stroke="#88a9ad" strokeWidth="5" fill="none"/><path d="M230 125l30-40 25 35m40 3 30-43 22 40M350 249l28-38 30 40" fill="none" stroke="#9ca790" strokeWidth="3"/><path d="M174 243L354 183 435 290M354 183L294 76" stroke="#b19b73" strokeDasharray="4 6" fill="none"/></svg>{world.regions.map(r => <button key={r.id} style={{ left: `${r.x}%`, top: `${r.y}%` }} aria-pressed={region === r.id} onClick={() => setRegion(r.id)} className={region === r.id ? styles.mapSelected : ""}><i />{r.name}</button>)}<span className={styles.compass}>北<br />↑</span></div><article className={styles.region}><span className={styles.eyebrow}>REGION / {String(world.regions.indexOf(selected) + 1).padStart(2, "0")}</span><h3>{selected.name}</h3><span className={styles.faction} style={{ borderColor: selected.color }}>{selected.faction} · 초안</span><p>{selected.description}</p><dl><dt>전투로 연결하면</dt><dd>{selected.battle}</dd><dt>이 지역이 던지는 질문</dt><dd>{selected.tension}</dd></dl></article></div></section>
 <section className={styles.questions}><div><span>NEXT DECISIONS</span><h2>다음에 함께 결정할 것</h2><p>확정하기 전, 서로 다른 방향을 비교합니다.</p></div><ol>{world.questions.map(q => <li key={q}>{q}<span>미정</span></li>)}</ol></section></>}
 {tab === "story" && <section className={styles.section}><div className={styles.heading}><div><span>NARRATIVE OUTLINE</span><h1>시작과 끝을 잇는 길</h1></div><span className={styles.draft}>이야기 구조 제안</span></div><p>세부 스테이지를 정하기 전에, 주인공의 목표가 어떻게 달라지는지 잡습니다.</p><div className={styles.timeline}>{world.chapters.map((c, i) => <article key={c.label}><span>{String(i + 1).padStart(2, "0")} / {c.label}</span><h2>{c.title}</h2><p>{c.body}</p></article>)}</div><div className={styles.questions}><div><h2>첫 전투에서 검증할 것</h2></div><p>주민을 호위하면서 마지막 성문을 지킨다. 신령의 힘을 빌려 모두를 구할지, 약속을 지키고 다른 퇴로를 찾을지 선택한다. 구체적인 보상과 피해는 아직 설계하지 않았습니다.</p></div></section>}
 {tab === "characters" && <section className={styles.section}><div className={styles.heading}><div><span>CHARACTER ATLAS</span><h1>인물은, 세계가 정해진 다음에</h1></div><span>등록된 캐릭터 0명</span></div><div className={styles.empty}><span>人</span><h2>첫 동료를 위한 자리를 마련했습니다.</h2><p>세계관 방향을 정한 뒤 인물의 이미지, 성격, 소속, 병과와 고유 스킬을 함께 기록합니다.<br />현재는 확정된 캐릭터나 제작된 이미지가 없습니다.</p><div className={styles.tags}><span>초상화</span><span>인물 관계</span><span>전투 역할</span><span>변경 전 / 후</span></div><button onClick={() => setTab("world")}>세계관부터 정하기 →</button></div></section>}
 {tab === "history" && <section className={styles.section}><div className={styles.heading}><div><span>DECISION LOG</span><h1>무엇을, 왜 바꿨는가</h1></div><button onClick={exportWorld}>기록 내보내기 ↓</button></div><p>초안 작성과 카드 수정이 쌓입니다. 화면 편집 이력은 현재 브라우저에 보관됩니다.</p><div className={styles.history}>{world.history.map(h => <article key={h.id}><time>{h.date}</time><div><h3>{h.title}</h3><p>{h.reason}</p><details><summary>변경 내용 보기</summary><pre>{h.changes}</pre></details></div></article>)}</div></section>}
 <footer className={styles.bottom}>산하의 맹약 · 작업명 <span>초안과 결정을 구분하며 함께 만드는 게임.</span></footer></main>
 {current && <div className={styles.scrim} onClick={() => setEditing(null)}><section className={styles.editor} onKeyDown={e => { if (e.key === "Escape")
        setEditing(null); if (e.key === "Tab") {
        const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button,input,textarea,select"));
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    } }} role="dialog" aria-modal="true" aria-labelledby="editor-title" onClick={e => e.stopPropagation()}><form onSubmit={save}><div className={styles.heading}><h2 id="editor-title">세계관 설정 수정</h2><button type="button" aria-label="편집 닫기" onClick={() => setEditing(null)}>×</button></div><label>제목<input autoFocus name="title" defaultValue={current.title} required maxLength={100}/></label><label>설정 내용<textarea name="body" defaultValue={current.body} required rows={6} maxLength={5000}/></label><label>상태<select name="status" defaultValue={current.status}><option value="draft">초안 · 논의 중</option><option value="confirmed">확정 · 내가 결정한 설정</option></select></label><label>왜 변경하나요?<textarea name="reason" placeholder="변경한 이유를 짧게 남겨 주세요." required rows={2} maxLength={1000}/></label><p>이전 내용과 변경 이유를 함께 기록합니다. 현재 브라우저에 저장됩니다.</p><div className={styles.editorActions}><button type="button" onClick={() => setEditing(null)}>취소</button><button type="submit">변경 기록하고 저장</button></div></form></section></div>}
 </div>;
}
