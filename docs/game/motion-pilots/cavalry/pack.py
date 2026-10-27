from pathlib import Path
import json, math, statistics
from PIL import Image, ImageFilter, ImageDraw
import numpy as np

ROOT=Path('/Users/choenamho/Documents/GitHub/-gymin')
OUT=ROOT/'web/public/images/class-motion-pilot/cavalry/job-9'
DOC=ROOT/'docs/game/motion-pilots/cavalry'
SRC=Path('/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209')
SOURCES={
'se':'exec-443a99de-8138-4f6f-a130-44457fa03b84.png',
'sw':'exec-8b36883a-6741-4630-854c-75d44b1271cb.png',
'nw':'exec-90ae4e51-6ede-4363-bb68-f2a3d395ab9c.png',
'ne':'exec-eb2e2f9f-bf10-49c6-8807-18caaa291e64.png',
'scenario':'exec-3a602ed0-6f28-4a71-80f8-216a569f208d.png',
'weakened':'exec-2807dbfa-4d4b-4e66-ab5f-5e0e1c7f2e40.png'
}
DIRS=['nw','ne','se','sw']
def components(im):
    a=np.array(im.getchannel('A'))
    mask=a>24
    h,w=mask.shape
    labels=np.zeros((h,w),np.int32)
    comps=[]
    for y,x in zip(*np.where(mask)):
        if labels[y,x]: continue
        idx=len(comps)+1
        stack=[(int(y),int(x))]
        labels[y,x]=idx
        pts=[]
        while stack:
            yy,xx=stack.pop();pts.append((yy,xx))
            for dy,dx in ((-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)):
                ny,nx=yy+dy,xx+dx
                if 0<=ny<h and 0<=nx<w and mask[ny,nx] and labels[ny,nx]==0:
                    labels[ny,nx]=idx;stack.append((ny,nx))
        comps.append((len(pts),idx,np.mean(pts,axis=0)))
    big=sorted(comps,reverse=True,key=lambda v:v[0])[:16]
    assert len(big)==16 and big[-1][0]>1000
    big.sort(key=lambda v:v[2][0])
    ordered=[]
    for r in range(4): ordered+=sorted(big[r*4:r*4+4],key=lambda v:v[2][1])
    sprites=[]
    for _,idx,_ in ordered:
        # Retain antialiasing just outside connected foreground; remove isolated specks.
        m=Image.fromarray(np.uint8(labels==idx)*255).filter(ImageFilter.MaxFilter(5))
        ar=np.array(im).copy();ar[:,:,3]=np.minimum(ar[:,:,3],np.array(m))
        clean=Image.fromarray(ar)
        box=clean.getbbox()
        sprites.append(clean.crop(box))
    return sprites

records=[]; technical={}
for key,source in SOURCES.items():
    imgs=components(Image.open(SRC/source).convert('RGBA'))
    if key=='weakened':
        # Whole-frame reassignment, no mirror or body/weapon compositing:
        # generated r3c4 is SW and r4c4 is SE.
        imgs[11],imgs[15]=imgs[15],imgs[11]
    idle=imgs[:4] if key in DIRS else imgs
    target=112 if key=='scenario' else 128
    scale=min(target/statistics.median(im.height for im in idle),140/max(im.height for im in imgs),140/max(im.width for im in imgs))
    technical[key]={'scale':scale,'sourceDimensions':list(Image.open(SRC/source).size),'bodyHeightRange':[round(min(im.height for im in idle)*scale),round(max(im.height for im in idle)*scale)]}
    packed=[]
    folder='combat-v1' if key in DIRS else key+'-v1'
    for i,im in enumerate(imgs):
        direction=key if key in DIRS else DIRS[i//4]
        action=i//4 if key in DIRS else 0
        frame=i%4
        im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
        a=np.array(im.getchannel('A'));a[a<8]=0;im.putalpha(Image.fromarray(a))
        # Foot-region center stabilizes ground pivot without per-frame scale changes.
        yy,xx=np.where(a>64); lower=xx[yy>=im.height-12]
        footx=(float(lower.min())+float(lower.max()))/2 if len(lower) else im.width/2
        x=round(80-footx);x=max(8,min(x,152-im.width))
        y=150-im.height
        canvas=Image.new('RGBA',(160,160));canvas.alpha_composite(im,(x,y))
        path=OUT/folder/f'{direction}-{action}-{frame}.webp'
        canvas.save(path,'WEBP',quality=78,method=6)
        check=Image.open(path).convert('RGBA');bbox=check.getbbox()
        assert check.size==(160,160) and check.getchannel('A').getextrema()==(0,255)
        assert bbox[0]>=7 and bbox[1]>=9 and bbox[2]<=153 and bbox[3]<=150,(path,bbox)
        records.append({'path':str(path.relative_to(ROOT)),'direction':direction,'action':action,'frame':frame,'bytes':path.stat().st_size,'bbox':bbox})
        packed.append(check)
    sheet=Image.new('RGBA',(896,896),(225,225,220,255))
    for i,im in enumerate(packed):sheet.alpha_composite(im,((i%4)*224+32,(i//4)*224+32))
    sheet.save(OUT/folder/f'contact-{key}.webp','WEBP',quality=78,method=6)
    print(key,technical[key],flush=True)
for folder,actions,times in [('combat-v1',range(4),[320,170,190,240]),('scenario-v1',[0],[360]),('weakened-v1',[0],[300])]:
    for action in actions:
        seq=[]
        for frame in range(4):
            grid=Image.new('RGBA',(640,160))
            for j,d in enumerate(DIRS):
                grid.alpha_composite(Image.open(OUT/folder/f'{d}-{action}-{frame}.webp').convert('RGBA'),(j*160,0))
            seq.append(grid)
        seq[0].save(OUT/folder/f'preview-{action}.webp','WEBP',save_all=True,append_images=seq[1:],duration=times[action],loop=0,quality=78,method=6)
manifest={'jobId':9,'jobName':'경기병','status':'visual-draft-review-required','outputRoot':str(OUT.relative_to(ROOT)),'directions':DIRS,'combatActions':4,'scenarioActions':1,'weakenedActions':1,'framesPerAction':4,'totalFrames':96,'frameSize':[160,160],'anchor':{'x':80,'groundY':150,'method':'lower-foot-region alignment; one fixed scale per source sheet'},'ms':{'idle':320,'move':170,'attack':190,'skill':240,'scenario':360,'weakened':300},'totalBytes':sum(r['bytes'] for r in records),'previewBytes':sum(p.stat().st_size for p in OUT.rglob('*.webp') if p.name.startswith(('contact-','preview-'))),'technical':technical,'files':records,'limitations':['시각 초안이며 게임 판정·UI 연결 미구현','방향별 세부 복식·말 크기·손 가림과 4프레임 연결은 사용자 검토 필요','공격·스킬 시 기마 자세 변형과 프레임 전환의 잔여 튐이 있음','승급, 하마 이동·공격·쇠약 및 다른 병과 미제작']}
(DOC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('frames',len(records),'bytes',manifest['totalBytes'],'previews',manifest['previewBytes'])
