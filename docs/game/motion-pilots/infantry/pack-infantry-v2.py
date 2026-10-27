from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import numpy as np,json,hashlib,shutil
ROOT=Path('/Users/choenamho/Documents/GitHub/-gymin');BASE=ROOT/'web/public/images/class-motion-pilot/infantry/job-3';DOC=ROOT/'docs/game/motion-pilots/infantry';GEN=Path('/Users/choenamho/.codex/generated_images/01a17855-cacd-7c31-8fdc-2641cce03737')
DIRS=['nw','ne','se','sw'];records=[]
attack={'nw':('exec-cef91515-fd9c-4f59-836f-b5de8c9d2daa.png',418),'ne':('exec-722f0e75-223f-4080-9cf9-496e0ab11ca6.png',408),'se':('exec-9db00064-db3b-4ec6-ad67-3f6acdc663de.png',455),'sw':('exec-818d468f-c0f6-4068-947c-3d7a737e3d2c.png',467)}
skill={'nw':('exec-c6a73dc6-37c4-4bf7-9d5d-17502405d2bf.png',418),'sw':('exec-ae80a2a4-a6cd-475f-9ca6-e2c000b3aa9f.png',485)}
# Crop equal cells only where source visual inspection confirms separated silhouettes.
def source_frames(src,ncols,nrows):
 im=Image.open(GEN/src).convert('RGBA');result=[]
 for r in range(nrows):
  for c in range(ncols):
   tile=im.crop((round(c*im.width/ncols),round(r*im.height/nrows),round((c+1)*im.width/ncols),round((r+1)*im.height/nrows)))
   a=np.asarray(tile)[:,:,3]; yy,xx=np.where(a>40);box=(max(0,int(xx.min())-2),max(0,int(yy.min())-2),min(tile.width,int(xx.max())+3),min(tile.height,int(yy.max())+3))
   result.append(tile.crop(box))
 return result
new={}
for d,(src,h) in attack.items():
 for f,im in enumerate(source_frames(src,2,2)):new[(d,2,f)]=(im,112/h,src)
for d,(src,h) in skill.items():
 for f,im in enumerate(source_frames(src,2,2)):new[(d,3,f)]=(im,112/h,src)
ss='exec-4e16e03a-73ca-493d-a50f-12174810bec5.png';cells=source_frames(ss,4,4)
for row,d,h in [(1,'ne',240),(2,'se',241)]:
 for f in range(4):new[(d,3,f)]=(cells[row*4+f],112/h,ss)
def clean_component(im):
 a=np.array(im);m=a[:,:,3]>40;seen=np.zeros(m.shape,bool);best=[];h,w=m.shape
 for y,x in zip(*np.where(m)):
  if seen[y,x]:continue
  stack=[(y,x)];seen[y,x]=1;pts=[]
  while stack:
   yy,xx=stack.pop();pts.append((yy,xx))
   for ny in range(max(0,yy-1),min(h,yy+2)):
    for nx in range(max(0,xx-1),min(w,xx+2)):
     if m[ny,nx] and not seen[ny,nx]:seen[ny,nx]=1;stack.append((ny,nx))
  if len(pts)>len(best):best=pts
 mask=np.zeros(m.shape,np.uint8)
 for y,x in best:mask[y,x]=255
 mask=np.asarray(Image.fromarray(mask).filter(ImageFilter.MaxFilter(3)))>0
 a[:,:,3]*=mask
 return Image.fromarray(a)
def center(im):
 a=np.asarray(im).astype(float);r,g,b,al=a[:,:,0],a[:,:,1],a[:,:,2],a[:,:,3]
 mask=(al>180)&(r>g*1.12)&(g>b*1.08)&(r<160)
 mask[:82,:]=False;mask[112:,:]=False
 yy,xx=np.where(mask)
 if len(xx)<20:raise Exception('missing armor anchor')
 return float(np.median(xx))
for mode in ['combat','scenario']:
 out=BASE/(mode+'-v2');out.mkdir(exist_ok=True)
 for d in DIRS:
  for act in range(4 if mode=='combat' else 1):
   for f in range(4):
    name=f'{d}-{act}-{f}.webp';old=BASE/(mode+'-v1')/name
    if mode=='combat' and (d,act,f) in new:
     im,scale,src=new[d,act,f];im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
     im=clean_component(im);yy,xx=np.where(np.asarray(im)[:,:,3]>40);canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(im,(round(80-im.width/2),150-int(yy.max())))
     origin='imagegen:'+src
    else:canvas=Image.open(old).convert('RGBA');scale=1;origin=str(old.relative_to(ROOT))
    cx=center(canvas);dx=round(80-cx);a=np.asarray(canvas);yy,xx=np.where(a[:,:,3]>40)
    dx=max(5-int(xx.min()),min(dx,154-int(xx.max())))
    dest=Image.new('RGBA',(160,160));dest.alpha_composite(canvas,(dx,0));dest.save(out/name,'WEBP',quality=78,method=6)
    final=Image.open(out/name).convert('RGBA');yy,xx=np.where(np.asarray(final)[:,:,3]>40)
    records.append({'mode':mode,'direction':d,'action':act,'frame':f,'path':str((out/name).relative_to(ROOT)),'bytes':(out/name).stat().st_size,'source':origin,'translationX':dx,'scale':scale,'torsoCenterBefore':cx,'torsoCenterAfter':center(final),'footY':int(yy.max()),'alphaBounds':final.getchannel('A').getbbox()})
 for d in DIRS:
  acts=4 if mode=='combat' else 1
  sheet=Image.new('RGBA',(800,160*acts))
  for act in range(acts):
   frames=[Image.open(out/f'{d}-{act}-{f}.webp').convert('RGBA') for f in range(4)]
   for j,f in enumerate([0,1,2,3,0]):sheet.alpha_composite(frames[f],(j*160,act*160))
   frames[0].save(out/f'review-{d}-{act}-loop.webp',save_all=True,append_images=frames[1:],duration=([320,170,190,240][act] if mode=='combat' else 360),loop=0,quality=78,method=6)
  sheet.save(out/f'review-{d}-sequence.webp','WEBP',quality=78,method=6)
# Comparison visual: red vertical line=target torso x80; top v1, bottom v2.
comp=Image.new('RGBA',(640,320))
for col,d in enumerate(DIRS):
 for row,v in enumerate([1,2]):comp.alpha_composite(Image.open(BASE/f'combat-v{v}'/f'{d}-0-0.webp').convert('RGBA'),(160*col,160*row))
ImageDraw.Draw(comp).line((0,150,640,150),fill=(200,100,100,150))
comp.save(BASE/'combat-v2/review-centers.webp','WEBP',quality=78,method=6)
Path('/private/tmp/infantry-v2-records.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
print('Frames',len(records),'bytes',sum(r['bytes'] for r in records),'max center deviation',max(abs(r['torsoCenterAfter']-80) for r in records))
