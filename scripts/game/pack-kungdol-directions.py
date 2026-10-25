from PIL import Image, ImageDraw
import numpy as np
from pathlib import Path
import json,sys,runpy
# Reuse connected-component extraction without executing the old packer's CLI.
root=Path(__file__).resolve().parents[2]
source=(root/'scripts/game/pack-kungdol-equipment.py').read_text().split('from pathlib import Path')[0]
ns={};exec(source,ns);label=ns['label']
out=root/'web/public/images/folklore/kungdol-equipment-v1'
records=[]
for direction,path in zip(['nw','ne','sw'],sys.argv[1:]):
 im=Image.open(path).convert('RGBA');w,h=im.size; cells=[]
 for row in range(8):
  for col in range(4):
   left,right=round(col*w/4),round((col+1)*w/4)
   strip=np.array(im)[:,left:right,3]; projection=(strip>80).sum(axis=1)
   def boundary(r):
    if r==0:return 0
    if r==8:return h
    middle=round(r*h/8);radius=round(h/8*.18);lo=middle-radius;hi=middle+radius
    vals=projection[lo:hi];candidates=np.where(vals==vals.min())[0]+lo
    return int(candidates[np.argmin(abs(candidates-middle))])
   top,bottom=boundary(row),boundary(row+1)
   horizontal=(np.array(im)[top:bottom,:,3]>80).sum(axis=0)
   def column_boundary(c):
    if c==0:return 0
    if c==4:return w
    mid=round(c*w/4);radius=round(w/4*.12);lo=mid-radius;hi=mid+radius
    values=horizontal[lo:hi];candidates=np.where(values==values.min())[0]+lo
    return int(candidates[np.argmin(abs(candidates-mid))])
   cell=im.crop((column_boundary(col),top,column_boundary(col+1),bottom))
   a=np.array(cell);labels,n=label(a[:,:,3]>80);counts=np.bincount(labels.ravel());counts[0]=0;mask=labels==counts.argmax();a[~mask,3]=0
   yy,xx=np.where(mask)
   foot=mask.copy();foot[:int(cell.height*.62)]=False;foot[:,:int(cell.width*.32)]=False;foot[:,int(cell.width*.75):]=False
   fy,fx=np.where(foot);ground=int(fy.max()) if len(fy) else int(yy.max())
   near=(fy>=ground-5);anchor=float(np.median(fx[near])) if near.any() else cell.width/2
   cells.append((row,col,Image.fromarray(a),xx,yy,ground,anchor))
 # Common scale for all poses and both weapons; match existing idle visible height.
 reference=Image.open(out/'pestle-se-0-0.webp');refbox=reference.getbbox();target=refbox[3]-refbox[1]
 heights=[yy.max()-yy.min()+1 for row,col,c,xx,yy,g,x in cells if row in (0,4)]
 scale=target/float(np.median(heights))
 # Keep all poses inside canvas with 4px padding; same scale across this direction.
 for row,col,c,xx,yy,g,x in cells:
  scale=min(scale,76/max(x-xx.min(),xx.max()+1-x,1),144/max(g+1-yy.min(),1))
 for row,col,c,xx,yy,g,anchor in cells:
  x=round(80-anchor*scale);y=round(148-(g+1)*scale)
  frame=Image.new('RGBA',(160,160));frame.paste(c.resize((round(c.width*scale),round(c.height*scale)),Image.Resampling.LANCZOS),(x,y))
  item='pestle' if row<4 else 'club';name=f'{item}-{direction}-{row%4}-{col}.webp';frame.save(out/name,'WEBP',quality=72,method=6)
  records.append({'file':name,'bytes':(out/name).stat().st_size,'scale':scale,'footAnchor':[anchor,g],'baseline':148})
 canvas=Image.new('RGB',(640,1280),(69,83,53));draw=ImageDraw.Draw(canvas)
 for row,col,*_ in cells:
  f=Image.open(out/f'{"pestle" if row<4 else "club"}-{direction}-{row%4}-{col}.webp');canvas.paste(f,(col*160,row*160),f)
  draw.line((col*160,row*160+148,(col+1)*160,row*160+148),fill=(100,120,90))
 canvas.save(f'/tmp/kungdol-{direction}-contact.jpg')
manifest={'frameSize':160,'baseline':148,'frames':records,'bytes':sum(r['bytes'] for r in records)}
(root/'scripts/game/kungdol-equipment-motion-directions-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(len(records),manifest['bytes'])
