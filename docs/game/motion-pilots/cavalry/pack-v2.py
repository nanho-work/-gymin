"""Technical extraction only; no drawing, mirroring, part compositing, or per-action scale.
Re-running needs the recorded generated sources, which are cleaned after review.
"""
from pathlib import Path
import json,statistics,hashlib,shutil
from PIL import Image,ImageFilter
import numpy as np
ROOT=Path('/Users/choenamho/Documents/GitHub/-gymin')
DOC=ROOT/'docs/game/motion-pilots/cavalry'
OUT=ROOT/'web/public/images/class-motion-pilot/cavalry/job-9'
SRC=Path('/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209')
SOURCES={
'se':'exec-2913c1a3-332e-471f-8760-86f0c289264a.png',
'nw':'exec-d2a53429-14ef-458c-9446-1aee8d4eb488.png',
'sw':'exec-910257a9-0c13-42f2-9d06-91c780d06c01.png',
'ne':'exec-73ec0cc6-701d-4a47-9a12-eee36e93844b.png'}
DIRS=['nw','ne','se','sw']
# Reuse v1's extraction routine without executing its write operations.
source=(DOC/'pack.py').read_text().split('records=[]; technical={}')[0]
scope={}
exec(source.replace('[:16]','[:20]').replace('len(big)==16','len(big)==20').replace('range(4): ordered','range(5): ordered'),scope)
components=scope['components']
previous=json.loads((DOC/'manifest.json').read_text())
if previous.get('version')==2: previous=previous['previousVersions']['v1']
old_hashes={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for m in ['combat','scenario','weakened'] for p in (OUT/(m+'-v1')).glob('*.webp')}
records=[];technical={};warnings=[]
for d,fn in SOURCES.items():
 imgs=components(Image.open(SRC/fn).convert('RGBA'))
 assert len(imgs)==20
 # Whole corrected frames only; source-resolution normalization.
 if d=='se':
  fixes=components(Image.open(SRC/'exec-e632f6ef-59f4-4ad6-8a78-5a56e4a1f7be.png').convert('RGBA'))
  norm=statistics.median(im.height for im in imgs[:4])/statistics.median(im.height for im in fixes[:4])
  for idx in [13,14]:
   fix=fixes[idx]
   imgs[idx]=fix.resize((round(fix.width*norm),round(fix.height*norm)),Image.Resampling.LANCZOS)
 if d=='nw':
  fixes=components(Image.open(SRC/'exec-7e87a7c4-c124-4e80-b874-3d98b0862b3e.png').convert('RGBA'))
  norm=statistics.median(im.height for im in imgs[:4])/statistics.median(im.height for im in fixes[:4])
  fix=fixes[14]
  imgs[14]=fix.resize((round(fix.width*norm),round(fix.height*norm)),Image.Resampling.LANCZOS)
 if d=='sw':
  oldIdle=[]
  for f in range(4):
   old=Image.open(OUT/'combat-v1'/f'sw-0-{f}.webp').convert('RGBA')
   box=old.getbbox();oldIdle.append(box[3]-box[1])
  norm=statistics.median(im.height for im in imgs[:4])/statistics.median(oldIdle)
  for f in range(4):
   old=Image.open(OUT/'combat-v1'/f'sw-1-{f}.webp').convert('RGBA')
   fix=old.crop(old.getbbox())
   imgs[4+f]=fix.resize((round(fix.width*norm),round(fix.height*norm)),Image.Resampling.LANCZOS)
 # Body idle, not attack/weapon extremity, determines one scale for all modes.
 scale=128/statistics.median(im.height for im in imgs[:4])
 technical[d]={'scale':scale,'idleHeightPixels':[round(im.height*scale) for im in imgs[:4]],'maxSilhouettePixels':[round(max(im.width for im in imgs)*scale),round(max(im.height for im in imgs)*scale)],'source':fn}
 for i,im in enumerate(imgs):
  mode='combat' if i<16 else 'weakened'
  action=i//4 if i<16 else 0;frame=i%4
  im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
  a=np.array(im.getchannel('A'));a[a<8]=0;im.putalpha(Image.fromarray(a))
  # Align horse trunk, not moving hoof span: fixed band above ground.
  yy,xx=np.where(a>96)
  trunk=xx[(yy>=im.height-75)&(yy<im.height-45)]
  anchor=float(np.median(trunk)) if len(trunk) else im.width/2
  x=round(80-anchor)+(-3 if d=='ne' else 0);y=150-im.height
  if x<6 or x+im.width>154:
   warnings.append(f'{d}-{action}-{frame} horizontal anchor adjusted')
   x=max(6,min(x,154-im.width))
  assert im.width<=140 and im.height<=140,(d,i,im.size)
  canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(im,(x,y))
  p=OUT/(mode+'-v2')/f'{d}-{action}-{frame}.webp'
  canvas.save(p,'WEBP',quality=78,method=6)
  check=Image.open(p).convert('RGBA');bbox=check.getbbox()
  assert bbox and bbox[0]>=5 and bbox[1]>=1 and bbox[2]<=155 and bbox[3]<=150,(p,bbox)
  records.append({'path':str(p.relative_to(ROOT)),'mode':mode,'direction':d,'action':action,'frame':frame,'bytes':p.stat().st_size,'bbox':list(bbox),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
 print(d,technical[d],flush=True)
# Scenario is unaffected; complete mode supplied byte-for-byte.
for d in DIRS:
 for f in range(4):
  src=OUT/'scenario-v1'/f'{d}-0-{f}.webp';p=OUT/'scenario-v2'/src.name
  shutil.copyfile(src,p)
  records.append({'path':str(p.relative_to(ROOT)),'mode':'scenario','direction':d,'action':0,'frame':f,'bytes':p.stat().st_size,'bbox':list(Image.open(p).getbbox()),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'reusedFrom':str(src.relative_to(ROOT))})
# Stationary modes share a lower-horse x anchor. Translation only, no resizing.
alignment={}
for d in DIRS:
 entries=[]
 for mode,acts in [('combat',[0,2,3]),('weakened',[0])]:
  for action in acts:
   for f in range(4):
    p=OUT/(mode+'-v2')/f'{d}-{action}-{f}.webp'
    im=Image.open(p).convert('RGBA');a=np.array(im.getchannel('A'))
    yy,xx=np.where(a[95:150]>64);center=float(xx.mean());b=im.getbbox()
    entries.append((p,im,center,b,mode,action,f))
 low=max(c+8-b[0] for p,im,c,b,mo,ac,f in entries)
 high=min(c+152-b[2] for p,im,c,b,mo,ac,f in entries)
 assert low<=high
 idleCenter=statistics.median(c for p,im,c,b,mo,ac,f in entries if mo=='combat' and ac==0)
 target=min(high,max(low,idleCenter))
 shifts={}
 for p,im,c,b,mo,ac,f in entries:
  dx=round(target-c)
  if dx:
   canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(im,(dx,0))
   canvas.save(p,'WEBP',quality=78,method=6)
  shifts[p.name+':'+mo]=dx
 # A constant direction offset preserves the walk's relative stepping.
 walkDx=round(target-idleCenter)
 if walkDx:
  for f in range(4):
   p=OUT/'combat-v2'/f'{d}-1-{f}.webp'
   im=Image.open(p).convert('RGBA');b=im.getbbox()
   assert b[0]+walkDx>=2 and b[2]+walkDx<=158
   canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(im,(walkDx,0))
   canvas.save(p,'WEBP',quality=78,method=6)
 alignment[d]={'stationaryLowerHorseX':round(target,3),'walkConstantOffset':walkDx,'translations':shifts}
for r in records:
 p=ROOT/r['path'];im=Image.open(p)
 r['bbox']=list(im.getbbox());r['bytes']=p.stat().st_size;r['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()

# Contacts and animation strips, sources for visual review.
for mode,actions,times in [('combat',range(4),[320,170,190,240]),('scenario',[0],[360]),('weakened',[0],[300])]:
 folder=OUT/(mode+'-v2')
 for action in actions:
  sheet=Image.new('RGBA',(896,896),(228,228,222,255))
  seq=[]
  for f in range(4):
   anim=Image.new('RGBA',(640,160))
   for row,d in enumerate(DIRS):
    im=Image.open(folder/f'{d}-{action}-{f}.webp').convert('RGBA')
    sheet.alpha_composite(im,(f*224+32,row*224+32))
    anim.alpha_composite(im,(row*160,0))
   seq.append(anim)
  sheet.save(folder/f'contact-{action}.webp','WEBP',quality=78,method=6)
  seq[0].save(folder/f'preview-{action}.webp','WEBP',save_all=True,append_images=seq[1:],duration=times[action],loop=0,quality=78,method=6)
# Whole-image loop seam and lower-horse alignment diagnostics; not visual pass criteria.
metrics=[]
for version in [1,2]:
 for mode,actions in [('combat',[0,2,3]),('weakened',[0])]:
  for d in DIRS:
   for action in actions:
    ims=[np.array(Image.open(OUT/(mode+f'-v{version}')/f'{d}-{action}-{f}.webp').convert('RGBA')) for f in [0,3]]
    mask=[a[:,:,3]>64 for a in ims]
    union=mask[0]|mask[1]
    xor=mask[0]^mask[1]
    lower=[]
    for a in ims:
     yy,xx=np.where(a[95:150,:,3]>64)
     lower.append([float(xx.mean()),float(yy.mean()+95)])
    metrics.append({'version':version,'mode':mode,'direction':d,'action':action,'loopSilhouetteXorRatio':round(float(xor.sum()/max(1,union.sum())),4),'lowerHorseCentroidShift':round(float(np.linalg.norm(np.array(lower[0])-lower[1])),3)})
for path,h in old_hashes.items(): assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==h
assert len(records)==96
for r in records:
 im=Image.open(ROOT/r['path'])
 assert im.size==(160,160) and im.mode=='RGBA'
 assert im.getchannel('A').getextrema()==(0,255)
previewBytes=sum(p.stat().st_size for mode in ['combat','scenario','weakened'] for p in (OUT/(mode+'-v2')).glob('*.webp') if p.name.startswith(('contact-','preview-')))
m={'jobId':9,'jobName':'경기병','version':2,'status':'review-in-progress','outputRoot':str(OUT.relative_to(ROOT)),'modes':{mode:{'path':str((OUT/(mode+'-v2')).relative_to(ROOT)),'actions':4 if mode=='combat' else 1,'frames':64 if mode=='combat' else 16,'bytes':sum(r['bytes'] for r in records if r['mode']==mode)} for mode in ['combat','scenario','weakened']},'directions':DIRS,'framesPerAction':4,'totalFrames':96,'frameSize':[160,160],'anchor':{'x':80,'groundY':150,'method':'horse trunk band centered; one idle-height128 scale per direction shared across combat+weakened'},'ms':previous['ms'],'totalBytes':sum(r['bytes'] for r in records),'previewBytes':previewBytes,'technical':technical,'warnings':warnings,'stationaryAlignment':alignment,'files':records,'loopDiagnostics':metrics,'validation':{'sizeAlphaCount':'passed','v1Preserved':True,'v1ImageHashes':old_hashes,'scenarioReused':16,'visualReview':'pending'},'previousVersions':{'v1':previous}}
m['totalImageBytes']=m['totalBytes']+previewBytes
(DOC/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2))
print('saved',m['totalBytes'],previewBytes,'warnings',warnings)
