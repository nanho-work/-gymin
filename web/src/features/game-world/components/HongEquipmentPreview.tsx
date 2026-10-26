"use client";
import {useEffect,useState} from 'react';
import {cavalryWalkFrameMs,cavalryMountPose} from '../model/cavalryMount';
import {HongPromotionComparison} from './HongPromotionComparison';
import {HongMobileComparison} from './HongMobileComparison';
import {HongLayerRig} from './HongLayerRig';
import {hongDirections,hongRanks,type HongRank,type Direction,type HongStance} from '../model/hongRig';
import {defaultLoadout,hongEquipment,resolveHongPreview,type Slot} from '../model/hongEquipment';
import s from './playable.module.css';
import characters from '../data/playable-characters.json';
const hong=characters.records.find(c=>c.id==='hong-yu')!;
const slots:[Slot,string][]=[['weapon','무기'],['armor','갑옷 · 외형 고정'],['accessory','기마·보조']];
const dirs=hongDirections.map(d=>[d.dir,d.label]);
const actions=['대기','이동','공격','스킬'];
const wearableEquipment=hongEquipment.filter(i=>i.allowed);
export function HongEquipmentPreview(){
 const [loadout,setLoadout]=useState(defaultLoadout),[dir,setDir]=useState<Direction>('se'),[action,setAction]=useState(0),[frame,setFrame]=useState(0),[playing,setPlaying]=useState(false),[compareBase,setCompareBase]=useState(false);
 const [rank,setRank]=useState<HongRank>('light');
 const [stance,setStance]=useState<HongStance>('mounted');
 const [audit,setAudit]=useState(false),[anchors,setAnchors]=useState(true);
 const preview=resolveHongPreview(loadout);
 const shownLoadout=compareBase?defaultLoadout:loadout;
 const visualLoadout={...shownLoadout,armor:defaultLoadout.armor};
 const visibleNames=hongEquipment.filter(i=>(i.slot==='weapon'&&i.id===shownLoadout.weapon)||(i.slot==='armor'&&i.id===shownLoadout.armor)).map(i=>i.name).join(' + ');
 useEffect(()=>{for(const direction of ['se','nw'] as const)for(let frame=0;frame<4;frame++){const image=new Image();image.src=cavalryMountPose(shownLoadout.accessory,direction,true,frame).src;}},[shownLoadout.accessory]);
 useEffect(()=>{if(!playing)return;const t=setInterval(()=>setFrame(f=>(f+1)%4),action===0?320:cavalryWalkFrameMs);return()=>clearInterval(t)},[playing,action]);
 return <section className={`${s.preview} ${s.hongPreview}`} aria-label="홍유 장비 조합 제작실">
  <div className={s.hongTop}><div className={s.hongPortrait}><strong>{hongRanks.find(r=>r.id===rank)!.name}</strong><img src={hong.portrait} width={80} height={100} alt="홍유 초상화"/></div><div className={s.hongNames}><strong>하후돈</strong><span aria-hidden="true">↓</span><strong>홍유</strong></div><div className={`${s.stage} ${s.equipmentStage}`}><HongLayerRig compact loadout={visualLoadout} dir={dir} action={action} frame={frame} stance={stance} rank={rank}/></div>
</div>
  <div className={s.hongQuickControls} aria-label="홍유 탑승 상태·방향·재생">
   <div role="group" aria-label="탑승 상태"><button aria-pressed={stance==='mounted'} onClick={()=>{setStance('mounted');setAction(0);setFrame(0);setPlaying(false)}}>탑승</button><button aria-label="일반 · 하마 상태" aria-pressed={stance==='dismounted'} onClick={()=>{setStance('dismounted');setAction(0);setFrame(0);setPlaying(false)}}>일반</button></div>
   <div role="group" aria-label="방향">{dirs.map(([d,n])=><button key={d} aria-label={n} aria-pressed={dir===d} onClick={()=>{setDir(d as Direction);setFrame(0)}}>{d==='nw'?'11시':d==='ne'?'2시':d==='se'?'5시':'7시'}</button>)}</div>
   <div role="group" aria-label="재생 제어"><button onClick={()=>setPlaying(p=>!p)}>{playing?'정지':'재생'}</button></div>
  </div>
  <div className={s.controls}>{actions.map((n,a)=><button key={n} aria-pressed={action===a} onClick={()=>{setAction(a);setFrame(0)}}>{n}</button>)}</div>
  <div className={s.controls} role="group" aria-label="승급 외형">{hongRanks.map(r=><button key={r.id} aria-pressed={rank===r.id} onClick={()=>{setRank(r.id);setFrame(0)}}>{r.name}</button>)}</div>
  <details><summary>모바일 스타일 · 변경 전후 비교</summary><HongMobileComparison/></details>
  <details><summary>승급 디자인 비교</summary><HongPromotionComparison/></details>
  <p className={s.caption} role="status">{compareBase?'기본 장비 비교 중':stance==='dismounted'?visibleNames+' · 하마':preview.displayed}<br/>모바일 스타일 적용 · 탑승 이동: 말 보행 4프레임과 기수 동기화. 공격·스킬은 관절 조합 미리보기입니다.</p>

  {stance==='dismounted'&&<p className={s.caption}>하마 상태에서도 선택한 승급 복장과 무기를 유지합니다. 말·마갑만 숨기며 다시 탑승하면 복원됩니다.</p>}
  <div className={s.controls}><button aria-pressed={!compareBase} onClick={()=>setCompareBase(false)}>선택 장비 보기</button><button aria-pressed={compareBase} onClick={()=>setCompareBase(true)}>기본 모습과 비교</button></div>
  <div className={s.loadout}>{slots.map(([slot,label])=><label key={slot}>{label}<select value={loadout[slot]} onChange={e=>{setLoadout(v=>({...v,[slot]:Number(e.target.value)}));setCompareBase(false)}}>{slot==='accessory'&&<option value={-1}>없음 · 기본 말</option>}{wearableEquipment.filter(i=>i.slot===slot).map(i=><option key={i.id} value={i.id}>{i.name} · {i.treasure?'보물':'일반'} · {i.status}</option>)}</select></label>)}</div>
  <button onClick={()=>{setLoadout(defaultLoadout);setCompareBase(false)}}>기본 장비로 초기화</button>
  <p className={s.caption}>승급에 따라 머리·몸통·팔의 복장이 바뀝니다. 갑옷 아이템은 능력치용이며 승급 외형을 덮어쓰지 않습니다. 무기·갑옷·보조 각 1개. 말·마갑은 보조 슬롯을 공유합니다. 방패·서책 등 상시 미표시 보조는 외형을 바꾸지 않습니다. 능력치 계산은 포함하지 않습니다.</p>
  <div className={s.controls}><button onClick={()=>{setPlaying(false);setFrame(f=>(f+1)%4)}}>다음 프레임</button><small>{frame+1}/4</small></div>
  <button onClick={()=>{setAudit(true);setPlaying(false)}}>①–④ 방향·양팔 점검</button>
  {audit&&<div className={s.auditBackdrop}><section className={s.auditPanel} role="dialog" aria-modal="true" aria-label="홍유 방향·양팔 점검" onKeyDown={e=>{if(e.key==='Escape')setAudit(false)}}><header><h3>홍유 · 방향별 장비와 양팔</h3><button autoFocus onClick={()=>setAudit(false)}>점검 닫기</button></header><p>R = 캐릭터 오른팔·무기 손 / L = 왼팔. 화면의 좌우와 다릅니다. 선은 어깨와 손의 연결 기준입니다.</p><div className={s.controls}><button aria-pressed={anchors} onClick={()=>setAnchors(v=>!v)}>R/L 기준점 {anchors?'숨기기':'보기'}</button><button onClick={()=>{setStance(v=>v==='mounted'?'dismounted':'mounted');setAction(0);setFrame(0);setPlaying(false)}}>{stance==='mounted'?'하마로 비교':'탑승으로 비교'}</button>{actions.map((n,a)=><button key={n} aria-pressed={action===a} onClick={()=>{setAction(a);setFrame(0)}}>{n}</button>)}<button onClick={()=>setPlaying(v=>!v)}>{playing?'정지':'재생'}</button><button onClick={()=>{setPlaying(false);setFrame(v=>(v+1)%4)}}>다음 단계 {frame+1}/4</button></div><div className={s.loadout}>{slots.map(([slot,label])=><label key={slot}>{label}<select value={loadout[slot]} onChange={e=>{setLoadout(v=>({...v,[slot]:Number(e.target.value)}));setCompareBase(false)}}>{slot==='accessory'&&<option value={-1}>없음 · 기본 말</option>}{wearableEquipment.filter(i=>i.slot===slot).map(i=><option value={i.id} key={i.id}>{i.name}</option>)}</select></label>)}</div><div className={s.controls}>{hongRanks.map(r=><button key={r.id} aria-pressed={rank===r.id} onClick={()=>setRank(r.id)}>{r.name}</button>)}</div><div className={s.auditGrid}>{hongDirections.map(d=><figure key={d.dir}><figcaption>{d.label} · {stance==='mounted'?'탑승':'하마'}<br/>앞쪽 {d.rightNear?'오른팔':'왼팔'} / 뒤쪽 {d.rightNear?'왼팔':'오른팔'}</figcaption><HongLayerRig loadout={visualLoadout} dir={d.dir} action={action} frame={frame} stance={stance} rank={rank} debug={anchors}/></figure>)}</div><p>같은 장비와 같은 동작 단계를 네 방향에서 비교합니다. 탑승·하마 모두 네 동작의 조합을 확인합니다.</p></section></div>}
  <details className={s.production}><summary>착용 가능 장비 제작표 · 창 {wearableEquipment.filter(i=>i.slot==='weapon').length} / 갑옷 {wearableEquipment.filter(i=>i.slot==='armor').length} / 보조 {wearableEquipment.filter(i=>i.slot==='accessory').length}</summary><p>홍유가 착용 가능한 장비만 표시합니다. 아이콘 제작과 착용 모션 제작은 별개입니다.</p>{wearableEquipment.map(i=><article key={i.id}><img src={i.image} width={32} height={32} alt="" loading="lazy"/><div><b>{i.originalName} → {i.name}</b><p>{i.treasure?'보물':'일반'} · {i.permission}</p><p>{i.status} · {i.visible?'착용 외형 필요':'상시 외형 없음'}</p><small>{i.description}</small><p>제작 레이어: {i.layer}</p></div></article>)}</details>
  <details className={s.production}><summary>이번 제작 범위 · 모션 초안 안내</summary><p>승급 3단계 × 4방향 × 탑승·하마 × 대기·이동·공격·스킬을 연결했습니다. 창 6종과 기본 말·마갑·탈것 7종을 조합합니다. 갑옷 아이템은 승급 복장을 바꾸지 않습니다.</p><p>말 이동은 공통 4프레임 보행을 사용합니다. 기수 및 공격·스킬은 분리 부품의 관절 이동·회전으로 확인하는 미리보기입니다. 실제 게임용 완성 프레임 및 전투 판정은 별도입니다. 원본 능력치·옵션은 수정하지 않았습니다.</p></details>
 </section>;
}
