"""Read-only import of 104 original items, icons and descriptions. No EXE execution."""
import ast,hashlib,json,struct,sys,zipfile,zlib
from pathlib import Path
source=Path(sys.argv[1]);archive=Path(sys.argv[2]);root=Path(__file__).resolve().parents[2]
ns={'struct':struct};tree=ast.parse((source/'extract_assets.py').read_text());exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,(ast.FunctionDef,ast.ClassDef)) and n.name in ('ResourceError','decode_block','palette')],type_ignores=[]),'decoder','exec'),ns)
d=json.loads((source/'assets/first-battle.json').read_text());out=root/'web/public/images/item-reference';out.mkdir(parents=True,exist_ok=True)
def png(raw,pal):
 def chunk(t,b):return struct.pack('>I',len(b))+t+b+struct.pack('>I',zlib.crc32(t+b)&0xffffffff)
 rows=b''.join(b'\0'+b''.join(pal[v*3:v*3+3]+bytes([0 if v==0 else 255]) for v in raw[y*32:(y+1)*32]) for y in range(32))
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',32,32,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(rows))+chunk(b'IEND',b'')
with zipfile.ZipFile(archive) as z:
 icons=z.read('ITEM.E5');msg=z.read('IMSG.E5');pal=ns['palette'](ns['decode_block'](z.read('SPALET.E5'),0));records=[]
 assert len(d['items'])==104 and (struct.unpack_from('>I',icons,280)[0]-272)//12==104
 for item in d['items']:
  i=item['id'];t=item['type'];raw=ns['decode_block'](icons,i);assert len(raw)==1024
  (out/f'item-{i}.png').write_bytes(png(raw,pal))
  desc=msg[i*216:(i+1)*216].split(b'\0')[0].decode('cp949');assert desc
  category='무기' if t<14 else '방어구' if t<18 else '보조구' if t<63 else '소모품'
  family=['검','창','활','곤봉','투석기','부채','보검','갑옷','옷'][t//2] if t<18 else '말' if i in [60,61,62,63] else '보조구' if t<63 else '소모품'
  jobs=[j['name'] for j in d['jobs'] if t<18 and j['allowed'][t]==1]
  records.append(dict(**item,category=category,family=family,description=desc,image=f'/images/item-reference/item-{i}.png',allowedJobs=jobs,permissionNote='원본 병과 장착 허용표 기준' if t<18 else '현 Swift 구현에서 보조구 병과 제한 없음 · 개별 효과 발동 조건과 구분' if t<63 else '소모품 · 장착 대상 아님',purchasePrice=item['priceUnit']*100 if 0<item['priceUnit']<255 else None,shopScenarios=[r['scenario'] for r in d['shopStages'] if i in r['equipment']+r['tools']],replacement=None,visualStatus='새 게임 외형 미제작'))
result={'source':'first-battle.json / ITEM.E5 block=item ID (32×32) / IMSG.E5 216-byte records / SPALET.E5 block0','archiveSHA256':hashlib.sha256(archive.read_bytes()).hexdigest(),'records':records}
(root/'web/src/features/game-world/data/items.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print('Imported',len(records),'items/icons/descriptions;',sum(p.stat().st_size for p in out.glob('*.png')),'image bytes')
