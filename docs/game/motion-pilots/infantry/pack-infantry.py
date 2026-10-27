from PIL import Image
import numpy as np
from PIL import ImageFilter
class ND:
 @staticmethod
 def label(mask):
  h,w=mask.shape; lab=np.zeros((h,w),dtype=np.int32); n=0
  for y,x in zip(*np.where(mask)):
   if lab[y,x]:continue
   n+=1;lab[y,x]=n; stack=[(y,x)]
   while stack:
    yy,xx=stack.pop()
    for ny,nx in ((yy-1,xx),(yy+1,xx),(yy,xx-1),(yy,xx+1)):
     if 0<=ny<h and 0<=nx<w and mask[ny,nx] and not lab[ny,nx]:lab[ny,nx]=n;stack.append((ny,nx))
  return lab,n
 @staticmethod
 def find_objects(lab):
  result=[]
  for i in range(1,lab.max()+1):
   y,x=np.where(lab==i);result.append((slice(y.min(),y.max()+1),slice(x.min(),x.max()+1)))
  return result
 @staticmethod
 def binary_dilation(mask,iterations):
  return np.asarray(Image.fromarray(mask.astype('uint8')*255).filter(ImageFilter.MaxFilter(iterations*2+1)))>0
ndimage=ND()
from pathlib import Path
import json
ROOT=Path('/Users/choenamho/Documents/GitHub/-gymin')
GEN=Path('/Users/choenamho/.codex/generated_images/01a17855-cacd-7c31-8fdc-2641cce03737')
OUT=ROOT/'web/public/images/class-motion-pilot/infantry/job-3'
DOC=ROOT/'docs/game/motion-pilots/infantry'
sources={'se':'exec-37b347ad-8b22-476e-9ff1-489fdeb6c7f7.png','sw':'exec-09ff322e-f072-4363-9993-f9a2314f8961.png','nw':'exec-128ad185-b73a-450f-af1b-e8bb65088506.png','ne':'exec-21d6bb98-3311-4c8d-a999-6ea46f399f12.png','scenario':'exec-afe3d9c0-18c6-4a02-8671-4809070b16c1.png'}
records=[]
for key,src in sources.items():
 im=Image.open(GEN/src).convert('RGBA'); a=np.asarray(im)
 labels,n=ndimage.label(a[:,:,3]>40)
 comps=[]
 for i,sl in enumerate(ndimage.find_objects(labels),1):
  if sl is None: continue
  area=(labels[sl]==i).sum()
  if area<1000:continue
  y,x=sl; comps.append((x.start,y.start,x.stop,y.stop,i,int(area)))
 assert len(comps)==16,(key,len(comps))
 comps.sort(key=lambda b:(b[1]+b[3])/2)
 ordered=[]
 for r in range(4):ordered+=sorted(comps[r*4:r*4+4],key=lambda b:b[0])
 crops=[]
 for x0,y0,x1,y1,i,area in ordered:
  # Connected full figure including sword, preserve antialiased boundary.
  mask=ndimage.binary_dilation(labels==i,iterations=2)
  ys,xs=np.where(mask); box=(max(0,xs.min()-1),max(0,ys.min()-1),min(im.width,xs.max()+2),min(im.height,ys.max()+2))
  b=np.array(im.crop(box)); m=mask[box[1]:box[3],box[0]:box[2]];b[:,:,3]*=m
  crops.append(Image.fromarray(b))
 # One scale per combat direction, all actions; one scale per scenario direction.
 scales=[]
 for r in range(4):
  idle=crops[r*4:r*4+4] if key=='scenario' else crops[:4]
  scale=112/float(np.median([c.height for c in idle]))
  group=crops[r*4:r*4+4] if key=='scenario' else crops
  scale=min(scale,140/max(c.width for c in group),140/max(c.height for c in group))
  scales.append(scale)
 sheet=Image.new('RGBA',(640,640))
 for j,c in enumerate(crops):
  row,col=divmod(j,4);scale=scales[row]
  c=c.resize((round(c.width*scale),round(c.height*scale)),Image.Resampling.LANCZOS)
  alpha=np.asarray(c)[:,:,3]; yy,xx=np.where(alpha>40)
  bottom=int(yy.max()); footx=float(np.median(xx[yy>=bottom-7]))
  dx=round(80-footx);dy=150-bottom
  # Preserve whole silhouette when an extreme pose needs horizontal space.
  dx=max(4-int(xx.min()),min(dx,155-int(xx.max())))
  assert dy+yy.min()>=4 and dy+bottom==150
  canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(c,(dx,dy))
  directory='scenario-v1' if key=='scenario' else 'combat-v1'
  direction=['nw','ne','se','sw'][row] if key=='scenario' else key
  action=0 if key=='scenario' else row
  name=f'{direction}-{action}-{col}.webp';path=OUT/directory/name
  canvas.save(path,'WEBP',quality=78,method=6)
  final=Image.open(path).convert('RGBA');bbox=final.getchannel('A').getbbox()
  assert final.size==(160,160) and bbox[0]>0 and bbox[1]>0 and bbox[2]<160 and bbox[3]<160
  sheet.alpha_composite(final,(col*160,row*160))
  records.append({'path':str(path.relative_to(ROOT)),'direction':direction,'action':action,'frame':col,'bytes':path.stat().st_size,'alphaBounds':bbox,'scale':scale,'anchor':[80,150]})
 sheet.save(OUT/directory/f'review-{key}.webp','WEBP',quality=78,method=6)
 # Animated review: all four actions/directions shown simultaneously at native size.
 frames=[]
 for col in range(4):
  fr=Image.new('RGBA',(640,160))
  for row in range(4):fr.alpha_composite(sheet.crop((col*160,row*160,col*160+160,row*160+160)),(row*160,0))
  frames.append(fr)
 frames[0].save(OUT/directory/f'review-{key}-animated.webp',save_all=True,append_images=frames[1:],duration=360 if key=='scenario' else 240,loop=0,quality=78,method=6)
manifest={'jobId':3,'jobName':'경보병','status':'visual-draft-review-required','frameCount':80,'combat':{'directions':4,'actions':4,'framesPerAction':4,'path':'web/public/images/class-motion-pilot/infantry/job-3/combat-v1'},'scenario':{'directions':4,'actions':1,'framesPerAction':4,'path':'web/public/images/class-motion-pilot/infantry/job-3/scenario-v1'},'frameSize':[160,160],'anchor':{'x':80,'footY':150},'ms':{'idle':320,'move':170,'attack':190,'skill':240,'scenario':360,'weakened':300},'totalFrameBytes':sum(r['bytes'] for r in records),'totalBytes':sum(p.stat().st_size for p in OUT.rglob('*.webp')),'files':records,'limits':['시각 초안; 실제 전투 판정 및 사이트 UI 미연결','일부 공격은 목표 방향보다 옆으로 벌어지는 동작; 후속 사용자 검토 필요','생성 프레임의 미세 복식 및 실루엣 차이; 최종 게임용 애니메이션 아님','쇠약·승급·다른 병과 미제작'],'sources':sources}
(DOC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in manifest.items() if k not in ['files','sources']},ensure_ascii=False))
