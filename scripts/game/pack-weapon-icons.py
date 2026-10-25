from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
from collections import deque
def label(mask):
 labs=np.zeros(mask.shape,np.int32);n=0;h,w=mask.shape
 for y,x in zip(*np.where(mask)):
  if labs[y,x]:continue
  n+=1;q=deque([(y,x)]);labs[y,x]=n
  while q:
   cy,cx=q.popleft()
   for dy,dx in ((0,1),(0,-1),(1,0),(-1,0)):
    ny,nx=cy+dy,cx+dx
    if 0<=ny<h and 0<=nx<w and mask[ny,nx] and not labs[ny,nx]:labs[ny,nx]=n;q.append((ny,nx))
 return labs,n
def find_objects(labs):
 out=[]
 for k in range(1,int(labs.max())+1):
  yy,xx=np.where(labs==k);out.append((slice(yy.min(),yy.max()+1),slice(xx.min(),xx.max()+1)))
 return out
import json,sys
root=Path(__file__).resolve().parents[2]; source=Path(sys.argv[1])
names=['exec-c180918d-e57c-4ad4-a990-3a861b41d94f.png','exec-7e3284a1-5609-46f7-b089-6bb2e0ed70ef.png','exec-10268e04-0666-41fc-a08f-e79fab228ae8.png','exec-b11ccedd-efb3-4855-ac8b-f84a9e349385.png']
data=json.loads((root/'web/src/features/game-world/data/weapon-proposals.json').read_text()); entries=data['records']+data['signatures']; records=[]
contact=Image.new('RGB',(960,960),'#d7cfb6');draw=ImageDraw.Draw(contact)
for g,name in enumerate(names):
 im=Image.open(source/name).convert('RGBA');a=np.array(im); labs,n=label(a[:,:,3]>16); groups={i:[] for i in range(12)}
 for k,sl in enumerate(find_objects(labs),1):
  if sl is None:continue
  ys,xs=sl; area=np.count_nonzero(labs[sl]==k)
  if area<8:continue
  cx=(xs.start+xs.stop)/2;cy=(ys.start+ys.stop)/2;idx=min(2,int(cy/im.height*3))*4+min(3,int(cx/im.width*4));groups[idx].append((k,sl))
 for j,parts in groups.items():
  idx=g*12+j;e=entries[idx]
  if idx==9:frame=Image.open(root/'web/public'/e['image'].lstrip('/')).convert('RGBA');frame.thumbnail((192,192))
  else:
   assert parts,(g,j)
   mask=np.zeros(labs.shape,bool)
   for k,sl in parts:mask[sl]|=labs[sl]==k
   yy,xx=np.where(mask);box=(max(0,int(xx.min())-2),max(0,int(yy.min())-2),min(im.width,int(xx.max())+3),min(im.height,int(yy.max())+3))
   arr=a.copy();arr[:,:,3]=np.where(mask,a[:,:,3],0);obj=Image.fromarray(arr).crop(box);obj.thumbnail((172,172),Image.Resampling.LANCZOS)
   frame=Image.new('RGBA',(192,192));frame.alpha_composite(obj,((192-obj.width)//2,(192-obj.height)//2))
   out=root/'web/public'/e['image'].lstrip('/');out.parent.mkdir(parents=True,exist_ok=True);frame.save(out,'WEBP',quality=76,method=6)
  path=root/'web/public'/e['image'].lstrip('/');records.append({'image':e['image'],'bytes':path.stat().st_size,'size':list(Image.open(path).size)})
  thumb=frame.copy();thumb.thumbnail((112,112));x=(idx%8)*120;y=(idx//8)*160;contact.paste(thumb,(x,y),thumb);draw.text((x+5,y+115),str(idx),fill='black')
contact.save('/tmp/weapons-contact.jpg')
(root/'scripts/game/weapon-icon-manifest.json').write_text(json.dumps({'generator':'built-in image_gen','sourcesRemoved':False,'records':records,'totalBytes':sum(r['bytes'] for r in records)},ensure_ascii=False,indent=2)+'\n')
print('icons',len(records),'bytes',sum(r['bytes'] for r in records))
