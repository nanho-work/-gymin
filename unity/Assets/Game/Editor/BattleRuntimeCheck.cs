using System;
using System.IO;
using System.Linq;
using System.Reflection;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using Sanha.Battle;
using Sanha.Campaign;
namespace Sanha.Editor
{
    // Isolated batch Play verification; test-generated receipts are used only for dialogue choices.
    // Motion/audio/effect completion is supplied by BattleController's real coroutine.
    public static class BattleRuntimeCheck
    {
        const string Key="Sanha.BattleRuntimeCheck";static BattleController combat;static bool configured,cancelled,movedTest;static int originX,originY,commands,spellSteps;static string spellToken;static double started;
        static readonly MethodInfo Send=typeof(BattleController).GetMethod("Send",BindingFlags.Instance|BindingFlags.NonPublic);
        public static void Begin(){SessionState.SetBool(Key,true);EditorSceneManager.OpenScene("Assets/Scenes/Game.unity");EditorApplication.EnterPlaymode();}
        [InitializeOnLoadMethod]static void Install(){if(SessionState.GetBool(Key,false))EditorApplication.update+=Tick;}
        static void Command(BattleCommand command){commands++;Send.Invoke(combat,new object[]{command});if(combat.Snapshot?.ok==false)throw new Exception(combat.Snapshot.error);}
        static void Tick(){
            if(!EditorApplication.isPlaying||EditorApplication.isPaused)return;
            try{
                if(!configured){
                    var screen=UnityEngine.Object.FindFirstObjectByType<GameFlowScreen>();if(screen==null)return;
                    var f=typeof(GameFlowScreen).GetField("flow",BindingFlags.Instance|BindingFlags.NonPublic);var flow=(GameFlow)f.GetValue(screen);flow.StartNew();flow.FinishIntroduction(true);flow.EnterBoard();
                    var board=UnityEngine.Object.FindFirstObjectByType<BattleBoardView>();board.SetVisible(true);combat=UnityEngine.Object.FindFirstObjectByType<BattleController>();combat.Begin();combat.Active=true;
                    var clip=WaveAudio.Load(Path.Combine(Application.streamingAssetsPath,"SanhaNative/SE07.WAV"));if(clip.samples<=0||clip.frequency!=22050)throw new Exception("PCM sound decode");UnityEngine.Object.Destroy(clip);
                    configured=true;started=EditorApplication.timeSinceStartup;return;
                }
                combat.Active=true;
                if(EditorApplication.timeSinceStartup-started>300)throw new Exception("Runtime verification timed out: "+combat.Message);
                var s=combat.Snapshot;if(s==null)throw new Exception(combat.Message);
                if(!s.ok)throw new Exception(s.error);
                if(s.hasPending!=(s.pending!=null))throw new Exception("Unity optional-object protocol mismatch");
                if(s.pending!=null){var p=s.pending;if(p.kind=="spell"&&p.token!=spellToken){spellSteps++;spellToken=p.token;}if(new[]{"dialogue","tutorial","choice","notice"}.Contains(p.kind))Command(new BattleCommand{command="ack",token=p.token,choice=p.kind=="tutorial"?2:1});return;}
                if(combat.IsBusy)return;
                if(s.outcome!="battle"){
                    if(s.outcome!="victory"||s.money!=1000||s.inventory.Length!=3||!cancelled||spellSteps<1)throw new Exception("Unexpected battle result");
                    Debug.Log($"SANHA_BATTLE_PLAY_PASS round={s.round} money={s.money} inventory={string.Join(",",s.inventory)} commands={commands} spellSteps={spellSteps} moveCancel={cancelled} unresolved={string.Join(",",s.unsupported)} scope=Unity-batch-Play-not-onscreen-or-audibility");
                    SessionState.SetBool(Key,false);EditorApplication.update-=Tick;EditorApplication.Exit(0);return;
                }
                var king=s.Find(0);if(king==null||king.hidden||s.side!=0)return;
                if(!movedTest){
                    if(s.round!=2||king.x!=10||king.y!=6)throw new Exception("Original reinforcement entry");originX=king.x;originY=king.y;combat.Select(0);
                    var cell=combat.Snapshot.range.First(c=>c.x!=originX||c.y!=originY);combat.Click(cell.x,cell.y);movedTest=true;return;
                }
                if(!cancelled){
                    if(s.pendingMove!=0)throw new Exception("Move not pending");Command(new BattleCommand{command="cancel"});var k=combat.Snapshot.Find(0);if(k.x!=originX||k.y!=originY)throw new Exception("Cancel did not restore");Command(new BattleCommand{command="wait",id=0});cancelled=true;return;
                }
                var actor=s.units.FirstOrDefault(u=>u.canAct);if(actor==null){Command(new BattleCommand{command="end"});return;}
                combat.Select(actor.id);s=combat.Snapshot;
                if((s.targets==null||s.targets.Length==0)&&!actor.moved){
                    var enemies=s.units.Where(u=>!u.hidden&&u.hp>0&&u.side==1).ToArray();var cells=s.range;
                    if(enemies.Length>0&&cells.Length>0){var best=cells.OrderBy(c=>enemies.Min(e=>Math.Abs(c.x-e.x)+Math.Abs(c.y-e.y))).ThenBy(c=>c.y).ThenBy(c=>c.x).First();if(best.x!=actor.x||best.y!=actor.y){combat.Click(best.x,best.y);return;}}
                }
                if(s.targets?.Length>0)Command(new BattleCommand{command="attack",id=actor.id,target=s.targets[0]});else Command(new BattleCommand{command="wait",id=actor.id});
            }catch(Exception e){Debug.LogException(e);SessionState.SetBool(Key,false);EditorApplication.update-=Tick;EditorApplication.Exit(1);}
        }
    }
}
