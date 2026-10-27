from pathlib import Path
from PIL import Image
import numpy as np
import json,statistics,shutil,hashlib
ROOT=Path('/Users/choenamho/Documents/GitHub/-gymin')
BASE=ROOT/'web/public/images/class-motion-pilot/archer/job-6'
DOC=ROOT/'docs/game/motion-pilots/archer'
GEN=Path('/Users/choenamho/.codex/generated_images/01a17856-6c00-71f0-aacf-c7579eac0c6e')
SOURCES={'ne':'exec-427fe49e-ae89-4de4-ba16-ca9920d69197.png','sw':'exec-8cd3849f-25fb-4c94-b617-5d0647126154.png'}
DIRS=['nw','ne','se','sw']
for mode in ['combat','scenario']:
 target=BASE/f'{mode}-v2';target.mkdir(exist_ok=True)
 for p in (BASE/f'{mode}-v1').glob('*.webp'):
  if p.name[:2] in DIRS and len(p.stem.split('-'))==3:shutil.copy2(p,target/p.name)
scales={}
for direction,name in SOURCES.items():
 im=Image.open(GEN/name).convert('RGBA');a=np.array(im);a[:,:,3][a[:,:,3]<=24]=0;im=Image.fromarray(a);mask=a[:,:,3]>24
 cuts=[0]
 for i in range(1,4):
  c=im.height*i//4;opts=[y for y in range(c-55,c+56) if not mask[y-2:y+3].any()]
  assert opts,(direction,i,'no gutter')
  cuts.append(min(opts,key=lambda y:abs(y-c)))
 cuts.append(im.height)
 cells=[]
 for row in range(4):
  for col in range(4):
   cell=im.crop((col*im.width//4,cuts[row],(col+1)*im.width//4,cuts[row+1]));b=cell.getbbox()
   assert b and b[0]>0 and b[1]>0 and b[2]<cell.width and b[3]<cell.height,(direction,row,col,b)
   cells.append(cell.crop(b))
 scale=112/statistics.median(c.height for c in cells[:4]);scales[direction]=scale
 for i,c in enumerate(cells):
  row,col=divmod(i,4);aa=np.array(c.getchannel('A'));yy,xx=np.where(aa[int(c.height*.9):]>64)
  pivot=(int(xx.min())+int(xx.max()))/2
  w,h=round(c.width*scale),round(c.height*scale);x=round(80-pivot*scale);y=150-h
  assert x>=5 and x+w<=155 and y>=5,(direction,i,x,y,w,h)
  f=Image.new('RGBA',(160,160));f.alpha_composite(c.resize((w,h),Image.Resampling.LANCZOS),(x,y));f.save(BASE/'combat-v2'/f'{direction}-{row}-{col}.webp',quality=78,method=6)
# Complete-frame reuse at recovery, not limb compositing. Exact return to ready.
for d in DIRS:
 for action in [2,3]:shutil.copy2(BASE/'combat-v2'/f'{d}-0-0.webp',BASE/'combat-v2'/f'{d}-{action}-3.webp')
records=[]
for mode,actions in [('combat',range(4)),('scenario',range(1))]:
 for d in DIRS:
  for action in actions:
   for t in range(4):
    p=BASE/f'{mode}-v2'/f'{d}-{action}-{t}.webp';im=Image.open(p).convert('RGBA');b=im.getbbox()
    assert im.size==(160,160) and im.getchannel('A').getextrema()==(0,255)
    assert b[0]>0 and b[1]>0 and b[2]<160 and b[3]==150,(p.name,b)
    records.append({'path':str(p.relative_to(ROOT)),'mode':mode,'direction':d,'action':action,'frame':t,'bbox':b,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
for d in DIRS:
 sheet=Image.new('RGBA',(800,800),(222,227,220,255))
 for action in range(4):
  for t in range(4):sheet.alpha_composite(Image.open(BASE/'combat-v2'/f'{d}-{action}-{t}.webp'),(t*200+20,action*200+25))
 sheet.save(BASE/'combat-v2'/f'contact-{d}.webp',quality=78,method=6)
# Four temporal snapshots and real-speed action-specific animated comparison grids.
for action,ms in enumerate([320,170,190,240]):
 anim=[]
 for t in range(4):
  sheet=Image.new('RGBA',(640,320),(222,227,220,255))
  for col,d in enumerate(DIRS):
   for row,v in enumerate([1,2]):sheet.alpha_composite(Image.open(BASE/f'combat-v{v}'/f'{d}-{action}-{t}.webp'),(col*160,row*160))
  anim.append(sheet)
 anim[0].save(BASE/'combat-v2'/f'review-action-{action}.webp',save_all=True,append_images=anim[1:],duration=ms,loop=0,quality=78,method=6)
meta={'frames':records,'scales':scales,'sources':SOURCES,'totalFrameBytes':sum(r['bytes'] for r in records),'totalBytes':sum(p.stat().st_size for mode in ['combat-v2','scenario-v2'] for p in (BASE/mode).glob('*.webp'))}
Path('/private/tmp/archer-v2-result.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
print(meta['totalFrameBytes'],meta['totalBytes'],len(records))
