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
        public int Selected {get;private set;}=-1;public CombatFeedbackView Feedback {get;private set;}
        UnitDeployment deployment;CombatUnitView view;ScenarioEffectView effects;SpellEffectView spellEffects;ItemUseView itemView;ActionCatalog actionCatalog;
        readonly BattleActionSelection actionSelection=new BattleActionSelection();public BattleActionSelection Targeting=>actionSelection;public BattleActionOption ChosenAction {get;private set;}BattleBoardView board;TextureCatalog textures;
        AudioSource soundPlayer;readonly Dictionary<string,AudioClip> clips=new Dictionary<string,AudioClip>();
        readonly HashSet<string> omitted=new HashSet<string>();
        bool playing,attackMode,failed;string lastFeedbackToken;
        public bool Failed=>failed;public bool AttackMode=>attackMode;public IEnumerable<string> Omitted=>omitted;float nextStep;string folder;
        public void Initialize(UnitDeployment units,BattleBoardView map,TextureCatalog catalog,Func<IBattleSession> factory)
        {
            openSession=factory??throw new ArgumentNullException(nameof(factory));deployment=units;board=map;textures=catalog;folder=Path.Combine(Application.streamingAssetsPath,"SanhaNative");
            var obj=new GameObject("Runtime combat units");obj.transform.SetParent(board.Content,false);view=obj.AddComponent<CombatUnitView>();view.Initialize(units,catalog);
            var fx=new GameObject("Original scenario effects");fx.transform.SetParent(board.Content,false);effects=fx.AddComponent<ScenarioEffectView>();effects.Initialize(catalog);spellEffects=fx.AddComponent<SpellEffectView>();spellEffects.Initialize(catalog);actionCatalog=ResourcesActionCatalog.Load();Feedback=new CombatFeedbackView(board);var itemObj=new GameObject("Item use");itemObj.transform.SetParent(board.Content,false);itemView=itemObj.AddComponent<ItemUseView>();itemView.Initialize(catalog,actionCatalog);
            soundPlayer=gameObject.AddComponent<AudioSource>();soundPlayer.playOnAwake=false;soundPlayer.spatialBlend=0;
            if(FindFirstObjectByType<AudioListener>()==null)gameObject.AddComponent<AudioListener>();
            board.TileClicked=Click;
        }
        public void Begin(){Suspend();session?.Dispose();session=null;Snapshot=null;Selected=-1;attackMode=false;failed=false;Message="";omitted.Clear();actionSelection.Clear();ChosenAction=null;board.ClearActionPreview();board.SetRange(null);board.ClearSelection();try{session=openSession();Send(new BattleCommand{command="new"});}catch(Exception e){failed=true;Message=e.Message;Debug.LogException(e);}}
        public void Suspend(){Active=false;StopAllCoroutines();playing=false;view.Finish();effects.Hide();spellEffects.Hide();itemView.Hide();Feedback?.Clear();lastFeedbackToken=null;soundPlayer.Stop();}
        void Send(BattleCommand command)
        {
            try{bool kingHidden=Snapshot?.Find(0)?.hidden??true;Snapshot=session.Send(command);view.Apply(Snapshot);ShowFeedback(Snapshot.pending);var king=Snapshot.Find(0);if(kingHidden&&king!=null&&!king.hidden)board.FocusTiles(king.x,king.y);Debug.Log($"SANHA_BATTLE {command.command}: turn={Snapshot.round} side={Snapshot.side} pending={Snapshot.pending?.kind} actor={Snapshot.pending?.id} pose={Snapshot.pending?.pose} outcome={Snapshot.outcome}");if(!Snapshot.ok){Message=Snapshot.error;failed=!Snapshot.recoverable;}}
            catch(Exception e){Message=e.Message;failed=true;Debug.LogException(e);}
        }
        public void Select(int id)
        {
            actionSelection.Clear();ChosenAction=null;board.ClearActionPreview();Selected=id;attackMode=false;Send(new BattleCommand{command="select",id=id});
            board.SetRange(Snapshot.range);var u=Snapshot.Find(id);if(u!=null)board.HighlightTile(u.x,u.y);
        }
        public void Click(int x,int y)
        {
            if(Snapshot==null||IsBusy||failed)return;
            var hit=Array.Find(Snapshot.units,u=>!u.hidden&&u.hp>0&&u.x==x&&u.y==y);
            var source=Snapshot.Find(Selected);
            if(actionSelection.Active){PreviewAction(hit?.id??-1);return;}
            if(Snapshot.side==0&&source!=null&&source.canAct&&attackMode&&hit!=null){if(!Array.Exists(Snapshot.targets??Array.Empty<int>(),id=>id==hit.id)){Message="공격 사거리 안의 적을 선택하세요.";return;}Send(new BattleCommand{command="attack",id=Selected,target=hit.id});attackMode=false;board.SetRange(null);return;}
            if(hit!=null){Select(hit.id);return;}
            if(Snapshot.side==0&&source?.canAct==true&&Array.Exists(Snapshot.range??Array.Empty<BattleCell>(),c=>c.x==x&&c.y==y)){
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
            playing=true;view.Play(pending);var actor=Snapshot.Find(pending.id);var target=Snapshot.Find(pending.target);if(actor!=null){if(pending.kind=="move")board.FocusTiles(pending.x,pending.y);else board.FocusTiles(actor.x,actor.y,target?.x??-1,target?.y??-1);}
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
                var effect=spellEffects.Load(pending.pose);if(effect.sound>=0)PlaySound(100+effect.sound);
                var ids=pending.targetIDs!=null&&pending.targetIDs.Length>0?pending.targetIDs:new[]{pending.target>=0?pending.target:pending.id};var actors=Array.ConvertAll(ids,id=>Snapshot.Find(id));
                if(Array.Exists(actors,a=>a==null))throw new InvalidOperationException("책략 대상 표시 누락");
                for(int i=0;i<effect.frames.Length;i++){spellEffects.Show(effect,i,actors);yield return new WaitForSecondsRealtime(effect.interval);}
                spellEffects.Hide();duration=effect.frames.Length==0?.65f:.025f;
            }
            else if(pending.kind=="itemUse"){
                if(target==null)throw new InvalidOperationException("도구 대상 표시 누락");if(pending.sound>=0)PlaySound(pending.sound);
                float start=Time.unscaledTime;while(Time.unscaledTime-start<duration){itemView.Show(pending.pose,target,(Time.unscaledTime-start)/duration);yield return null;}itemView.Hide();duration=.025f;
            }
            else if(pending.kind=="spellStatus"){Message=UnitName(pending.id)+" · "+pending.text;}
            else if(pending.kind=="tutorialVisual"){
                if(pending.text=="nativeMarker")board.HighlightTile(pending.x,pending.y);
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
                if(pending.impact>=0){yield return new WaitForSecondsRealtime(duration*.5f);PlaySound(pending.impact);duration*=.5f;}
            }
            else if(pending.kind=="pose"&&!Array.Exists(new[]{0,2,6,7},p=>p==pending.pose)){omitted.Add("pose "+pending.pose);Message="해당 제작 모션 없음 · 미적용: "+pending.pose;duration=.15f;}
            yield return new WaitForSecondsRealtime(duration);
            view.Finish();Send(new BattleCommand{command="ack",token=pending.token});playing=false;
            if(Snapshot?.pending==null&&Selected>=0&&Snapshot.outcome=="battle"&&Snapshot.Find(Selected)?.canAct==true)Select(Selected);
        }
        void ShowFeedback(BattlePending pending){
            if(pending?.kind!="combatResult"||pending.token==lastFeedbackToken)return;
            if(pending.results==null||pending.results.Length==0)throw new InvalidDataException("전투 결과 표시 정보가 없습니다.");
            Feedback.Show(pending.results);lastFeedbackToken=pending.token;
            foreach(var result in pending.results)if(result.HPDelta<0)view.Hit(result.id);
        }
        void PlaySound(int id){
            string name=id<100?$"SE{id:00}.WAV":id<200?$"SE_M_{id-100:00}.WAV":$"SE_E_{id-200:00}.WAV",path=Path.Combine(folder,name);
            if(!File.Exists(path)){omitted.Add(name);Message="미보유 효과음 미적용: "+name;return;}
            if(!clips.TryGetValue(path,out var clip)){clip=WaveAudio.Load(path);clips[path]=clip;}soundPlayer.PlayOneShot(clip);
        }
        public string DisplayText(string value){if(value==null)return "";foreach(var unit in deployment.units)if(unit.originalName!=unit.name)value=value.Replace(unit.originalName,unit.name);return value;}
        public string UnitName(int id)=>Array.Find(deployment.units,u=>u.id==id)?.name??id.ToString();
        public BattleActionOption[] Options(string kind)=>kind=="skill"?Snapshot?.spells??Array.Empty<BattleActionOption>():Snapshot?.items??Array.Empty<BattleActionOption>();
        public bool OpenActions(string kind){if(Snapshot?.side!=0||IsBusy||failed||Snapshot?.Find(Selected)?.canAct!=true)return false;CancelAction(false);Send(new BattleCommand{command="actions",id=Selected});return Snapshot.ok;}
        public bool ChooseAction(string kind,int id){var option=Array.Find(Options(kind),x=>x.id==id);if(option==null||!option.enabled||IsBusy||failed)return false;attackMode=false;ChosenAction=option;actionSelection.Begin(kind,id);PreviewAction(-1);return true;}
        void PreviewAction(int target){if(!actionSelection.Active)return;Send(new BattleCommand{command="aim",id=Selected,target=target,spell=actionSelection.Kind=="skill"?actionSelection.Id:-1,item=actionSelection.Kind=="item"?actionSelection.Id:-1});if(actionSelection.Accept(Snapshot.aim))board.ShowActionPreview(Snapshot.aim,Snapshot.units);else board.ClearActionPreview();}
        public void CancelAction(bool restore=true){actionSelection.Clear();ChosenAction=null;board.ClearActionPreview();if(restore&&Selected>=0&&!IsBusy&&!failed)Select(Selected);}
        public ActionLabel ActionLabel(string kind,int id)=>actionCatalog.Find(kind,id);
        public void UseSelectedAction(){if(!actionSelection.CanConfirm||IsBusy||failed)return;var command=new BattleCommand{command=actionSelection.Kind=="skill"?"cast":"item",id=Selected,target=actionSelection.Preview.target,spell=actionSelection.Kind=="skill"?actionSelection.Id:-1,item=actionSelection.Kind=="item"?actionSelection.Id:-1};CancelAction(false);Send(command);}
        public void ToggleAttack(){if(Snapshot?.side==0&&!IsBusy&&!failed&&Snapshot?.Find(Selected)?.canAct==true)attackMode=!attackMode;}
        public void WaitSelected(){if(Snapshot?.side!=0||IsBusy||failed||Snapshot?.Find(Selected)?.canAct!=true)return;Send(new BattleCommand{command="wait",id=Selected});board.SetRange(null);}
        public void CancelMove(){if(IsBusy||failed||Snapshot==null||Snapshot.pendingMove<0)return;Send(new BattleCommand{command="cancel"});if(Selected>=0)Select(Selected);}
        public void EndTurn(){if(IsBusy||failed||Snapshot==null||Snapshot.side!=0||Snapshot.outcome!="battle"||Snapshot.pendingMove>=0)return;Send(new BattleCommand{command="end"});board.SetRange(null);}
        public void Acknowledge(int choice){var p=Snapshot?.pending;if(p==null)return;Send(new BattleCommand{command="ack",token=p.token,choice=choice});}
        void OnDestroy(){StopAllCoroutines();session?.Dispose();foreach(var clip in clips.Values)Destroy(clip);}
    }
}
