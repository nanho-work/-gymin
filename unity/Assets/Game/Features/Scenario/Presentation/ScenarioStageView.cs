using System;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Scenario
{
    public static class ScenarioStageView
    {
        public static void Draw(SceneData scene,TextureCatalog textures,GUIStyle label)
        {
            var background=textures.Get(scene.background);
            var area=new Rect(285,105,970,430);
            if(background!=null) GUI.DrawTexture(area,background,ScaleMode.ScaleToFit);
            else GUI.Box(area,"대본 연결 완료 · 시각 연출 배치 준비 중");
            foreach(var actor in scene.actors ?? Array.Empty<ActorData>())
            {
                GUI.DrawTexture(new Rect(area.x+actor.x*area.width-80,310,160,160),textures.Get(actor.texture),ScaleMode.ScaleToFit,true);
                GUI.Label(new Rect(area.x+actor.x*area.width-60,470,150,30),actor.name,label);
            }
        }
    }
}
