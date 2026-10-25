from PIL import Image
import numpy as np
def label(mask):
 h,w=mask.shape; labels=np.zeros((h,w),dtype=np.int32);n=0
 for y,x in zip(*np.where(mask)):
  if labels[y,x]: continue
  n+=1;stack=[(y,x)];labels[y,x]=n
  while stack:
   yy,xx=stack.pop()
   for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
    a,b=yy+dy,xx+dx
    if 0<=a<h and 0<=b<w and mask[a,b] and not labels[a,b]: labels[a,b]=n;stack.append((a,b))
 return labels,n
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[2]; out=root/'web/public/images/folklore/kungdol-equipment-v1';out.mkdir(exist_ok=True)
records=[]
for variant,source in [('pestle',sys.argv[1]),('club',sys.argv[2])]:
 im=Image.open(source).convert('RGBA'); w,h=im.size
 for row in range(4):
  for col in range(4):
   cell=im.crop((round(col*w/4),round(row*h/4),round((col+1)*w/4),round((row+1)*h/4)))
   a=np.array(cell); labels,n=label(a[:,:,3]>80); counts=np.bincount(labels.ravel());counts[0]=0; mask=labels==counts.argmax();a[~mask,3]=0;cell=Image.fromarray(a); yy,xx=np.where(mask)
   # Foot-contact search excludes far-left weapon. Same scale for every pose and weapon.
   foot=mask.copy();foot[:int(cell.height*.72)]=False;foot[:,:int(cell.width*.30)]=False;foot[:,int(cell.width*(.65 if row==2 else .85)):]=False
   fy,fx=np.where(foot); ground=int(fy.max()); near=(fy>=ground-8); anchor=cell.width/2
   # Fixed cell-to-frame scale keeps character proportions constant, no per-pose fit.
   scale=132/max(cell.size); rw=round(cell.width*scale);rh=round(cell.height*scale)
   small=cell.resize((rw,rh),Image.Resampling.LANCZOS)
   x=round(80-anchor*scale);y=round(148-(ground+1)*scale)
   frame=Image.new('RGBA',(160,160));frame.paste(small,(x,y))
   # No visible pixels may be clipped by the export canvas.
   bounds=(x+xx.min()*scale,y+yy.min()*scale,x+(xx.max()+1)*scale,y+(yy.max()+1)*scale)
   assert min(bounds[:2])>=0 and max(bounds[2:])<=160,(variant,row,col,bounds)
   name=f'{variant}-se-{row}-{col}.webp';frame.save(out/name,'WEBP',quality=72,method=6)
   records.append({'file':name,'bytes':(out/name).stat().st_size,'scale':scale,'footAnchor':[anchor,ground],'offset':[x,y],'baseline':148})
(root/'scripts/game/kungdol-equipment-motion-v1-manifest.json').write_text(json.dumps({'frameSize':160,'baseline':148,'frames':records,'bytes':sum(r['bytes'] for r in records)},indent=2)+'\n')
canvas=Image.new('RGB',(8*160,4*160),(75,84,55))
for k,r in enumerate(records):
 idx=k%16;col=idx%4+(k//16)*4;row=idx//4
 f=Image.open(out/r['file']);canvas.paste(f,(col*160,row*160),f)
canvas.save('/tmp/kungdol-motion-contact.jpg')
print('frames',len(records),'bytes',sum(r['bytes'] for r in records))
