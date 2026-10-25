"use client";
import {useState} from 'react';
import Image from 'next/image';
import e from './equipment-preview.module.css';
type Props={name:string;baseImage:string;equippedImage:string;equipmentName:string};
export function CharacterEquipmentPreview({name,baseImage,equippedImage,equipmentName}:Props){
 const [equipped,setEquipped]=useState(false);
 const src=equipped?equippedImage:baseImage;
 return <div className={e.preview}><div role="group" aria-label={`${name} 장비 모습 선택`} className={e.controls}><button type="button" aria-pressed={!equipped} onClick={()=>setEquipped(false)}>기본 모습</button><button type="button" aria-pressed={equipped} onClick={()=>setEquipped(true)}>{equipmentName} 착용</button></div><a href={src} target="_blank" rel="noreferrer" aria-label={`${name} ${equipped?equipmentName+' 착용':'기본'} 이미지 크게 보기`}><Image unoptimized src={src} alt={`${name} ${equipped?equipmentName+' 착용':'기본'} 전신 초안`} width={512} height={512}/></a><small aria-live="polite">{equipped?`${equipmentName} 착용 · 정지 시안`:'기본 콘셉트 · 절굿공이 소지'}</small><small>전신 일러스트 비교입니다. 아래 전투 모션의 아이템 버튼과는 별도로 선택합니다.</small></div>
}
