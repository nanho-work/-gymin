from PIL import Image,ImageDraw
from pathlib import Path
import numpy as np,json
root=Path(__file__).resolve().parents[2];folder=root/'web/public/images/folklore/kungdol-equipment-v1'
heights={}
for d in ['nw','ne','se','sw']:
 vals=[]
 for p in folder.glob(f'*-{d}-0-*.webp'):
  a=np.array(Image.open(p));ys,xs=np.where(a[:,:,3]>100);vals.append(ys.max()-ys.min()+1)
 heights[d]=float(np.median(vals))
target=min(heights.values()); records=[]
for d,h in heights.items():
 factor=target/h
 for p in folder.glob(f'*-{d}-*.webp'):
  im=Image.open(p).convert('RGBA');n=round(160*factor);sm=im.resize((n,n),Image.Resampling.LANCZOS);dst=Image.new('RGBA',(160,160));dst.paste(sm,(round(80*(1-factor)),round(148*(1-factor))));dst.save(p,'WEBP',quality=72,method=6)
  records.append({'file':p.name,'bytes':p.stat().st_size,'normalizationScale':factor})
result={'frameSize':160,'baseline':148,'idleHeightTarget':target,'directionIdleHeightsBefore':heights,'frames':records,'bytes':sum(r['bytes'] for r in records)}
(root/'scripts/game/kungdol-four-direction-final-manifest.json').write_text(json.dumps(result,indent=2)+'\n')
canvas=Image.new('RGB',(640,320),(69,83,53));draw=ImageDraw.Draw(canvas)
for i,d in enumerate(heights):
 for j,item in enumerate(['pestle','club']):
  im=Image.open(folder/f'{item}-{d}-0-0.webp');canvas.paste(im,(160*i,160*j),im);draw.text((160*i+4,160*j+4),d+' '+item,fill='white');draw.line((160*i,160*j+148,160*i+159,160*j+148),fill=(120,140,90))
canvas.save('/tmp/kungdol-four-directions.jpg');print(result['bytes'],heights,target)
