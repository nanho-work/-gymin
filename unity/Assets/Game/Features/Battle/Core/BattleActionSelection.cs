using System;
namespace Sanha.Battle
{
    [Serializable] public sealed class BattleActionOption {public int id,cost,count;public string name,description,icon,reason;public bool enabled;}
    [Serializable] public sealed class BattleAim {public string kind,reason;public int id,target;public bool valid;public BattleCell[] range,area;public int[] targets,affected;}
    public sealed class BattleActionSelection
    {
        public string Kind {get;private set;}
        public int Id {get;private set;}=-1;
        public bool Active=>Id>=0;
        public BattleAim Preview {get;private set;}
        public void Begin(string kind,int id){if((kind!="skill"&&kind!="item")||id<0)throw new ArgumentException("Invalid targeting mode");Kind=kind;Id=id;Preview=null;}
        public bool Accept(BattleAim preview){Preview=null;if(!Active||preview==null||preview.kind!=Kind||preview.id!=Id)return false;Preview=preview;return true;}
        public bool CanConfirm=>Active&&Preview!=null&&Preview.valid&&Preview.target>=0;
        public void Clear(){Kind=null;Id=-1;Preview=null;}
    }
}
