from PIL import Image,ImageDraw
from pathlib import Path
import numpy as np,json,sys
root=Path(__file__).resolve().parents[2];folder=root/'web/public/images/folklore/kungdol-equipment-v1'
im=Image.open(sys.argv[1]).convert('RGBA');w,h=im.size
records=[];contact=Image.new('RGB',(480,320),(65,74,60))
for row,item in enumerate(['pestle','club']):
 for col in range(3):
  cell=im.crop((round(col*w/3),round(row*h/2),round((col+1)*w/3),round((row+1)*h/2)))
  a=np.array(cell);mask=a[:,:,3]>20
  if mask[0].any() or mask[-1].any() or mask[:,0].any() or mask[:,-1].any():raise ValueError('Source touches boundary: '+str((row,col)))
  # Sole landmark from opaque lower body, independent of magical glow.
  body=(a[:,:,3]>220)&(a[:,:,:3].max(axis=2)<190)
  body[:int(cell.height*.65)]=False
  yy,xx=np.where(body);ground=yy.max();near=yy>ground-8;anchor=(xx[near].min()+xx[near].max())/2
  # This repaired sheet uses identical character body scale for all six poses.
  scale=0.28*(512/cell.height)
  small=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.LANCZOS)
  x=round(80-anchor*scale);y=round(148-(ground+1)*scale)
  box=small.getbbox();x=min(max(x,3-box[0]),157-box[2]);assert x+box[0]>=3 and x+box[2]<=157 and y+box[1]>=3 and y+box[3]<=159,(row,col,box,x,y)
  frame=Image.new('RGBA',(160,160));frame.paste(small,(x,y))
  path=folder/f'{item}-ne-3-{col}.webp';frame.save(path,'WEBP',quality=72,method=6)
  contact.paste(frame,(col*160,row*160),frame)
  records.append({'file':path.name,'bytes':path.stat().st_size,'baseline':148,'sourceFoot':[float(anchor),int(ground)],'scale':scale})
contact.save('/tmp/kungdol-repair-contact.jpg')
(root/'scripts/game/kungdol-clipping-repair-manifest.json').write_text(json.dumps({'frames':records},indent=2)+'\n')
print(records)
