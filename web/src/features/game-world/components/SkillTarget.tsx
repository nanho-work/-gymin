"use client";
import s from './fireball.module.css';
import units from '../data/skill-target-units.json';
const defaultUnit=units.find(x=>x.name==='경기병')??units[0];
export type TargetCondition={lowHp:boolean;status:boolean;unitId?:string};
export function TargetConditionControls({value,onChange}:{value:TargetCondition;onChange:(value:TargetCondition)=>void}){
 const unit=units.find(x=>x.id===value.unitId)??defaultUnit;
 return <fieldset className={s.targetConditions}><legend>대상 병과·상태 · 미리보기</legend><label>대상 병과<select value={unit.id} onChange={e=>onChange({...value,unitId:e.target.value})}>{units.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label><small>전용 지친 모션</small><label><input type="checkbox" checked={value.lowHp} onChange={e=>onChange({...value,lowHp:e.target.checked})}/> HP 30% 이하</label><label><input type="checkbox" checked={value.status} onChange={e=>onChange({...value,status:e.target.checked})}/> 상태이상</label><small>선택한 상태를 유지합니다. 회복량·상태 해제 판정은 계산하지 않습니다.</small></fieldset>
}
export function SkillTarget({x,y,tick,hitAt=[],condition,hidden=false,index=1}:{x:number;y:number;tick:number;hitAt?:number[];condition:TargetCondition;hidden?:boolean;index?:number}){
 const start=[...hitAt].reverse().find(t=>tick>=t&&tick<t+4),hit=start!==undefined;
 const persistent=condition.lowHp||condition.status,weak=persistent||hit;
 const frame=weak?(hit&&!persistent?tick-start!:Math.floor(tick/2))%4:0;
 const unit=units.find(x=>x.id===condition.unitId)??defaultUnit;
 const root=weak?unit.weakened:unit.combat;
 return <img className={s.unit} style={{left:`${x}%`,top:`${y}%`,opacity:hidden?0:1}} src={`${root}/sw-0-${weak?frame:0}.webp`} alt={`${unit.name} 대상 ${index} · ${persistent?'쇠약 유지':hit?'피격 · 지친 모션':'대기'}`}/>;
}
