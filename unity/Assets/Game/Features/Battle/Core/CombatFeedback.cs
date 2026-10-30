using System;
namespace Sanha.Battle
{
    [Serializable] public sealed class CombatFeedback
    {
        public int id,x,y,hpBefore,hpAfter,mpBefore,mpAfter,maxHP,maxMP;
        public string kind;public bool hasOutcome,landed,critical;
        public int HPDelta=>hpAfter-hpBefore;
        public int MPDelta=>mpAfter-mpBefore;
        public bool Miss=>hasOutcome&&!landed;
        public string Outcome=>Miss?"빗나감":hasOutcome&&critical?"치명타!":hasOutcome&&HPDelta==0&&MPDelta==0?(kind=="heal"?"회복 없음":"피해 없음"):"";
        static string Delta(int n)=>n>0?"+"+n:n.ToString();
        public string HPText=>HPDelta==0?(hasOutcome&&landed&&critical&&MPDelta==0?"HP 0":""):"HP "+Delta(HPDelta);
        public string MPText=>MPDelta==0?"":"MP "+Delta(MPDelta);
        public int AnimatedHP(double progress)=>Interpolate(hpBefore,hpAfter,progress);
        public int AnimatedMP(double progress)=>Interpolate(mpBefore,mpAfter,progress);
        static int Interpolate(int before,int after,double t)=>(int)Math.Round(before+(after-before)*Math.Max(0,Math.Min(1,t)));
    }
}
