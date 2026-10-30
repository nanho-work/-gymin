import s from './skills.module.css';
type Spell={id:number;range:number;area:number;side:number};
export function SkillRange({spell:x,kind}:{spell:Spell;kind:'range'|'area'}){
 const range=kind==='range', self=x.id>=58&&x.id<=63;
 const global=[14,66,67].includes(x.id)||(range&&x.id===43)||(x.id>=58&&x.id<=60);
 const center=range?'나':x.id===64||self?'나':'대상';
 const size=!range&&x.area===5?7:9, mid=Math.floor(size/2);
 const active=(dx:number,dy:number)=>{const a=Math.abs(dx),b=Math.abs(dy),d=a+b;if(global)return true;if(self)return d===0;if(range){if(d===0)return x.side===1&&x.id!==57;return x.range===13?d<=4:x.range===12?d<=3:x.range===6?d<=2:x.range===5?(a===0||b===0)&&d<=2:x.range===1?Math.max(a,b)===1:false;}if(x.area===5)return dy===0&&dx>=0&&dx<=5;if(x.area===6)return d<=3;return x.area===2?Math.max(a,b)<=1:x.area===1?d<=1:d===0;};
 const label=global?(x.id===66?'전장 전체 · 적과 아군':x.id===67?'전장 전체 · 아군':x.id===43?'거리 제한 없음':x.id>=58&&x.id<=60?'전장 날씨':'전장 전체 · 적'):self?'자신':range?(x.range===13?'상하좌우 거리 4칸 이내':x.range===12?'상하좌우 거리 3칸 이내':x.range===6?'상하좌우 거리 2칸 이내':x.range===5?'직선 1~2칸':'주변 8칸 · 자신 제외'):x.area===5?'대상부터 진행 방향으로 6칸':x.area===6?'시전자 중심 거리 3칸':x.area===2?'대상과 주변 8칸':x.area===1?'대상과 상하좌우 4칸':'선택한 한 부대';
 return <figure className={s.diagram}><figcaption>{range?'사거리':'효과 범위'}</figcaption><svg viewBox={`0 0 ${size*18} ${size*18}`} role="img" aria-label={`${range?'사거리':'효과 범위'}: ${label}`}>
 {Array.from({length:size*size},(_,i)=>{const col=i%size,row=Math.floor(i/size),dx=col-(!range&&x.area===5?1:mid),dy=row-mid,on=active(dx,dy),origin=dx===0&&dy===0;return <g key={i}><rect x={col*18+1} y={row*18+1} width="16" height="16" rx="2" fill={origin&&!global?'#d9bd79':on?(range?'#4789a0':'#b75f51'):'#263d34'}/>{origin&&!global&&<text x={col*18+9} y={row*18+12} textAnchor="middle" fontSize={center==='대상'?7:10} fill="#14271f">{center}</text>}</g>})}
 {global&&<text x={size*9} y={size*9+5} textAnchor="middle" fill="white" fontSize="15" stroke="#172e26" strokeWidth=".5">전장 전체</text>}</svg><small>{label}</small>{!range&&x.area===5&&<small>오른쪽으로 시전한 예 →</small>}</figure>
}
