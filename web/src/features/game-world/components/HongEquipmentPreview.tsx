"use client";
import {useEffect,useState} from 'react';
import {HongLayerRig} from './HongLayerRig';
import {hongDirections,type Direction,type HongStance} from '../model/hongRig';
import {defaultLoadout,hongEquipment,resolveHongPreview,type Slot} from '../model/hongEquipment';
import s from './playable.module.css';
const slots:[Slot,string][]=[['weapon','무기'],['armor','갑옷'],['accessory','기마·보조']];
const dirs=hongDirections.map(d=>[d.dir,d.label]);
const actions=['대기','이동','공격','스킬'];
export function HongEquipmentPreview(){
 const [loadout,setLoadout]=useState(defaultLoadout),[dir,setDir]=useState<Direction>('se'),[action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false),[compareBase,setCompareBase]=useState(false);
 const [stance,setStance]=useState<HongStance>('mounted');
 const [audit,setAudit]=useState(false),[anchors,setAnchors]=useState(true);
 const preview=resolveHongPreview(loadout);
 const shownLoadout=compareBase?defaultLoadout:loadout;
 const visibleNames=hongEquipment.filter(i=>(i.slot==='weapon'&&i.id===shownLoadout.weapon)||(i.slot==='armor'&&i.id===shownLoadout.armor)).map(i=>i.name).join(' + ');
 useEffect(()=>{if(!playing)return;const t=setInterval(()=>setFrame(f=>(f+1)%4),action===0?320:190);return()=>clearInterval(t)},[playing,action]);
 return <section className={s.preview} aria-label="홍유 장비 조합 제작실">
  <div className={`${s.stage} ${s.equipmentStage}`}><HongLayerRig loadout={compareBase?defaultLoadout:loadout} dir={dir} action={action} frame={frame} stance={stance}/></div>
  <p className={s.caption} role="status">{compareBase?'기본 장비 비교 중':stance==='dismounted'?visibleNames+' · 하마':preview.displayed}<br/>분리 부품 조합 초안 · 동작은 관절 연출이며 완성된 프레임 애니메이션이 아닙니다.</p>
  <div className={s.controls} aria-label="탑승 상태"><button aria-pressed={stance==='mounted'} onClick={()=>{setStance('mounted');setAction(0);setFrame(0);setPlaying(false)}}>탑승</button><button aria-pressed={stance==='dismounted'} onClick={()=>{setStance('dismounted');setAction(0);setFrame(0);setPlaying(false)}}>하마 · 서 있기</button></div>
  {stance==='dismounted'&&<p className={s.caption}>시나리오용 4방향 서 있기 초안. 기본 옷 위에 선택한 갑옷을 입은 상하의 한 벌을 표시하며 말·마갑만 숨깁니다. 선택한 탈것은 다시 탑승하면 복원됩니다. 하마 이동·공격·스킬은 아직 제작 전입니다.</p>}
  <div className={s.controls}><button aria-pressed={!compareBase} onClick={()=>setCompareBase(false)}>선택 장비 보기</button><button aria-pressed={compareBase} onClick={()=>setCompareBase(true)}>기본 모습과 비교</button></div>
  <div className={s.loadout}>{slots.map(([slot,label])=><label key={slot}>{label}<select value={loadout[slot]} onChange={e=>{setLoadout(v=>({...v,[slot]:Number(e.target.value)}));setCompareBase(false)}}>{slot==='accessory'&&<option value={-1}>없음 · 기본 말</option>}{hongEquipment.filter(i=>i.slot===slot&&i.allowed).map(i=><option key={i.id} value={i.id}>{i.name} · {i.treasure?'보물':'일반'} · {i.status}</option>)}</select></label>)}</div>
  <button onClick={()=>{setLoadout(defaultLoadout);setCompareBase(false)}}>기본 장비로 초기화</button>
  <p className={s.caption}>무기·갑옷·보조 각 1개. 말·마갑은 보조 슬롯을 공유합니다. 방패·서책 등 상시 미표시 보조는 외형을 바꾸지 않습니다. 능력치 계산은 포함하지 않습니다.</p>
  <div className={s.controls}>{dirs.map(([d,n])=><button key={d} aria-pressed={dir===d} onClick={()=>{setDir(d as Direction);setFrame(0)}}>{n}</button>)}</div>
  <div className={s.controls}>{actions.map((n,a)=><button key={n} disabled={stance==='dismounted'&&a!==0} aria-pressed={action===a} onClick={()=>{setAction(a);setFrame(0)}}>{n}</button>)}</div>
  <div className={s.controls}><button onClick={()=>setPlaying(p=>!p)}>{playing?'정지':'재생'}</button><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button><small>{frame+1}/4</small></div>
  <button onClick={()=>{setAudit(true);setPlaying(false)}}>①–④ 방향·양팔 점검</button>
  {audit&&<div className={s.auditBackdrop}><section className={s.auditPanel} role="dialog" aria-modal="true" aria-label="홍유 방향·양팔 점검" onKeyDown={e=>{if(e.key==='Escape')setAudit(false)}}><header><h3>홍유 · 방향별 장비와 양팔</h3><button autoFocus onClick={()=>setAudit(false)}>점검 닫기</button></header><p>R = 캐릭터 오른팔·무기 손 / L = 왼팔. 화면의 좌우와 다릅니다. 선은 어깨와 손의 연결 기준입니다.</p><div className={s.controls}><button aria-pressed={anchors} onClick={()=>setAnchors(v=>!v)}>R/L 기준점 {anchors?'숨기기':'보기'}</button><button onClick={()=>{setStance(v=>v==='mounted'?'dismounted':'mounted');setAction(0);setFrame(0);setPlaying(false)}}>{stance==='mounted'?'하마로 비교':'탑승으로 비교'}</button>{actions.map((n,a)=><button key={n} disabled={stance==='dismounted'&&a!==0} aria-pressed={action===a} onClick={()=>{setAction(a);setFrame(0)}}>{n}</button>)}<button onClick={()=>setFrame(v=>(v+1)%4)}>다음 단계 {frame+1}/4</button></div><div className={s.loadout}>{slots.map(([slot,label])=><label key={slot}>{label}<select value={loadout[slot]} onChange={e=>{setLoadout(v=>({...v,[slot]:Number(e.target.value)}));setCompareBase(false)}}>{slot==='accessory'&&<option value={-1}>없음 · 기본 말</option>}{hongEquipment.filter(i=>i.slot===slot&&i.allowed).map(i=><option value={i.id} key={i.id}>{i.name}</option>)}</select></label>)}</div><div className={s.auditGrid}>{hongDirections.map(d=><figure key={d.dir}><figcaption>{d.label} · {stance==='mounted'?'탑승':'하마'}<br/>앞쪽 {d.rightNear?'오른팔':'왼팔'} / 뒤쪽 {d.rightNear?'왼팔':'오른팔'}</figcaption><HongLayerRig loadout={shownLoadout} dir={d.dir} action={action} frame={frame} stance={stance} debug={anchors}/></figure>)}</div><p>같은 장비와 같은 동작 단계를 네 방향에서 비교합니다. 하마는 대기만 지원합니다.</p></section></div>}
  <details className={s.production}><summary>전체 장비 제작표 · 창 6 / 갑옷 8 / 보조 34 검토</summary><p>아이콘 제작과 착용 모션 제작은 별개입니다. 보조구는 원본 허용표가 비어 있어 설명과 기획 규칙에 따른 후보·제외를 구분합니다.</p>{hongEquipment.map(i=><article key={i.id}><img src={i.image} width={32} height={32} alt="" loading="lazy"/><div><b>{i.originalName} → {i.name}</b><p>{i.treasure?'보물':'일반'} · {i.permission}</p><p>{i.status} · {i.visible?'착용 외형 필요':'상시 외형 없음'}</p><small>{i.description}</small><p>제작 레이어: {i.layer}</p></div></article>)}</details>
  <details className={s.production}><summary>이번 제작 범위 · 모션 초안 안내</summary><p>창 6종 × 갑옷 8종 × 탈것 외형 7종 = 336개 외형 조합을 네 방향에서 확인합니다. 얼굴·하체는 공통이며, 말갑은 기본 말에 착용한 두 외형으로 제작했습니다.</p><p>탑승 96개 부품에 하마용 갑옷 한 벌 32개와 옷소매 4개를 추가했습니다. 하마는 갑옷별 상의·자락·하의·신발이 함께 교체됩니다. 하마 상태는 서 있는 대기 모습만 지원하며 이동·공격·스킬은 후속 제작입니다. 대기·이동·공격·스킬은 공통 관절 이동·회전으로 장비 연결을 점검하는 초안입니다. 실제 게임용 보행·공격 프레임과 전투 판정은 별도 작업입니다.</p><p>고정된 몸체와 손 기준점에 무기·갑옷을 연결하며, 방향에 따라 앞뒤 가림 순서를 바꿉니다. 원본 능력치·옵션은 수정하지 않았습니다.</p></details>
 </section>;
}
