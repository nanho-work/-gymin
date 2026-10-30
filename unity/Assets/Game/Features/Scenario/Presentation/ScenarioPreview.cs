using System;
using UnityEngine;
using Sanha.Shared.Assets;
using Sanha.Shared.Configuration;
using Sanha.Shared.UI;
namespace Sanha.Scenario
{
    // Feature screen: dependencies are injected by AppBootstrap.
    public sealed class ScenarioPreview : MonoBehaviour
    {
        CampaignData data;
        RuntimeSettings settings;
        TextureCatalog textures;
        readonly ScenarioCursor cursor=new ScenarioCursor();
        Vector2 stageScroll;
        Font font;
        public void Initialize(ICampaignRepository repository,RuntimeSettings configuration,TextureCatalog catalog)
        {
            settings=configuration; textures=catalog;
            var loaded=repository.Load();
            var initial=Array.Find(loaded.stages,x=>x.id==settings.initialStageId);
            if(initial==null) throw new InvalidOperationException("Unknown initialStageId: "+settings.initialStageId);
            cursor.Load(initial);
            font=Font.CreateDynamicFontFromOSFont(settings.fontNames,settings.fontSize);
            data=loaded;
        }
        void OnDestroy() { if(font!=null) Destroy(font); }
        void OnGUI()
        {
            if(data==null) return;
            using(new GuiViewport(settings.referenceWidth,settings.referenceHeight,font))
            {
                var text=new GUIStyle(GUI.skin.label){fontSize=settings.fontSize,wordWrap=true};
                var small=new GUIStyle(text){fontSize=14};
                GUI.Box(new Rect(0,0,settings.referenceWidth,settings.referenceHeight),"");
                GUI.Label(new Rect(20,15,1240,40),"산하의 맹약 · Unity 시나리오 개발 미리보기",text);
                stageScroll=GUI.BeginScrollView(new Rect(20,65,245,700),stageScroll,new Rect(0,0,220,data.stages.Length*55));
                for(int i=0;i<data.stages.Length;i++)
                {
                    var stage=data.stages[i];
                    if(GUI.Button(new Rect(0,i*55,215,50),stage.id+" · "+stage.title)) cursor.Load(stage);
                }
                GUI.EndScrollView();
                GUI.Label(new Rect(285,60,970,35),cursor.Stage.title+" / "+cursor.Scene.type,text);
                ScenarioStageView.Draw(cursor.Scene,textures,small);
                DialoguePanel.Draw(new Rect(285,545,970,150),cursor.Line.speaker,cursor.Line.text,text);
                PlaybackControls.Draw(new Vector2(285,710),cursor.AtStart,cursor.AtEnd,cursor.Previous,cursor.Next,()=>cursor.SelectScene(0));
                GUI.Label(new Rect(710,715,540,35),$"장면 {cursor.SceneIndex+1}/{cursor.Stage.scenes.Length} · 대사 {cursor.LineIndex+1}/{cursor.Scene.lines.Length}",small);
                GUI.Label(new Rect(285,760,970,30),"기존 에셋 임시 연출 · 전투/승패/보상 판정 미구현 · macOS 검토용",small);
            }
        }
    }
}
