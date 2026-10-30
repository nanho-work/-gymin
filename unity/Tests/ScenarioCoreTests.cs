using System;
using Sanha.Scenario;
class ScenarioCoreTests
{
    static void Assert(bool value,string message) { if(!value) throw new Exception(message); }
    static void Reject(Action action) { try { action(); } catch(ArgumentException) { return; } throw new Exception("Expected rejection"); }
    static StageData Sample() => new StageData{id="B00",scenes=new[]{
        new SceneData{id="A",lines=new[]{new DialogueLine{speaker="왕건",text="첫 대사"},new DialogueLine{speaker="궁예",text="두 번째"}}},
        new SceneData{id="B",lines=new[]{new DialogueLine{speaker="설명",text="마지막"}}}
    }};
    static int Main()
    {
        try
        {
            BoardCoreTests.Run();BoardCameraTests.Run();BattleActionTests.Run();CombatFeedbackTests.Run();
            var stage=Sample(); var c=new ScenarioCursor(); c.Load(stage);
            Assert(c.AtStart,"initial"); c.Previous(); Assert(c.AtStart,"underflow");
            c.Next(); Assert(c.SceneIndex==0&&c.LineIndex==1,"line");
            c.Next(); Assert(c.AtEnd&&c.SceneIndex==1,"scene transition");
            c.Next(); Assert(c.AtEnd,"overflow");
            c.Previous(); Assert(c.SceneIndex==0&&c.LineIndex==1,"reverse transition");
            c.SelectScene(1); Assert(c.LineIndex==0,"select");
            Reject(()=>c.SelectScene(-1)); Reject(()=>c.SelectScene(2));
            c.Load(Sample()); Assert(c.AtStart,"reload reset");
            Reject(()=>c.Load(new StageData{scenes=new SceneData[0]}));
            var data=new CampaignData{schemaVersion=1,stages=new[]{stage}};
            CampaignValidator.Validate(data);
            data.schemaVersion=2; Reject(()=>CampaignValidator.Validate(data)); data.schemaVersion=1;
            data.stages=new[]{stage,stage}; Reject(()=>CampaignValidator.Validate(data));
            data.stages=new[]{Sample()}; data.stages[0].scenes[0].lines[0].text=" "; Reject(()=>CampaignValidator.Validate(data));
            data.stages=new[]{Sample()}; data.stages[0].scenes[0].actors=new[]{new ActorData{texture="x",x=float.NaN}}; Reject(()=>CampaignValidator.Validate(data));
            Console.WriteLine("PASS: progression boundaries, reset, invalid data, duplicate IDs, schema and actor validation"); return 0;
        }
        catch(Exception e) { Console.Error.WriteLine(e); return 1; }
    }
}
