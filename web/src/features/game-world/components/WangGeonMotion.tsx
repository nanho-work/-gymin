"use client";
import {useState} from 'react';
import {CharacterMotion} from './CharacterMotion';
import s from './playable.module.css';
const scenarioActions=[{name:'서 있기',ms:360}];
const weakActions=[{name:'쇠약 · 비틀거림',ms:300}];
export function WangGeonMotion(){const [mode,setMode]=useState('normal');const standing=mode==='standing';const weak=mode==='lowhp'||mode==='status';const root='/images/playable/wang-geon/'+(standing?'scenario-standing-v2':weak?'weakened-v1':'full-frame-v1');return <section className={`${s.preview} ${s.hongPreview}`} aria-label="왕건 완성 프레임 모션">
<div className={s.hongTop}><div className={s.hongPortrait}><strong>군웅</strong><img src="/images/representatives/wang-geon-portrait-v3.webp" width={80} height={100} alt="왕건 초상화"/></div><div className={s.hongNames}><strong>조조</strong><span>↓</span><strong>왕건</strong></div><img src={`${root}/se-0-0.webp`} width={100} height={100} alt="승인된 왕건 기본 외형"/></div>
<div className={s.controls} role="group" aria-label="왕건 장면과 상태">{[['normal','탑승 · 정상'],['standing','하마 · 시나리오'],['lowhp','탑승 · HP 30% 이하'],['status','탑승 · 상태 이상']].map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)}>{label}</button>)}</div>
<CharacterMotion name="왕건" asset="wang-geon" root={root} actions={standing?scenarioActions:weak?weakActions:undefined} caption={standing?'시나리오용 하마 서 있기 · 4방향 · 방향별 4프레임. 하마 이동·공격은 미제작입니다.':weak?'전투 탑승 전용 쇠약 모션 · HP 30% 이하와 상태 이상에서 공통으로 비교합니다. 실제 HP·상태 판정은 연결하지 않은 시각 미리보기입니다.':'군웅 탑승 · 4방향 × 대기·이동·공격·스킬 × 4프레임. 말과 기수를 함께 그린 완성 프레임입니다.'}/>
<details><summary>제작 범위 · 기본 설정</summary><p>남색 포와 검은 관모를 공통으로 사용합니다. 전투에서는 기본 갈색 말과 짧은 검, 시나리오에서는 무기 없는 하마 모습으로 표시합니다. 개별 장비 착용은 외형을 바꾸지 않습니다. 승급은 별도 고정 외형 세트로 제작합니다.</p><p>기본 군웅의 탑승 모션, 시나리오용 하마 서 있기, 탑승 쇠약 모션을 제작했습니다. 영웅·패왕 모션은 아직 제작하지 않았습니다. 기존 능력치·이동 거리·전투 판정은 변경하지 않았습니다.</p></details>
</section>}
