using System;
using Sanha.Battle;
static class CombatFeedbackTests
{
    static void Check(bool value,string message){if(!value)throw new Exception(message);}
    public static void Run(){
        var hit=new CombatFeedback{kind="attack",hasOutcome=true,landed=true,critical=true,hpBefore=80,hpAfter=21,mpBefore=17,mpAfter=12};
        Check(hit.HPText=="HP -59"&&hit.MPText=="MP -5"&&hit.Outcome=="치명타!","actual HP/MP loss and critical label");
        Check(hit.AnimatedHP(0)==80&&hit.AnimatedHP(1)==21&&hit.AnimatedHP(2)==21,"bar interpolation clamps to committed result");
        Check(hit.AnimatedMP(-1)==17&&hit.AnimatedMP(.5)>=12&&hit.AnimatedMP(.5)<=17,"MP interpolation stays inside interval");
        hit.landed=false;Check(hit.Outcome=="빗나감","miss overrides rolled critical flag");
        hit.landed=true;hit.critical=false;hit.hpAfter=80;hit.mpAfter=17;Check(hit.Outcome=="피해 없음","zero damage is not automatically a miss");
        hit.critical=true;Check(hit.HPText=="HP 0"&&hit.Outcome=="치명타!","negated critical still shows zero actual damage");
        var heal=new CombatFeedback{kind="heal",hasOutcome=true,landed=true,hpBefore=90,hpAfter=100,mpBefore=1,mpAfter=7};
        Check(heal.HPText=="HP +10"&&heal.MPText=="MP +6"&&!heal.Miss,"actual capped recovery and MP restoration");
        heal.hpAfter=90;heal.mpAfter=1;Check(heal.Outcome=="회복 없음","full-HP heal does not invent miss");
        var cost=new CombatFeedback{kind="change",mpBefore=20,mpAfter=14};Check(cost.Outcome==""&&cost.MPText=="MP -6","caster MP cost is not an attack");
        Console.WriteLine("PASS: combat result labels, miss/zero/critical distinction, capped healing, HP/MP interpolation and spell cost");
    }
}
