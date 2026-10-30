using System;
using System.Collections.Generic;
namespace Sanha.Battle
{
    [Serializable] public sealed class DeployedUnit
    {
        public int id,jobId,side,x,y,level,movement,originalFacing,sourceOffset,retirementOffset;
        public string name,originalName,jobName,state,texture,direction,note,modelKind;
        public bool IsOnBoard=>state=="deployed";
        public string SideName=>side==0?"아군":side==1?"적군":"동맹";
    }
    [Serializable] public sealed class UnitDeployment
    {
        public int schemaVersion;
        public string stageId,snapshot;
        public DeployedUnit[] units;
        public void Validate(BoardData board)
        {
            if(schemaVersion!=1||stageId!=board.stageId||units==null||string.IsNullOrEmpty(snapshot))throw new ArgumentException("Invalid unit deployment");
            var ids=new HashSet<int>();var occupied=new HashSet<int>();
            foreach(var u in units){
                if(u==null||!ids.Add(u.id)||u.side<0||u.side>2||u.x<0||u.y<0||u.x>=board.width||u.y>=board.height||u.level<1||string.IsNullOrEmpty(u.name)||string.IsNullOrEmpty(u.texture)||!Array.Exists(new[]{"deployed","reserve","retired"},s=>s==u.state))throw new ArgumentException("Invalid deployment unit");
                if(u.IsOnBoard&&!occupied.Add(u.y*board.width+u.x))throw new ArgumentException("Initial unit collision");
            }
        }
        public DeployedUnit UnitAt(int x,int y)=>Array.Find(units,u=>u.IsOnBoard&&u.x==x&&u.y==y);
        public int Count(int side,string state)=>Array.FindAll(units,u=>u.side==side&&u.state==state).Length;
    }
}
