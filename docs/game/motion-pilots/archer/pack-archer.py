from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import json, statistics
ROOT=Path('/Users/choenamho/Documents/GitHub/-gymin')
OUT=ROOT/'web/public/images/class-motion-pilot/archer/job-6'
DOC=ROOT/'docs/game/motion-pilots/archer'
GEN=Path('/Users/choenamho/.codex/generated_images/01a17856-6c00-71f0-aacf-c7579eac0c6e')
SOURCES={'se':'exec-03d21353-449f-45d1-86af-6267ee407522.png','sw':'exec-4788d658-9c1a-45b4-bb58-1897f783b0f4.png','nw':'exec-4d0cc467-bc77-43ed-b8a5-53a0a3eb3d4a.png','ne':'exec-56ba21ab-4379-4b0f-a30a-390bedd9a1da.png','scenario':'exec-302aac53-900c-48e0-a6c3-4faf56f4fcea.png'}
dirs=['nw','ne','se','sw']
records=[]
for key,filename in SOURCES.items():
 im=Image.open(GEN/filename).convert('RGBA'); a=np.array(im)
 mask=a[:,:,3]>24
 a[:,:,3][a[:,:,3]<=24]=0
 im=Image.fromarray(a); mask=a[:,:,3]>24
 # Select blank cut lines near nominal equal cell boundaries; do not crop through a body.
 cuts=[0]
 for i in range(1,4):
  center=im.height*i//4
  options=[y for y in range(center-45,center+46) if not mask[y-3:y+4,:].any()]
  if not options: raise ValueError(('no clear horizontal gutter',key,i))
  cuts.append(min(options,key=lambda y:abs(y-center)))
 cuts.append(im.height)
 cells=[]
 for row in range(4):
  for col in range(4):
   cell=im.crop((col*im.width//4,cuts[row],(col+1)*im.width//4,cuts[row+1]))
   box=cell.getbbox()
   assert box and box[0]>0 and box[1]>0 and box[2]<cell.width and box[3]<cell.height,(key,row,col,box)
   cells.append(cell.crop(box))
 scale=112/statistics.median([c.height for c in cells[:4]])
 if key=='scenario': scale=112/statistics.median([c.height for c in cells])
 for i,c in enumerate(cells):
  row,col=divmod(i,4);direction=dirs[row] if key=='scenario' else key;action=0 if key=='scenario' else row
  kind='scenario-v1' if key=='scenario' else 'combat-v1'
  # Use connected boot region for ground center; identical scale for all actions.
  aa=np.array(c.getchannel('A'))
  yy,xx=np.where(aa[int(c.height*.9):,:]>64)
  pivot=(int(xx.min())+int(xx.max()))/2
  w,h=round(c.width*scale),round(c.height*scale)
  resized=c.resize((w,h),Image.Resampling.LANCZOS)
  x=round(80-pivot*scale);y=150-h
  assert x>=4 and x+w<=156 and y>=4,(key,i,x,y,w,h)
  frame=Image.new('RGBA',(160,160));frame.alpha_composite(resized,(x,y))
  path=OUT/kind/f'{direction}-{action}-{col}.webp'
  frame.save(path,'WEBP',quality=78,method=6)
  check=Image.open(path).convert('RGBA');bbox=check.getbbox()
  assert check.size==(160,160) and check.getchannel('A').getextrema()==(0,255)
  assert bbox[0]>0 and bbox[1]>0 and bbox[2]<160 and bbox[3]<=150
  records.append({'path':str(path.relative_to(ROOT)),'direction':direction,'action':action,'frame':col,'bytes':path.stat().st_size,'bbox':bbox,'scale':scale})
 # technical contact sheet with deliberate 15%+ padding around complete frames
 sheet=Image.new('RGBA',(960,960))
 for i in range(16):
  row,col=divmod(i,4);direction=dirs[row] if key=='scenario' else key;action=0 if key=='scenario' else row
  f=Image.open(OUT/('scenario-v1' if key=='scenario' else 'combat-v1')/f'{direction}-{action}-{col}.webp')
  sheet.alpha_composite(f,(col*240+40,row*240+25))
 sheet.save(OUT/('scenario-v1' if key=='scenario' else 'combat-v1')/f'contact-{key}.webp','WEBP',quality=78,method=6)
# animated comparison grids for visual replay, 20 sequences arranged 4 directions x 5 action rows
anim=[]
for t in range(4):
 canvas=Image.new('RGBA',(640,800),(227,231,226,255))
 for d,direction in enumerate(dirs):
  for action in range(5):
   kind='scenario-v1' if action==4 else 'combat-v1';act=0 if action==4 else action
   canvas.alpha_composite(Image.open(OUT/kind/f'{direction}-{act}-{t}.webp'),(d*160,action*160))
 anim.append(canvas)
anim[0].save(OUT/'combat-v1'/'review-animation.webp',save_all=True,append_images=anim[1:],duration=240,loop=0,quality=78,method=6)
manifest={'jobId':6,'jobName':'궁병','status':'visual-draft-awaiting-integration-review','frameSize':[160,160],'anchor':{'x':80,'footY':150,'bodyHeightApprox':112},'directions':dirs,'combat':{'path':'web/public/images/class-motion-pilot/archer/job-6/combat-v1','actions':4,'framesPerAction':4,'totalFrames':64},'scenario':{'path':'web/public/images/class-motion-pilot/archer/job-6/scenario-v1','actions':1,'framesPerAction':4,'totalFrames':16},'ms':{'idle':320,'move':170,'attack':190,'skill':240,'scenario':360,'weakened':300},'totalFrameBytes':sum(r['bytes'] for r in records),'totalBytes':sum(p.stat().st_size for p in OUT.rglob('*.webp')),'limitations':['시각 초안이며 사용자 검수 전이다.','실제 발사체·명중·스킬 판정, UI 연결 및 빌드는 범위 밖이다.','AI 생성에 따른 복식·머리·활 형태의 미세한 프레임 변화가 남는다.','승급·포차·쇠약 모션은 미제작이다.'],'frames':records,'prompts':json.loads(Path('/private/tmp/archer-prompts.json').read_text()),'sources':SOURCES}
(DOC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps({k:manifest[k] for k in ['totalFrameBytes','totalBytes']},ensure_ascii=False))
print('80 frames, all RGBA 160x160, clear edges, foot baseline 150; contacts and animated review saved')
