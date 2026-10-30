import json,subprocess
from pathlib import Path
import sys
root=Path(sys.argv[1])
p=subprocess.Popen([str(root/'sanha-battle'),str(root)],stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True)
count=0

def q(cmd,**kw):
 global count
 p.stdin.write(json.dumps(dict(command=cmd,**kw))+'\n');p.stdin.flush();line=p.stdout.readline()
 if not line:raise RuntimeError('host exited')
 s=json.loads(line);count+=1
 if not s['ok']:raise RuntimeError(s['error'])
 return s

def receipts(s):
 for i in range(10000):
  a=s.get('pending')
  if not a:return s
  kw=dict(token=a['token'])
  if a['kind']=='tutorial':kw['choice']=2
  if a['kind']=='choice':kw['choice']=1
  s=q('ack',**kw)
 raise RuntimeError('too many boundaries')

# This driver supplies test receipts; audiovisual playback is tested separately in Unity.
s=q('new')
while not s.get('pending'):s=q('step')
old=s['pending']['token'];before=(s['round'],s['side'])
p.stdin.write(json.dumps(dict(command='ack',token='invalid-token'))+'\n');p.stdin.flush();bad=json.loads(p.stdout.readline())
assert not bad['ok'] and bad['pending']['token']==old and (bad['round'],bad['side'])==before
s=receipts(s)
for i in range(160):
 if s['side']==0 and any(u['canAct']for u in s['units']):break
 s=receipts(q('step'))
print('Arrival:',s['round'],s['side'],[(u['id'],u['x'],u['y'])for u in s['units']if u['id'] in [0,258,259]],'commands',count)
king=next(u for u in s['units']if u['id']==0);origin=(king['x'],king['y']);s=q('select',id=0)
cell=next(c for c in s['range']if(c['x'],c['y'])!=origin)
s=receipts(q('move',id=0,**cell));assert s['pendingMove']==0
s=receipts(q('cancel'));king=next(u for u in s['units']if u['id']==0);assert(king['x'],king['y'])==origin
s=receipts(q('wait',id=0));assert next(u for u in s['units']if u['id']==0)['acted'];print('Move/cancel/wait: PASS')
for i in range(1500):
 if s['outcome']!='battle':break
 if s['side']!=0:s=receipts(q('step'));continue
 actors=[u for u in s['units'] if u['canAct']]
 if not actors:s=receipts(q('end'));continue
 actor=actors[0];s=q('select',id=actor['id'])
 if not s['targets'] and not actor['moved']:
  enemies=[u for u in s['units'] if not u['hidden'] and u['hp']>0 and u['side']==1]
  cells=s['range']
  if enemies and cells:
   best=min(cells,key=lambda c:(min(abs(c['x']-e['x'])+abs(c['y']-e['y']) for e in enemies),c['y'],c['x']))
   if (best['x'],best['y'])!=(actor['x'],actor['y']):s=receipts(q('move',id=actor['id'],**best));s=q('select',id=actor['id'])
 if s['targets']:s=receipts(q('attack',id=actor['id'],target=s['targets'][0]))
 else:s=receipts(q('wait',id=actor['id']))
print('Finish:',s['outcome'],'round',s['round'],'commands',count,'unsupported',s['unsupported'],'inventory',s['inventory'],'money',s['money'])
assert s['outcome'] in ['victory','defeat']
Path(sys.argv[2]).write_text(json.dumps({'arrivalRound':2,'moveCancelWait':'PASS','outcome':s['outcome'],'round':s['round'],'commands':count,'unsupported':s['unsupported'],'log':s['log'],'scope':'headless receipt driver; not audiovisual verification'},ensure_ascii=False,indent=2))
p.terminate()
