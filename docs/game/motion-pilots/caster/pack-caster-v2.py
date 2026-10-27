# Historical source path; replace after image regeneration.
from PIL import Image
from pathlib import Path
import json,shutil,hashlib,numpy as np
R=Path('/Users/choenamho/Documents/GitHub/-gymin');B=R/'web/public/images/class-motion-pilot/caster/job-24';D=R/'docs/game/motion-pilots/caster'
config={'prompt': "Use case identity-preserve. Create corrected FOUR FRAME fan attack animation of this exact male strategist. Image1 is idle identity/scale/clothes reference; image2 is extended attack pose reference. Render ONE ROW FOUR COLUMNS, equal square cells on transparent wide sheet. All face SOUTHWEST front LEFT 7 o'clock. Same youthful face, black scholar cap, navy robe cream cuffs, brown belt/pouch, black boots. Fan ALWAYS anatomical right hand on far screen-left arm; near left arm is empty. No mirroring. Entire connected character every frame, no body parts collage. Frame0: upright preparation matching image1, right elbow bent, fan held CLOSE TO CHEST vertically. Frame1: modest forward casting windup, right forearm extends halfway left at waist, torso leans slightly. Frame2: full forward release matching image2, fan extended LEFT, left palm outward. Frame3 IMPORTANT: RECOVER, torso upright, right elbow firmly BENT and tucked toward ribs, fan RETURNED CLOSE TO CHEST vertical, empty left hand LOWERED by waist, feet and head return almost exactly to frame0 position. Frame3 must NOT retain extended right arm. Loop3->0 should have minimal changes. All figures same body and head scale, planted boots same anchor, no camera drift. Fixed cap width across4 frames. Each whole figure fits middle65% cell with at least15% transparent margins. Crisp hand-painted outlined tactical RPG style matching references, no glow shadows text grid. Real alpha transparency.", 'source': '/Users/choenamho/.codex/generated_images/01a17856-8c7e-7c01-a9e0-65866e76c69b/exec-bebb953f-621c-4473-ba9e-c4b688e9f957.png'};src=Image.open(config['source']).convert('RGBA');a=np.array(src.getchannel('A'));ids=np.where((a>30).sum(axis=0)>8)[0];groups=[]
for x in ids:
 if not groups or x>groups[-1][-1]+7:groups.append([int(x)])
 else:groups[-1].append(int(x))
assert len(groups)==4
crops=[]
for g in groups:
 cell=src.crop((g[0]-5,0,g[-1]+6,src.height));arr=np.array(cell);arr[:,:,3][arr[:,:,3]<20]=0;cell=Image.fromarray(arr);b=cell.getbbox();assert b[0]>0 and b[2]<cell.width
 crops.append(cell.crop(b))
scale=112/((crops[0].height+crops[3].height)/2)
O=B/'combat-v2';O.mkdir(exist_ok=True)
for p in (B/'combat-v1').glob('*-*-*.webp'):
 if p.name.split('-')[0] in ['nw','ne','se','sw']:shutil.copy2(p,O/p.name)
for f,im in enumerate(crops):
 ar=np.array(im.getchannel('A'));ys,xs=np.where((ar>80)&(np.indices(ar.shape)[0]>=im.height-round(im.height*.065)));anchor=(xs.min()+xs.max()+1)/2
 w,h=round(im.width*scale),round(im.height*scale);x=round(80-anchor*scale);y=150-h
 assert x>4 and x+w<156 and y>4,(f,x,y,w,h)
 canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(im.resize((w,h),Image.Resampling.LANCZOS),(x,y));canvas.save(O/f'sw-2-{f}.webp','WEBP',quality=78,method=6)
# Before/after sequences, with duplicate frame0 after3 to expose seam.
review=Image.new('RGBA',(1000,400),(211,213,202,255))
for row,folder in enumerate(['combat-v1','combat-v2']):
 for col,f in enumerate([0,1,2,3,0]):review.alpha_composite(Image.open(B/folder/f'sw-2-{f}.webp').convert('RGBA'),(col*200+20,row*200+20))
review.save(O/'review-sw-attack-v1-v2.webp','WEBP',quality=78,method=6)
frames=[]
for f in range(4):
 canvas=Image.new('RGBA',(320,200),(211,213,202,255))
 for col,folder in enumerate(['combat-v1','combat-v2']):canvas.alpha_composite(Image.open(B/folder/f'sw-2-{f}.webp').convert('RGBA'),(col*160,20))
 frames.append(canvas)
frames[0].save(O/'review-sw-attack-loop.webp','WEBP',save_all=True,append_images=frames[1:],duration=190,loop=0,quality=78,method=6)
# Lightweight final generated source retained.
source=src.copy();source.thumbnail((1024,1024));source.save(O/'source-sw-attack.webp','WEBP',quality=78,method=6)
files=[]
for d in ['nw','ne','se','sw']:
 for act in range(4):
  for f in range(4):
   p=O/f'{d}-{act}-{f}.webp';im=Image.open(p);bb=im.getbbox();assert im.size==(160,160) and 'A' in im.getbands() and bb[3]==150 and bb[0]>0 and bb[2]<160
   files.append({'path':str(p.relative_to(R)),'direction':d,'action':act,'frame':f,'bytes':p.stat().st_size,'bbox':bb,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'changed':d=='sw' and act==2})
info={'files':files,'bytes':sum(f['bytes'] for f in files),'scale':scale,'prompt':config['prompt'],'source':config['source'],'sourceSha256':hashlib.sha256(Path(config['source']).read_bytes()).hexdigest()}
Path('/private/tmp/caster-v2-result.json').write_text(json.dumps(info,ensure_ascii=False,indent=2));print(json.dumps({'frames':len(files),'bytes':info['bytes'],'newBboxes':[f['bbox'] for f in files if f['changed']]}))
