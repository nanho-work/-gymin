import pathlib,json,re,hashlib
repo=pathlib.Path(__file__).resolve().parents[2];docs=repo/'docs/game/scenario-production-v1';source=pathlib.Path(__import__('os').environ['JOJO_ASSETS']);out=pathlib.Path(__import__('os').environ.get('STORY_OUTPUT','/tmp/story-site'));out.mkdir(exist_ok=True)
plan=json.load(open(docs/'scenario-plan.json'));assets=json.load(open(docs/'asset-inventory.json'));names=json.load(open(source/'manifest.json'))['terrainNames'];contracts=json.load(open(docs/'battle-contracts.json'))
imagefiles={a['file']:a['relativePath']for a in assets['backgrounds']}
for a in assets['maps']:imagefiles[a['image']]=a['image']
def condtext(cs):
 result=[]
 for c in cs:
  op=c.get('op');a=c.get('args',[])
  if op in [0,2]:continue
  if op==63 and len(a)==2:result.append(f'{a[0]}턴 '+({0:'이상',1:'미만',2:'일치'}.get(a[1],'조건')))
  elif op in [37,38]:result.append('지정 유닛의 위치·구역 조건')
  elif op in [66,67]:result.append('승패·유닛 상태 조건')
  else:result.append('선택·진행 상태 조건 (세부 연결 확인 필요)')
 return list(dict.fromkeys(result))
def rewards(file):
 d=json.load(open(source/'campaign'/file));result=[]
 def walk(nodes,cs,ref):
  for n in nodes:
   op=n.get('op');a=n.get('args',[])
   if op in [61,89] and all(isinstance(x,int)for x in a):
    ids=[];gold=None
    if op==61 and len(a)==4 and 0<=a[0]<104:ids=[{'id':a[0],'level':a[1]}]
    elif op==89 and len(a)==8:
     ids=[{'id':a[k]&255,'level':a[k+1]}for k in [1,3,5]if a[k]!=65535 and 0<=(a[k]&255)<104]
     delta=a[0] if a[0]<2147483648 else a[0]-4294967296
     gold=delta
    if ids or gold is not None:result.append({'key':file+'@'+str(n['offset']),'event':ref,'offset':n['offset'],'source':'전투'if file.startswith('battle')else '이야기','kind':'승리 정산'if op==89 else '획득 이벤트','items':ids,'goldAdjustment':gold,'conditions':condtext(cs),'rawConditions':cs,'rawArgs':a,'conditional':any(c.get('op')not in [0,2]for c in cs)})
   if n.get('body'):walk(n['body'],cs+([n['condition']]if n.get('condition')else []),ref)
 for si,seg in enumerate(d['segments']):
  for ei,e in enumerate(seg):walk(e.get('body',[]),e.get('conditions',[]),f'{file}:구간{si}/이벤트{ei}')
 return result
for stage in plan['stages']:
 i=int(stage['id'][1:]);stage['objectives']=contracts[i]['originalConditionText'];stage['rewards']=rewards(f'battle-{i:02}.json')+rewards(f'story-{i:02}.json');stage['mapDetails']=[]
 for mid in stage['maps']:
  m=next(m for m in assets['maps']if m['id']==mid)
  stage['mapDetails'].append({'id':mid,'width':m['width'],'height':m['height'],'image':'/images/story-reference/'+pathlib.Path(m['image']).stem+'.webp','terrain':[{'id':int(k),'name':names[int(k)]if int(k)<len(names)else '미확인 지형','count':v}for k,v in m['terrainCodeCounts'].items()]})
 stage['backgroundImages']=[{'name':f,'image':'/images/story-reference/'+pathlib.Path(f).stem+'.webp'}for f in stage['backgroundCandidates']if f in imagefiles]
# Preserve full connective and planning prose rather than silently dropping interludes.
def sections(file):
 text=(docs/file).read_text();parts=re.split(r'^## ',text,flags=re.M)[1:];res=[]
 for p in parts:
  title,_,body=p.partition('\n');res.append({'title':title,'body':body.strip()})
 return res
links={0:['I00'],2:['I01'],6:['I02'],8:['I03','F03'],9:['F08'],10:['F05'],12:['F04'],16:['F06'],17:['F07'],18:['I04'],19:['F09'],20:['F10'],22:['I05'],23:['I06','I07'],24:['I06','I07'],29:['I08','I09'],31:['I10'],32:['I10'],39:['I11'],41:['I12'],45:['I13'],47:['I14'],57:['I15'],4:['F01'],5:['F02']}
ints=sections('interludes.md');flatten=[]
for section in ints:
 if section['title']=='설화 동료 열 명의 장면':
  pieces=re.split(r'^### ',section['body'],flags=re.M);prefix=pieces[0]
  for item in pieces[1:]:
   title,_,body=item.partition('\n');flatten.append({'title':title,'body':prefix.strip()+'\n\n'+body.strip()})
 else:flatten.append(section)
for s in plan['stages']:s['interludeKeys']=links.get(int(s['id'][1:]),[])
payload={'stages':plan['stages'],'interludes':flatten,'guidelines':sections('README.md')+sections('asset-and-battle-contract.md')+sections('decisions.md'),'notice':'집필 초안 · 원본 전투와 대본의 실제 연결은 아직 진행 전입니다. 58개는 분기·대체 전투를 포함한 파일 수이며 한 회차 전투 수가 아닙니다.'}
(out/'story-site.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':'))+'\n')
(out/'images.json').write_text(json.dumps([{'source':str(source/f),'name':pathlib.Path(k).stem+'.webp'}for k,f in imagefiles.items()]))
print('stages',len(plan['stages']),'rewards',sum(len(s['rewards'])for s in plan['stages']),'images',len(imagefiles),'bytes',(out/'story-site.json').stat().st_size)
