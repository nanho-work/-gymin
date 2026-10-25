from pathlib import Path
from PIL import Image,ImageDraw
import json,statistics,sys
from play_components import figures
r=Path(__file__).resolve().parents[2];source_manifest=json.loads((r/'scripts/game/playable-seven-manifest.json').read_text());assets=[];reports=[];contacts=[]
only=set(sys.argv[1:])
if only:
 old=json.loads((r/'scripts/game/playable-seven-manifest.json').read_text());assets=[a for a in old['assets'] if a['id'] not in only];reports=[a for a in old['frames'] if a['id'] not in only]
for cfg in json.loads((r/'web/src/features/game-world/data/playable-characters.json').read_text())['records']:
 id,oid,name=cfg['id'],cfg['originalId'],cfg['name']
 if only and id not in only:continue
 cells=[]
 for direction in ['se','sw','nw','ne']:
  a=next((a for a in source_manifest['assets'] if a['id']==id and a['dir']==direction),None)
  if a is None:continue
  if not Path(a['source']).exists():raise FileNotFoundError('Regenerate source from manifest prompt before packing: '+a['source'])
  im=Image.open(a['source']).convert('RGBA');w,h=im.size;assets.append(a)
  for row,col,cell in figures(im):cells.append((direction,row,col,cell,10))
 if not cells:continue
 # One scale for the character across every direction and action, not frame-by-frame resizing.
 idle=[c[3].height for c in cells if c[1]==0];target=100 if oid in [1,5,18] else 94
 scales={d:min(target/statistics.median([c[3].height for c in cells if c[0]==d and c[1]==0]),min(144/max(c[3].size) for c in cells if c[0]==d)) for d in set(c[0] for c in cells)}
 contact=Image.new('RGB',(640,640),'#647a39');draw=ImageDraw.Draw(contact)
 for direction,row,col,cell,edge in cells:
  scale=scales[direction]
  size=(max(1,round(cell.width*scale)),max(1,round(cell.height*scale)));cell=cell.resize(size,Image.Resampling.LANCZOS);out=Image.new('RGBA',(160,160));out.alpha_composite(cell,((160-cell.width)//2,148-cell.height));dest=r/f'web/public/images/playable/{id}/{direction}-{row}-{col}.webp';dest.parent.mkdir(parents=True,exist_ok=True);out.save(dest,'WEBP',quality=72,method=6)
  reports.append(dict(id=id,file=str(dest.relative_to(r)),bytes=dest.stat().st_size,cellEdgeMargin=edge,baseline=148))
  if col==0:
   y=['se','sw','nw','ne'].index(direction)*160;x=row*160;contact.paste(out,(x,y),out);draw.text((x+3,y+3),f'{direction} {row}',fill='white')
 contact.save(f'/tmp/play-seven-{id}-check.jpg');contacts.append(id)
(r/'scripts/game/playable-seven-manifest.json').write_text(json.dumps(dict(generator='built-in image_gen',sourcesRemoved=False,assets=assets,frames=reports,totalBytes=sum(a['bytes'] for a in reports)),ensure_ascii=False,indent=2)+'\n');print('Sheets',len(assets),'Frames',len(reports),'edge warnings',[(a['id'],a['file']) for a in reports if a['cellEdgeMargin']<3])
