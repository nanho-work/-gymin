from PIL import Image
from pathlib import Path
import json
from collections import deque

def figures(im):
 small=im.copy();small.thumbnail((640,640));w,h=small.size;mask=bytearray(small.getchannel('A').point(lambda x:255 if x>=48 else 0).tobytes());cs=[]
 for k in range(w*h):
  if not mask[k]:continue
  stack=[k];mask[k]=0;pts=[]
  while stack:
   i=stack.pop();pts.append(i);x=i%w;y=i//w
   for n in ([i-1] if x else [])+([i+1] if x<w-1 else [])+([i-w] if y else [])+([i+w] if y<h-1 else []):
    if mask[n]:mask[n]=0;stack.append(n)
  if len(pts)>100:cs.append(pts)
 cs=sorted(cs,key=len,reverse=True)[:16]
 if len(cs)!=16:raise ValueError('Expected16 connected bodies found '+str(len(cs)))
 cs.sort(key=lambda pts:sum(i//w for i in pts)/len(pts));out=[]
 for row in range(4):
  group=sorted(cs[row*4:row*4+4],key=lambda pts:sum(i%w for i in pts)/len(pts))
  for col,pts in enumerate(group):
   # Mask each connected unit; retain its original alpha rather than neighboring effects.
   m=Image.new('L',(w,h));buf=bytearray(w*h)
   for i in pts:buf[i]=255
   m.frombytes(bytes(buf));m=m.resize(im.size,Image.Resampling.NEAREST)
   from PIL import ImageChops,ImageFilter
   m=m.filter(ImageFilter.MaxFilter(5));cut=im.copy();cut.putalpha(ImageChops.multiply(im.getchannel('A'),m));box=cut.getbbox();out.append((row,col,cut.crop(box)))
 return out
if __name__=='__main__':
 p=json.load(open('/tmp/play-seven-hong-yu-se.json'));out=figures(Image.open(p['source']).convert('RGBA'));print([(r,c,x.size) for r,c,x in out])
