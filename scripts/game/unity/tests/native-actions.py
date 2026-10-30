"""Protocol checks only. Test receipts do not assert audiovisual playback."""
import json, subprocess, sys
from pathlib import Path
root=Path(sys.argv[1]); p=subprocess.Popen([str(root/'sanha-battle'),str(root)],stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True,encoding='utf-8')
commands=0
feedback=[]

def send(command,allow_error=False,**args):
 global commands
 p.stdin.write(json.dumps(dict(command=command,**args))+'\n');p.stdin.flush();line=p.stdout.readline();commands+=1
 assert line, 'native host exited'
 state=json.loads(line)
 assert allow_error or state['ok'], state['error']
 return state

def receipts(state):
 for _ in range(10000):
  pending=state.get('pending')
  if not pending:return state
  if pending['kind']=='combatResult':
   for result in pending['results']:
    unit=next(u for u in state['units'] if u['id']==result['id'])
    assert unit['hp']==result['hpAfter'] and unit['mp']==result['mpAfter']
    feedback.append(result)
  args=dict(token=pending['token'])
  if pending['kind']=='tutorial':args['choice']=2
  if pending['kind']=='choice':args['choice']=1
  state=send('ack',**args)
 raise AssertionError('pending did not settle')

try:
 state=receipts(send('new'))
 for _ in range(160):
  if state['side']==0 and any(u['canAct'] for u in state['units']):break
  state=receipts(send('step'))
 assert state['round']==2 and state['stateVersion']==3
 before=state['units']; options=send('actions',id=0)
 assert options['units']==before and options['items']==[], 'opening inventory must not grant test consumables'
 wind=next(s for s in options['spells'] if s['id']==10)
 preview=send('aim',id=0,spell=10,target=-1)
 assert preview['hasAim'] and not preview['aim']['valid'] and preview['units']==before
 bad=send('cast',id=0,spell=10,target=0,allow_error=True)
 assert not bad['ok'] and bad['recoverable'] and not bad['hasPending'] and bad['units']==before
 selected=send('select',id=0)
 enemies=[u for u in selected['units'] if u['side']==1 and u['hp']>0 and not u['hidden']]
 king=next(u for u in selected['units'] if u['id']==0)
 cell=min(selected['range'],key=lambda c:min(abs(c['x']-e['x'])+abs(c['y']-e['y']) for e in enemies))
 if (cell['x'],cell['y'])!=(king['x'],king['y']):state=receipts(send('move',id=0,**cell))
 else:state=selected
 selected=send('actions',id=0); wind=next(s for s in selected['spells'] if s['id']==10)
 assert wind['enabled'], 'reachable wind target expected in original opening'
 preview=send('aim',id=0,spell=10,target=-1)
 target=preview['aim']['targets'][0]
 aimed=send('aim',id=0,spell=10,target=target)
 assert aimed['aim']['valid'] and aimed['aim']['area'] and aimed['aim']['affected']
 mp=next(u for u in aimed['units'] if u['id']==0)['mp']
 state=send('cast',id=0,spell=10,target=target)
 assert state['hasPending'] and state['pending']['kind']=='spell'
 token=state['pending']['token']; rejected=send('ack',token='wrong-token',allow_error=True)
 assert not rejected['ok'] and rejected['pending']['token']==token
 state=receipts(state);king=next(u for u in state['units'] if u['id']==0)
 assert any(r['id']==0 and r['mpAfter']-r['mpBefore']==-wind['cost'] for r in feedback), 'MP cost feedback missing'
 assert king['mp']==mp-wind['cost'] and king['acted'] and state['pendingMove']==-1
 print('PASS native JSON actions: round-2 arrival, learned skills, empty inventory, nonmutating aim, recoverable rejection, legal target and area, staged cast, stale receipt protection, one MP debit and authoritative feedback; commands='+str(commands))
finally:
 p.stdin.close();p.terminate();p.wait(timeout=5)
