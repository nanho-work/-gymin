using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    public sealed class BattleController:MonoBehaviour
    {
        IBattleSession session;Func<IBattleSession> openSession;public BattleSnapshot Snapshot {get;private set;}
        public bool Active;public bool IsBusy=>playing||Snapshot?.pending!=null;
        public string Message {get;private set;}="";
        public int Selected {get;private set;}=-1;
        UnitDeployment deployment;CombatUnitView view;ScenarioEffectView effects;SpellEffectView spellEffects;BattleBoardView board;TextureCatalog textures;
        AudioSource soundPlayer;readonly Dictionary<string,AudioClip> clips=new Dictionary<string,AudioClip>();
        readonly HashSet<string> omitted=new HashSet<string>();
        bool playing,attackMode,failed,showLog;Vector2 logScroll;float nextStep;string folder;
        public void Initialize(UnitDeployment units,BattleBoardView map,TextureCatalog catalog,Func<IBattleSession> factory)
        {
            openSession=factory??throw new ArgumentNullException(nameof(factory));deployment=units;board=map;textures=catalog;folder=Path.Combine(Application.streamingAssetsPath,"SanhaNative");
            var obj=new GameObject("Runtime combat units");obj.transform.SetParent(board.Content,false);view=obj.AddComponent<CombatUnitView>();view.Initialize(units,catalog);
            var fx=new GameObject("Original scenario effects");fx.transform.SetParent(board.Content,false);effects=fx.AddComponent<ScenarioEffectView>();effects.Initialize(catalog);spellEffects=fx.AddComponent<SpellEffectView>();spellEffects.Initialize(catalog);
            soundPlayer=gameObject.AddComponent<AudioSource>();soundPlayer.playOnAwake=false;soundPlayer.spatialBlend=0;
            if(FindFirstObjectByType<AudioListener>()==null)gameObject.AddComponent<AudioListener>();
            board.TileClicked=Click;
        }
        public void Begin(){Suspend();session?.Dispose();session=null;Snapshot=null;Selected=-1;attackMode=false;failed=false;showLog=false;Message="";omitted.Clear();board.SetRange(null);try{session=openSession();Send(new BattleCommand{command="new"});}catch(Exception e){failed=true;Message=e.Message;Debug.LogException(e);}}
        public void Suspend(){Active=false;StopAllCoroutines();playing=false;view.Finish();effects.Hide();spellEffects.Hide();soundPlayer.Stop();}
        void Send(BattleCommand command)
        {
            try{Snapshot=session.Send(command);view.Apply(Snapshot);Debug.Log($"SANHA_BATTLE {command.command}: turn={Snapshot.round} side={Snapshot.side} pending={Snapshot.pending?.kind} actor={Snapshot.pending?.id} pose={Snapshot.pending?.pose} outcome={Snapshot.outcome}");if(!Snapshot.ok){Message=Snapshot.error;failed=true;}}
            catch(Exception e){Message=e.Message;failed=true;Debug.LogException(e);}
        }
        public void Select(int id)
        {
            Selected=id;attackMode=false;Send(new BattleCommand{command="select",id=id});
            board.SetRange(Snapshot.range);var u=Snapshot.Find(id);if(u!=null)board.State.TrySelect(u.x+.5,-u.y-.5);
        }
        public void Click(int x,int y)
        {
            if(Snapshot==null||IsBusy||failed)return;
            var hit=Array.Find(Snapshot.units,u=>!u.hidden&&u.hp>0&&u.x==x&&u.y==y);
            var source=Snapshot.Find(Selected);
            if(source!=null&&source.canAct&&attackMode&&hit!=null){if(!Array.Exists(Snapshot.targets??Array.Empty<int>(),id=>id==hit.id)){Message="공격 사거리 안의 적을 선택하세요.";return;}Send(new BattleCommand{command="attack",id=Selected,target=hit.id});attackMode=false;board.SetRange(null);return;}
            if(hit!=null){Select(hit.id);return;}
            if(source?.canAct==true&&Array.Exists(Snapshot.range??Array.Empty<BattleCell>(),c=>c.x==x&&c.y==y)){
                Send(new BattleCommand{command="move",id=Selected,x=x,y=y});board.SetRange(null);
            }
        }
        void Update()
        {
            if(!Active||failed||Snapshot==null||playing)return;
            if(Snapshot.pending!=null){
                if(Snapshot.pending.kind=="dialogue"||Snapshot.pending.kind=="tutorial"||Snapshot.pending.kind=="choice"||Snapshot.pending.kind=="notice")return;
                StartCoroutine(Playback(Snapshot.pending));return;
            }
            if(Time.unscaledTime<nextStep||Snapshot.outcome!="battle")return;
            bool noParty=Snapshot.Find(0)?.hidden==true;
            if(Snapshot.side!=0||noParty){nextStep=Time.unscaledTime+.22f;Send(new BattleCommand{command="step"});}
        }
        IEnumerator Playback(BattlePending pending)
        {
            var loop=PlaybackCore(pending);
            while(true){bool more=false;try{more=loop.MoveNext();}catch(Exception e){failed=true;playing=false;Message="연출 재생 오류 · 완료 대기 유지: "+e.Message;Debug.LogException(e);}if(failed||!more)yield break;yield return loop.Current;}
        }
        IEnumerator PlaybackCore(BattlePending pending)
        {
            playing=true;view.Play(pending);
            float duration=Mathf.Max(.025f,pending.duration);
            if(pending.kind=="sound"||pending.kind=="music"){
                string name=pending.kind=="music"?"music/track-"+(pending.id+2)+".wav":pending.id<100?$"SE{pending.id:00}.WAV":pending.id<200?$"SE_M_{pending.id-100:00}.WAV":$"SE_E_{pending.id-200:00}.WAV";
                var path=Path.Combine(folder,name);
                if(pending.id==255||pending.kind=="sound"&&pending.pose==255){soundPlayer.Stop();duration=.025f;}
                else if(File.Exists(path)){
                    AudioClip clip=null;try{if(!clips.TryGetValue(path,out clip))clip=WaveAudio.Load(path);}catch(Exception e){failed=true;Message=e.Message;}
                    if(failed){playing=false;yield break;}clips[path]=clip;soundPlayer.clip=clip;soundPlayer.Play();duration=clip.length;
                }else{omitted.Add(name);Message="미보유 음원 미적용: "+name;duration=.15f;}
            }
            else if(pending.kind=="spell"){
                var effect=spellEffects.Load(pending.pose);PlaySound(100+effect.sound);
                var ids=pending.targetIDs!=null&&pending.targetIDs.Length>0?pending.targetIDs:new[]{pending.target>=0?pending.target:pending.id};var actors=Array.ConvertAll(ids,id=>Snapshot.Find(id));
                if(Array.Exists(actors,a=>a==null))throw new InvalidOperationException("책략 대상 표시 누락");
                for(int i=0;i<effect.frames.Length;i++){spellEffects.Show(effect,i,actors);yield return new WaitForSecondsRealtime(effect.interval);}
                spellEffects.Hide();duration=.025f;
            }
            else if(pending.kind=="spellStatus"){Message=Name(pending.id)+" · "+pending.text;}
            else if(pending.kind=="tutorialVisual"){
                if(pending.text=="nativeMarker")board.State.TrySelect(pending.x+.5,-pending.y-.5);
                if(pending.id>=0)Selected=pending.id;
                board.SetRange(Snapshot.range);
            }
            else if(pending.kind=="effect"){
                if(pending.text=="mcallLoad")effects.Load(pending.id);
                else if(pending.text=="mcallPlay"){
                    var original=effects.Load(pending.id);
                    foreach(var frame in original.frames){effects.Show(frame,pending.x,pending.y);if(frame.sound>=0)PlaySound(frame.sound);yield return new WaitForSecondsRealtime(Mathf.Max(.001f,original.seconds));}
                    effects.Hide();duration=.2f;
                }
                else if(pending.text=="camera"||pending.text=="tileToScreen")duration=.025f;
                else {failed=true;Message="미연결 원본 연출: "+pending.text;playing=false;yield break;}
            }
            else if(pending.kind=="attack"){
                if(pending.sound>=0)PlaySound(pending.sound);
                if(pending.impact>=0){yield return new WaitForSecondsRealtime(duration*.5f);PlaySound(pending.impact);view.Hit(pending.target);duration*=.5f;}
            }
            else if(pending.kind=="pose"&&!Array.Exists(new[]{0,2,6,7},p=>p==pending.pose)){omitted.Add("pose "+pending.pose);Message="해당 제작 모션 없음 · 미적용: "+pending.pose;duration=.15f;}
            yield return new WaitForSecondsRealtime(duration);
            view.Finish();Send(new BattleCommand{command="ack",token=pending.token});playing=false;
            if(Snapshot?.pending==null&&Selected>=0&&Snapshot.outcome=="battle"&&Snapshot.Find(Selected)?.canAct==true)Select(Selected);
        }
        void PlaySound(int id){
            string name=id<100?$"SE{id:00}.WAV":id<200?$"SE_M_{id-100:00}.WAV":$"SE_E_{id-200:00}.WAV",path=Path.Combine(folder,name);
            if(!File.Exists(path)){omitted.Add(name);Message="미보유 효과음 미적용: "+name;return;}
            if(!clips.TryGetValue(path,out var clip)){clip=WaveAudio.Load(path);clips[path]=clip;}soundPlayer.PlayOneShot(clip);
        }
        string Localize(string value){foreach(var unit in deployment.units)if(unit.originalName!=unit.name)value=value.Replace(unit.originalName,unit.name);return value;}
        string Name(int id)=>Array.Find(deployment.units,u=>u.id==id)?.name??id.ToString();
        public void Draw(GUIStyle text,GUIStyle small)
        {
            GUI.Box(new Rect(942,90,314,660),"");
            if(Snapshot==null){GUI.Label(new Rect(960,110,270,500),Message,text);return;}
            string side=Snapshot.side==0?"아군":Snapshot.side==1?"적군":"동맹";
            GUI.Label(new Rect(960,105,280,70),$"{Snapshot.round} / 20턴 · {side}\n{(IsBusy?"연출 진행 중":"행동 선택")}",text);
            var u=Snapshot.Find(Selected);if(u!=null)GUI.Label(new Rect(960,185,275,105),$"{Name(u.id)} · Lv.{u.level}\nHP {u.hp}/{u.maxHP} · MP {u.mp}/{u.maxMP}\n공격 {u.attack} · 방어 {u.defense}",small);
            GUI.enabled=!IsBusy&&!failed&&u?.canAct==true;
            if(GUI.Button(new Rect(960,300,130,45),attackMode?"공격 취소":"공격"))attackMode=!attackMode;
            if(GUI.Button(new Rect(1100,300,130,45),"대기")){Send(new BattleCommand{command="wait",id=Selected});board.SetRange(null);}
            GUI.enabled=!IsBusy&&!failed&&Snapshot.pendingMove>=0;
            if(GUI.Button(new Rect(960,355,270,45),"이동 취소")){Send(new BattleCommand{command="cancel"});if(Selected>=0)Select(Selected);}
            GUI.enabled=!IsBusy&&!failed&&Snapshot.side==0&&Snapshot.outcome=="battle"&&Snapshot.pendingMove<0;
            if(GUI.Button(new Rect(960,410,270,45),"아군 턴 종료")){Send(new BattleCommand{command="end"});board.SetRange(null);}
            GUI.enabled=true;
            GUI.Label(new Rect(960,470,275,100),attackMode?"공격할 적의 칸을 선택하세요.":"아군 선택 → 파란 이동 칸 선택\n이동 후 대기 또는 공격\n회색 진영 표시: 행동 완료",small);
            GUI.Label(new Rect(960,560,275,90),Message,small);
            if(failed&&GUI.Button(new Rect(960,605,270,40),"전투 다시 시작"))Begin();
            if(GUI.Button(new Rect(960,655,270,40),showLog?"기록 닫기":"전투 기록 · 미적용 자료"))showLog=!showLog;
            if(showLog){GUI.Box(new Rect(120,120,760,390),"");logScroll=GUI.BeginScrollView(new Rect(140,135,720,340),logScroll,new Rect(0,0,690,550));
                string log=string.Join("\n",Snapshot.log??Array.Empty<string>());foreach(var unit in deployment.units)if(unit.originalName!=unit.name)log=log.Replace(unit.originalName,unit.name);
                GUI.Label(new Rect(0,0,680,410),log,small);GUI.Label(new Rect(0,410,680,130),"미보유 자료: "+string.Join(", ",omitted)+"\n기존 엔진 미복원 명령: "+string.Join(",",Snapshot.unsupported??Array.Empty<int>()),small);GUI.EndScrollView();
            }
            if(Snapshot.pending!=null&&Array.Exists(new[]{"dialogue","tutorial","choice","notice"},k=>k==Snapshot.pending.kind)){
                var p=Snapshot.pending;GUI.Box(new Rect(40,590,850,150),"");GUI.Label(new Rect(60,610,640,100),Localize(p.text),text);
                if(p.kind=="tutorial"||p.kind=="choice"){
                    if(GUI.Button(new Rect(725,610,140,45),"예"))Send(new BattleCommand{command="ack",token=p.token,choice=1});
                    if(GUI.Button(new Rect(725,670,140,45),"아니오"))Send(new BattleCommand{command="ack",token=p.token,choice=2});
                }else if(GUI.Button(new Rect(725,660,140,50),"다음"))Send(new BattleCommand{command="ack",token=p.token});
            }
            if(Snapshot.outcome!="battle"){
                GUI.Box(new Rect(280,210,620,340),"");GUI.Label(new Rect(320,250,550,200),$"{(Snapshot.outcome=="victory"?"승리":"패배")}\n\n{Snapshot.round}턴 · 보유 금 {Snapshot.money}\n보관 아이템 {Snapshot.inventory?.Length??0}개\n미보유 자료 미적용 {omitted.Count}종\n미복원 원본 명령: {string.Join(",",Snapshot.unsupported??Array.Empty<int>())}",text);
                if(GUI.Button(new Rect(370,465,420,50),"첫 전투 다시 시작"))Begin();
            }
        }
        void OnDestroy(){StopAllCoroutines();session?.Dispose();foreach(var clip in clips.Values)Destroy(clip);}
    }
}
