using System;
namespace Sanha.Battle
{
    // Manual move ownership. Policy (manual control/turn/status) belongs to the battle session.
    public sealed class ManualMoveState
    {
        public int X {get;private set;}
        public int Y {get;private set;}
        public int Facing {get;private set;}
        public bool Moved {get;private set;}
        public bool Acted {get;private set;}
        public bool Pending {get;private set;}
        int originX,originY,savedFacing;
        public ManualMoveState(int x,int y,int facing){X=x;Y=y;Facing=facing;}
        public int[] TryMove(int target,int width,MovementRange range,bool canAct)
        {
            if(!canAct||Acted||Moved||Pending||target==Y*width+X)return null;
            var path=range.PathTo(target);if(path==null||path.Length<2)return null;
            if(path[0]!=Y*width+X)throw new ArgumentException("Range origin does not match actor");
            originX=X;originY=Y;savedFacing=Facing;Pending=true;Moved=true;
            for(int i=1;i<path.Length;i++){int dx=path[i]%width-path[i-1]%width,dy=path[i]/width-path[i-1]/width;Facing=dx>0?1:dx<0?3:dy>0?2:0;}
            X=target%width;Y=target/width;return path;
        }
        public bool Cancel(bool canCancel)
        {
            if(!canCancel||!Pending||Acted)return false;
            X=originX;Y=originY;Facing=savedFacing;Pending=false;Moved=false;return true;
        }
        public bool Wait(bool canAct)
        {
            if(!canAct||Acted)return false;Pending=false;Moved=true;Acted=true;return true;
        }
    }
}
