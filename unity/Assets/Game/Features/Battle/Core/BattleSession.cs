using System;
namespace Sanha.Battle
{
    [Serializable] public sealed class BattleCommand {public string command;public int id=-1,x,y,target=-1,spell=-1,item=-1,choice;public string token,disposition;}
    [Serializable] public sealed class BattleCell {public int x,y;}
    [Serializable] public sealed class BattleActor {public int id,x,y,hp,maxHP,mp,maxMP,level,job,side,facing,attack,defense;public bool hidden,acted,moved,canAct;}
    [Serializable] public sealed class BattlePending {public string token,kind,text;public int id,x,y,pose,target=-1,sound=-1,impact=-1;public float duration;public int[] targetIDs;public CombatFeedback[] results;}
    [Serializable] public sealed class BattleSnapshot
    {
        public bool ok,hasPending,hasAim,recoverable;public int stateVersion;public BattleAim aim;public BattleActionOption[] spells,items;public string error,outcome;public BattlePending pending;public int round,side,money,pendingMove;
        public BattleActor[] units;public BattleCell[] range;public int[] targets,inventory,unsupported;public string[] log;
        public BattleActor Find(int id)=>Array.Find(units,u=>u.id==id);
    }
    public interface IBattleSession:IDisposable {BattleSnapshot Send(BattleCommand command);}
}
