using System;
using Sanha.Battle;
using Sanha.Campaign;
static class BoardCoreTests
{
    static void Check(bool condition,string message){if(!condition)throw new Exception(message);}
    static void Reject(Action action){try{action();}catch(InvalidOperationException){return;}throw new Exception("Invalid transition accepted");}
    public static void Run()
    {
        var b=new BoardState(new BoardData{schemaVersion=1,width=2,height=2,stageId="B00",background="map",terrain=new[]{0,1,2,3},terrainNames=new[]{"평지","초원","숲","습지"},introSceneIds=new[]{"I00"},battleIntroSceneId="P03"});
        Check(b.TrySelect(.1,-.1)&&b.TerrainAt(b.SelectedX,b.SelectedY)==0,"top-left orientation");
        Check(b.TrySelect(1.9,-1.9)&&b.SelectedX==1&&b.SelectedY==1&&b.TerrainAt(1,1)==3,"bottom-right orientation");
        Check(!b.TrySelect(2,-1)&&!b.TrySelect(1,-2)&&!b.TrySelect(-.1,-1)&&!b.TrySelect(1,.1)&&!b.TrySelect(double.NaN,0),"outside map");
        Check(b.SelectedX==1&&b.SelectedY==1,"invalid selection preserves tile");b.ClearSelection();Check(!b.HasSelection,"reset selection");
        var units=new UnitDeployment{schemaVersion=1,stageId="B00",snapshot="setup",units=new[]{
            new DeployedUnit{id=1,name="unit",side=1,level=1,x=1,y=1,state="deployed",texture="unit"},
            new DeployedUnit{id=2,name="reserve",side=0,level=1,x=1,y=1,state="reserve",texture="unit"}}};
        units.Validate(b.Data);Check(units.UnitAt(1,1).id==1,"reserve does not occupy board");Check(units.UnitAt(0,0)==null,"empty tile");
        units.units[1].state="deployed";bool collision=false;try{units.Validate(b.Data);}catch(ArgumentException){collision=true;}Check(collision,"duplicate occupied tile rejected");
        var costs=new int[]{1,2,255,1,1,1,1,1,1};
        var range=new MovementRange(0,0,3,3,3,costs,new System.Collections.Generic.HashSet<int>{1},new System.Collections.Generic.HashSet<int>{1},new System.Collections.Generic.HashSet<int>{4});
        Check(!range.Costs.ContainsKey(1)&&range.Costs[4]==2,"friendly transit but no stop");
        Check(!range.Costs.ContainsKey(2)&&range.PathTo(4)[1]==3,"impassable/tie reconstruction");
        Check(range.PathTo(8)==null,"ZOC and budget boundary");
        var manual=new ManualMoveState(0,0,3);
        Check(manual.TryMove(4,3,range,false)==null,"no manual control gate");
        Check(manual.TryMove(4,3,range,true)!=null&&manual.X==1&&manual.Y==1&&manual.Pending,"move transaction");
        Check(manual.TryMove(3,3,range,true)==null,"second move forbidden");
        Check(manual.Cancel(true)&&manual.X==0&&manual.Y==0&&manual.Facing==3&&!manual.Moved,"cancel restores origin and facing");
        Check(manual.TryMove(4,3,range,true)!=null&&manual.Wait(true),"wait commits move");
        Check(!manual.Cancel(true)&&!manual.Wait(true),"acted unit cannot undo or repeat wait");
        var f=new GameFlow();Check(f.Screen==GameScreen.Title,"title entry");Reject(f.EnterBoard);f.StartNew();Reject(()=>f.FinishIntroduction(false));f.FinishIntroduction(true);f.EnterBoard();Check(f.Screen==GameScreen.Battle,"board entry");f.BackToPreparation();f.ReturnToTitle();Check(f.Screen==GameScreen.Title,"return title");
        Console.WriteLine("PASS: board coordinate bounds/orientation/selection and guarded screen transitions");
    }
}
