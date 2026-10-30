using System;
using System.Linq;
using UnityEngine;
using Sanha.Scenario;
using Sanha.Battle;
using Sanha.Shared.Assets;
using Sanha.Shared.Configuration;
using Sanha.Shared.UI;
namespace Sanha.Campaign
{
    public sealed class GameFlowScreen : MonoBehaviour
    {
        readonly GameFlow flow=new GameFlow();
        readonly ScenarioCursor intro=new ScenarioCursor();
        RuntimeSettings settings;
        TextureCatalog textures;
        StageData stage,introStage;
        SceneData battleIntro;
        BoardData board;
        UnitDeployment deployment;
        Vector2 rosterScroll;
        BattleBoardView boardView;
        BattleController combat;
        bool combatStarted;
        Font font;
        bool confirmTitle,showBattleIntro;
        public void Initialize(ICampaignRepository repository,RuntimeSettings configuration,TextureCatalog catalog,BoardData boardData,UnitDeployment units,Func<IBattleSession> openBattle)
        {
            settings=configuration;textures=catalog;board=boardData;deployment=units;
            stage=repository.Load().stages.Single(x=>x.id==board.stageId);
            introStage=new StageData{id=stage.id,title=stage.title,scenes=board.introSceneIds.Select(id=>stage.scenes.Single(x=>x.id==id)).ToArray()};
            battleIntro=stage.scenes.Single(x=>x.id==board.battleIntroSceneId);intro.Load(introStage);
            font=Font.CreateDynamicFontFromOSFont(settings.fontNames,settings.fontSize);
            boardView=gameObject.AddComponent<BattleBoardView>();boardView.Initialize(board,textures,units);
            combat=gameObject.AddComponent<BattleController>();combat.Initialize(units,boardView,textures,openBattle);
        }
        void StartNew(){combatStarted=false;intro.Load(introStage);boardView.ClearSelection();boardView.Fit();confirmTitle=false;flow.StartNew();}
        void OnGUI()
        {
            if(boardView==null)return;
            combat.Active=flow.Screen==GameScreen.Battle&&!showBattleIntro&&!confirmTitle;
            boardView.UpdateViewport();
            if(flow.Screen==GameScreen.Battle&&!confirmTitle&&!showBattleIntro&&!combat.IsBusy)boardView.HandleInput(Event.current);
            using(new GuiViewport(1280,800,font))
            {
                var text=new GUIStyle(GUI.skin.label){fontSize=20,wordWrap=true};var small=new GUIStyle(text){fontSize=16};
                if(flow.Screen!=GameScreen.Battle)GUI.Box(new Rect(0,0,1280,800),"");
                GUI.Label(new Rect(24,18,950,42),"산하의 맹약 · "+stage.title+"  /  "+ScreenName(),text);
                if(flow.Screen!=GameScreen.Title && GUI.Button(new Rect(1115,20,140,42),"시작 화면"))confirmTitle=true;
                if(flow.Screen==GameScreen.Title)
                {
                    GUI.DrawTexture(new Rect(150,90,980,440),textures.Get(introStage.scenes[0].background),ScaleMode.ScaleToFit);
                    GUI.Label(new Rect(420,545,500,45),"산하의 맹약",new GUIStyle(text){fontSize=32});
                    if(GUI.Button(new Rect(470,610,340,65),"새 게임 · 첫 스테이지"))StartNew();
                    GUI.Label(new Rect(340,705,660,60),"첫 전투 macOS 테스트\n이동·취소·대기·공격·턴 진행·승패",small);
                }
                else if(flow.Screen==GameScreen.Scenario)
                {
                    GUI.Label(new Rect(285,65,970,35),intro.Scene.type,text);ScenarioStageView.Draw(intro.Scene,textures,small);
                    DialoguePanel.Draw(new Rect(285,545,970,145),intro.Line.speaker,intro.Line.text,text);
                    GUI.enabled=!intro.AtStart;if(GUI.Button(new Rect(285,710,130,48),"이전"))intro.Previous();GUI.enabled=true;
                    if(GUI.Button(new Rect(430,710,220,48),intro.AtEnd?"출진 준비로":"다음")){if(intro.AtEnd)flow.FinishIntroduction(true);else intro.Next();}
                    GUI.Label(new Rect(680,720,500,40),$"장면 {intro.SceneIndex+1}/{introStage.scenes.Length} · 대사 {intro.LineIndex+1}/{intro.Scene.lines.Length}",small);
                }
                else if(flow.Screen==GameScreen.Preparation)
                {
                    GUI.Label(new Rect(120,100,1040,60),"출진 준비",new GUIStyle(text){fontSize=30});
                    GUI.DrawTexture(new Rect(120,185,500,430),textures.Get(board.background),ScaleMode.ScaleToFit);
                    GUI.Label(new Rect(680,180,480,175),$"남쪽 길을 막은 세력과의 전장을 확인한다.\n\n전장: {board.width} × {board.height}칸\n기존 지형·배경 적용\n\n원본 도입 직후 배치를 적용했습니다.\n왕건 부대는 등장 이벤트 대기 상태입니다.",text);
                    rosterScroll=GUI.BeginScrollView(new Rect(680,370,480,165),rosterScroll,new Rect(0,0,455,deployment.units.Length*34));
                    for(int i=0;i<deployment.units.Length;i++){var u=deployment.units[i];GUI.Label(new Rect(0,i*34,455,34),$"{u.SideName} · {u.name} · {(u.state=="deployed"?"배치":u.state=="reserve"?"등장 대기":"도입 퇴장")}",small);}
                    GUI.EndScrollView();
                    if(GUI.Button(new Rect(680,550,380,65),"전장 진입")){flow.EnterBoard();if(!combatStarted){combat.Begin();combatStarted=true;}showBattleIntro=true;boardView.SetVisible(true);boardView.Fit();}
                    if(GUI.Button(new Rect(680,635,380,45),"도입 이야기 다시 보기")){intro.Load(introStage);flow.StartNew();}
                }
                else
                {
                    combat.Draw(text,small);
                    if(GUI.Button(new Rect(960,710,270,35),"전장 전체 보기"))boardView.Fit();
                    if(showBattleIntro){GUI.Box(new Rect(35,610,870,130),"");DialoguePanel.Draw(new Rect(45,615,700,115),battleIntro.lines[0].speaker,battleIntro.lines[0].text,small);if(GUI.Button(new Rect(755,660,130,50),"전장 확인"))showBattleIntro=false;}
                    GUI.Label(new Rect(24,760,1100,30),"macOS 로컬 전투 테스트 · 기존 복원 엔진 사용 · 미보유 음원/모션은 미적용 표시",small);
                }
                if(confirmTitle)
                {
                    GUI.ModalWindow(109,new Rect(350,275,580,230),id=>{
                        GUI.Label(new Rect(30,50,520,65),"시작 화면으로 돌아갈까요?\n새 게임을 누르면 도입부터 시작합니다.",text);
                        if(GUI.Button(new Rect(35,145,230,50),"취소"))confirmTitle=false;
                        if(GUI.Button(new Rect(300,145,230,50),"돌아가기")){combat.Suspend();flow.ReturnToTitle();boardView.SetVisible(false);confirmTitle=false;}
                    },"시작 화면");
                }
            }
        }
        string ScreenName()=>flow.Screen==GameScreen.Title?"시작":flow.Screen==GameScreen.Scenario?"이야기":flow.Screen==GameScreen.Preparation?"출진 준비":"전장";
        void OnDestroy(){if(font!=null)Destroy(font);}
    }
}
