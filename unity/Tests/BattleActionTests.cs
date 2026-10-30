using System;
using Sanha.Battle;
static class BattleActionTests
{
    static void Check(bool value,string message){if(!value)throw new Exception(message);}
    public static void Run(){
        var mode=new BattleActionSelection();Check(!mode.Active&&!mode.CanConfirm,"no action is armed initially");
        mode.Begin("skill",10);Check(mode.Active&&!mode.CanConfirm,"choosing a skill alone cannot spend MP");
        Check(mode.Accept(new BattleAim{kind="skill",id=10,target=0,valid=true})&&mode.CanConfirm,"person ID zero is a valid target");
        Check(!mode.Accept(new BattleAim{kind="item",id=10,target=1,valid=true})&&!mode.CanConfirm,"mismatched preview clears prior confirmation");
        mode.Accept(new BattleAim{kind="skill",id=10,target=1,valid=false});Check(!mode.CanConfirm,"invalid target cannot confirm");
        mode.Begin("item",87);Check(mode.Preview==null&&!mode.CanConfirm,"new action clears previous target");
        mode.Accept(new BattleAim{kind="item",id=87,target=0,valid=true});mode.Clear();Check(!mode.Active&&mode.Preview==null&&!mode.CanConfirm,"cancel clears selection");
        Check(!mode.Accept(new BattleAim{kind="item",id=87,target=0,valid=true}),"late reply cannot rearm a cancelled action");
        Console.WriteLine("PASS: skill/item targeting, explicit confirmation, stale preview rejection and cancellation");
    }
}
