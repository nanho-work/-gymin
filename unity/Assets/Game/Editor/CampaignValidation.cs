using System;
using UnityEditor;
using UnityEngine;
using Sanha.Scenario;
using Sanha.Shared.Assets;
using Sanha.Shared.Configuration;
namespace Sanha.Editor
{
    public static class CampaignValidation
    {
        [MenuItem("Sanha/Validate Campaign")]
        public static void Validate()
        {
            var board=Sanha.Battle.ResourcesBoardRepository.Load();
            var units=Sanha.Battle.ResourcesUnitRepository.Load(board);
            var settings=RuntimeSettings.Load();
            var data=new ResourcesCampaignRepository(settings.campaignResource).Load();
            if(!Array.Exists(data.stages,x=>x.id==settings.initialStageId)) throw new Exception("Invalid initialStageId");
            var textures=new TextureCatalog();
            textures.Get(board.background);
            foreach(var unit in units.units) textures.Get(unit.texture);
            var first=Array.Find(data.stages,x=>x.id==board.stageId);
            if(first==null || !Array.TrueForAll(board.introSceneIds,id=>Array.Exists(first.scenes,s=>s.id==id)) || !Array.Exists(first.scenes,s=>s.id==board.battleIntroSceneId)) throw new Exception("Invalid board flow references");
            foreach(var stage in data.stages)
            {
                var cursor=new ScenarioCursor(); cursor.Load(stage);
                int lines=0;
                foreach(var scene in stage.scenes)
                {
                    lines+=scene.lines.Length;
                    textures.Get(scene.background);
                    foreach(var actor in scene.actors??Array.Empty<ActorData>()) textures.Get(actor.texture);
                }
                for(int i=1;i<lines;i++) cursor.Next();
                if(!cursor.AtEnd) throw new Exception("End mismatch: "+stage.id);
                cursor.Next();
                if(!cursor.AtEnd) throw new Exception("Overflow: "+stage.id);
                for(int i=1;i<lines;i++) cursor.Previous();
                cursor.Previous();
                if(!cursor.AtStart) throw new Exception("Start mismatch: "+stage.id);
            }
            Debug.Log("SANHA_CAMPAIGN_VALIDATED: "+data.stages.Length+" packages");
        }
    }
}
