# coding: utf-8
"""Import existing decoded Cao Cao reference assets; no source files are modified."""
import json, sys, struct, zlib, hashlib
from pathlib import Path
src=Path(sys.argv[1]); root=Path(__file__).resolve().parents[2]
data=root/'web/src/features/game-world/data'; images=root/'web/public/images/jojo-reference'; images.mkdir(parents=True,exist_ok=True)
d=json.loads((src/'first-battle.json').read_text()); actors=json.loads((src/'cinema/actors.json').read_text())['people']; pal=(src/'cinema/palette-0.bin').read_bytes()
def png(path, pixels,w,h,transparent=False):
 def chunk(t,b):return struct.pack('>I',len(b))+t+b+struct.pack('>I',zlib.crc32(t+b)&0xffffffff)
 rows=b''.join(b'\0'+b''.join(pal[v*3:v*3+3]+bytes([0 if transparent and v==0 else 255]) for v in pixels[y*w:(y+1)*w]) for y in range(h))
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(rows))+chunk(b'IEND',b''))
# Role proposals, not historical equivalences or confirmed casting.
choices={0:('왕건','주인공 · 고려 건국과 통일의 중심'),1:('홍유','핵심 무장·개국 동료 역할'),2:('유금필','주력 야전 지휘관 역할'),3:('박영규','세력 사이의 선택을 다루는 인물 후보'),5:('복지겸','핵심 동료·군 지휘 역할'),6:('배현경','개국 동료·기동 전투 역할'),15:('박술희','측근 무장 역할'),16:('신숭겸','주군을 지키는 장수 역할. 공산 전투의 역사적 죽음 유지'),20:('최응','정치·책략 조언자 역할'),32:('견훤','경쟁 세력의 군주. 조조전의 인간관계는 그대로 옮기지 않음'),76:('신검','후반 후백제의 지휘자 후보. 계승 분쟁에 맞춰 재작성'),127:('궁예','왕건의 기존 주군과 결별하는 서사 역할. 동탁과 동일 인격으로 묘사하지 않음'),149:('경순왕','신라 왕실과 귀부 서사 역할. 허수아비 황제 설정은 계승하지 않음'),158:('왕륭','주인공의 가문과 성장 배경 역할')}
records=[]
for p,a in zip(d['people'],actors):
 i=p['id']; category='이름 있는 인물' if i<162 else '동일 인물 변형' if i<174 else '주민·소품' if i<210 else '일반 부대'
 face=0 if i==0 else 223 if i==1 else a['face']+7
 fp=src/f'cinema/face-{face}.bin'; portrait=None
 if fp.exists() and len(fp.read_bytes())==5120:
  fn=f'face-{face}.png';png(images/fn,fp.read_bytes(),64,80);portrait='/images/jojo-reference/'+fn
 body=a['body']; sp=src/f'cinema/actor-{body*2}.bin'; sprite=None
 if body<206 and sp.exists():
  raw=sp.read_bytes()[:3072];raw=b''.join(raw[y*48:y*48+48][::-1] for y in range(64));fn=f'body-{body}.png';png(images/fn,raw,48,64,True);sprite='/images/jojo-reference/'+fn
 job=next((j for j in d['jobs'] if j['id']==p['job']),None)
 baseid=next((x['id'] for x in d['people'][:162] if p['name'].startswith(x['name']) and i>=162 and i<174),None)
 if i in choices: name,reason=choices[i];kind='확정' if i==0 else '역사 인물 추천'
 elif baseid in choices:name,reason=choices[baseid];reason='본체와 같은 교체 인물 / 외형·상태 변형 슬롯';kind='변형 연동 추천'
 elif category in ['이름 있는 인물','동일 인물 변형']:
  name=['서','연','도','하','윤','설'][i%6]+['무','진','솔','해','결','휘','담','율'][i//6%8]+['','온','운','겸'][i//48%4];reason='창작 인물 가칭. 원본의 혈연·성별·진영·사망 사건은 복사하지 않고 후삼국 서사에서 역할을 정할 예정';kind='창작 이름 제안'
 else:name=p['name'].replace('황건적','유민군').replace('서량기병','북방기병').replace('나무인형','목령병').replace('흙인형','토령병').replace('관우의 머리','전사자 유품');reason='개별 장수가 아닌 배역·부대·소품 슬롯. 모델과 명칭을 함께 교체';kind='배역 이름 제안'
 records.append(dict(id=i,name=p['name'],category=category,job=job['name'] if job else '미정',jobId=p['job'],movement=job['movement'] if job else None,base=p['base'],attributes=p['attributes'],gear=[next((t['name'] for t in d['items'] if t['id']==g),'없음' if g==255 else f'미확인 {g}') for g in p['gear']],rawState=p['originalPersonState'],portrait=portrait,sprite=sprite,faceId=face,bodyId=body,replacement=name,recommendation=kind,reason=reason))
out={'source':'기존 first-battle.json + cinema/actors.json 및 디코딩된 이미지','sha256':hashlib.sha256((src/'first-battle.json').read_bytes()).hexdigest(),'palette':0,'records':records,'sources':[{'title':'고려사 · 홍유 등 개국공신','url':'https://db.history.go.kr/goryeo/itemLevelKrList.do?itemId=kr&parentId=kr_092r_0010_0010'},{'title':'후삼국 통일 · 한국민족문화대백과','url':'https://encykorea.aks.ac.kr/Article/E0065744'}]}
(data/'characters.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('records',len(records),'portraits',sum(bool(x['portrait']) for x in records),'sprites',sum(bool(x['sprite']) for x in records))
