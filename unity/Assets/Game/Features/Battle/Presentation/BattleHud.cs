using System;
using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.Assets;
using Sanha.Shared.UI;
namespace Sanha.Battle
{
    // Screen-space controls. Map remains edge-to-edge; only HUD observes the safe area.
    public sealed class BattleHud
    {
        readonly BattleController battle;readonly BattleBoardView board;readonly UnitDeployment units;readonly TextureCatalog textures;readonly Action home;
        readonly List<Rect> hitAreas=new List<Rect>();
        bool menu,log,confirmHome,confirmEnd,intro;string introSpeaker,introText,lastDialogue,chooser;int actionPage;Action introDone;Vector2 logScroll,dialogueScroll;
        float s,styleScale;Font styleFont;Rect safe;GUIStyle text,small,button,title,barText;
        bool Dialogue=>battle.Snapshot?.pending!=null&&Array.Exists(new[]{"dialogue","tutorial","choice","notice"},k=>k==battle.Snapshot.pending.kind);
        public bool PausesBattle=>intro||menu||log||confirmHome||confirmEnd||chooser!=null;
        public bool Modal=>PausesBattle||Dialogue||battle.Failed||battle.Snapshot?.outcome!="battle";
        public BattleHud(BattleController controller,BattleBoardView map,UnitDeployment data,TextureCatalog images,Action returnHome){battle=controller;board=map;units=data;textures=images;home=returnHome;}
        public void Reset(){menu=log=confirmHome=confirmEnd=intro=false;lastDialogue=null;chooser=null;actionPage=0;dialogueScroll=logScroll=Vector2.zero;}
        public void ShowIntroduction(string speaker,string message,Action done){intro=true;introSpeaker=speaker;introText=message;introDone=done;}
        public bool BlocksPointer(Vector2 p){if(Modal)return true;foreach(var r in hitAreas)if(r.Contains(p))return true;return false;}
        Rect R(float x,float y,float w,float h)=>new Rect(x,y,w*s,h*s);
        void Panel(Rect r){hitAreas.Add(r);var old=GUI.color;GUI.color=new Color(.035f,.075f,.06f,.9f);GUI.DrawTexture(r,Texture2D.whiteTexture);GUI.color=old;}
        bool Button(Rect r,string label,bool enabled=true){hitAreas.Add(r);bool old=GUI.enabled;GUI.enabled=old&&enabled;bool clicked=GUI.Button(r,label,button);GUI.enabled=old;return clicked;}
        public void Draw(Font font)
        {
            s=MobileScreen.Scale;safe=MobileScreen.SafeArea;hitAreas.Clear();
            if(text==null||styleFont!=font||!Mathf.Approximately(styleScale,s)){
                styleFont=font;styleScale=s;
            text=new GUIStyle(GUI.skin.label){font=font,fontSize=Mathf.RoundToInt(17*s),wordWrap=true,richText=false,normal={textColor=new Color(.96f,.94f,.84f)}};
            small=new GUIStyle(text){fontSize=Mathf.RoundToInt(13*s)};title=new GUIStyle(text){fontSize=Mathf.RoundToInt(20*s),fontStyle=FontStyle.Bold};
            button=new GUIStyle(GUI.skin.button){font=font,fontSize=Mathf.RoundToInt(16*s),wordWrap=true,padding=new RectOffset(4,4,4,4)};
                barText=new GUIStyle(small){alignment=TextAnchor.MiddleCenter,fontSize=Mathf.RoundToInt(11*s)};
            }
            var state=battle.Snapshot;
            if(state==null){var r=Center(490,200);Panel(r);GUI.Label(new Rect(r.x+16*s,r.y+16*s,r.width-32*s,r.height-80*s),battle.Message,text);if(Button(new Rect(r.x+16*s,r.yMax-58*s,r.width-32*s,46*s),"다시 연결"))battle.Begin();return;}
            battle.Feedback.Draw(font);DrawUnitCard(state);
            float right=safe.xMax-12*s,top=safe.y+12*s;
            var turn=R(right-172*s,top,108,48);Panel(turn);GUI.Label(new Rect(turn.x+7*s,turn.y+3*s,turn.width-14*s,turn.height-6*s),$"{state.round}/20턴 · {(state.side==0?"아군":state.side==1?"적군":"동맹")}",small);
            if(Button(R(right-56*s,top,56,48),"메뉴",!intro&&!Dialogue&&!log&&!confirmEnd&&!confirmHome&&chooser==null&&!battle.Failed&&state.outcome=="battle"))menu=!menu;
            if(Button(R(right-48*s,top+64*s,48,48),"+",!Modal))board.Zoom(.8f);
            if(Button(R(right-48*s,top+120*s,48,48),"−",!Modal))board.Zoom(1.25f);
            float bottom=safe.yMax-12*s;
            if(Button(R(safe.x+12*s,bottom-48*s,92,48),"턴 종료",!Modal&&!battle.Targeting.Active&&!battle.IsBusy&&!battle.Failed&&state.side==0&&state.outcome=="battle"&&state.pendingMove<0))confirmEnd=true;
            if(Button(R(safe.x+12*s,bottom-104*s,92,48),"전체 지도",!Modal))board.Fit();
            var actor=state.Find(battle.Selected);bool actions=state.side==0&&!Modal&&!battle.Targeting.Active&&!battle.IsBusy&&!battle.Failed&&actor?.canAct==true;
            if(actions){
                float x=right-144*s;
                if(Button(R(x,bottom-112*s,68,48),"스킬")&&battle.OpenActions("skill")){chooser="skill";actionPage=0;}
                if(Button(R(x+76*s,bottom-112*s,68,48),"도구")&&battle.OpenActions("item")){chooser="item";actionPage=0;}
                if(Button(R(x,bottom-56*s,68,56),battle.AttackMode?"공격 취소":"공격"))battle.ToggleAttack();
                if(Button(R(x+76*s,bottom-56*s,68,56),"대기"))battle.WaitSelected();
                if(state.pendingMove>=0&&Button(R(x,bottom-168*s,144,48),"이동 취소"))battle.CancelMove();
                if(battle.AttackMode){var hint=R(safe.x+12*s,safe.y+128*s,Mathf.Min(210,safe.width/s-100),38);Panel(hint);GUI.Label(new Rect(hint.x+6*s,hint.y+3*s,hint.width-12*s,hint.height-6*s),"공격할 적을 선택하세요",small);}
            }
            if(battle.Targeting.Active&&!Modal)DrawTargeting();
            if(battle.Failed)Confirm("전투 연결을 확인해주세요.\n"+battle.Message,()=>{Reset();battle.Begin();},()=>{Reset();home();},"다시 시작","시작 화면");
            else if(state.outcome!="battle")DrawResult(state);
            else if(confirmHome)Confirm("시작 화면으로 돌아갈까요?\n진행 중인 전투는 새 게임에서 초기화됩니다.",()=>{Reset();home();},()=>confirmHome=false);
            else if(confirmEnd)Confirm("아군 턴을 종료할까요?",()=>{confirmEnd=false;battle.EndTurn();},()=>confirmEnd=false);
            else if(log)DrawLog(state);
            else if(menu)DrawMenu();
            else if(chooser!=null)DrawActionPicker();
            else if(intro)DrawDialogue(introSpeaker,introText,"도입",false,()=>{intro=false;introDone?.Invoke();},null);
            else if(Dialogue){var p=state.pending;DrawDialogue(p.id>=0?battle.UnitName(p.id):"전장 안내",battle.DisplayText(p.text),p.token,p.kind=="tutorial"||p.kind=="choice",()=>battle.Acknowledge(1),()=>battle.Acknowledge(2));}
        }

        void DrawActionPicker()
        {
            var r=Center(620,430);Panel(r);var options=battle.Options(chooser);int perPage=Mathf.Max(1,Mathf.FloorToInt((r.height/s-122)/80));int pages=Mathf.Max(1,(options.Length+perPage-1)/perPage);actionPage=Mathf.Clamp(actionPage,0,pages-1);
            GUI.Label(new Rect(r.x+14*s,r.y+10*s,r.width-28*s,30*s),(chooser=="skill"?"스킬":"도구")+$" · {actionPage+1}/{pages}",title);
            if(options.Length==0)GUI.Label(new Rect(r.x+18*s,r.y+65*s,r.width-36*s,80*s),chooser=="skill"?"이 부대가 배운 스킬이 없습니다.":"보유한 사용 도구가 없습니다.",text);
            for(int row=0;row<perPage;row++){
                int index=actionPage*perPage+row;if(index>=options.Length)break;var option=options[index];var area=new Rect(r.x+12*s,r.y+(48+row*80)*s,r.width-24*s,74*s);
                if(Button(area,"",option.enabled)&&battle.ChooseAction(chooser,option.id)){chooser=null;return;}
                float x=area.x+10*s;if(!string.IsNullOrEmpty(option.icon)){GUI.DrawTexture(R(x,area.y+12*s,46,46),textures.Get(option.icon),ScaleMode.ScaleToFit);x+=56*s;}
                float w=area.xMax-x-10*s;string price=chooser=="skill"?$" · MP {option.cost}":$" · {option.count}개";
                GUI.Label(new Rect(x,area.y+4*s,w,24*s),option.name+price,text);
                GUI.Label(new Rect(x,area.y+29*s,w,39*s),option.enabled?option.description:option.reason,small);
            }
            float bw=(r.width-48*s)/3,y=r.yMax-58*s;
            if(Button(new Rect(r.x+12*s,y,bw,46*s),"이전",actionPage>0))actionPage--;
            if(Button(new Rect(r.x+24*s+bw,y,bw,46*s),"닫기")){chooser=null;battle.CancelAction();}
            if(Button(new Rect(r.xMax-12*s-bw,y,bw,46*s),"다음",actionPage+1<pages))actionPage++;
        }
        void DrawTargeting()
        {
            var selection=battle.Targeting;var preview=selection.Preview;var option=battle.ChosenAction;var label=battle.ActionLabel(selection.Kind,selection.Id);
            float w=Mathf.Min(302,safe.width/s-124),bottom=safe.yMax-12*s;var r=R(safe.xMax-(w+12)*s,bottom-162*s,w,162);Panel(r);
            GUI.Label(new Rect(r.x+10*s,r.y+6*s,r.width-20*s,25*s),label?.name??"대상 선택",text);
            string cost=selection.Kind=="skill"?$"MP {option?.cost??0} 사용":$"보유 {option?.count??0}개 · 1개 사용";
            GUI.Label(new Rect(r.x+10*s,r.y+33*s,r.width-20*s,22*s),cost,small);
            string target=preview?.target>=0?battle.UnitName(preview.target):"대상을 선택하세요";
            string description=preview?.valid==true?target+$" · 영향 후보 {preview.affected?.Length??0}명":preview?.reason??"지도에서 대상을 선택하세요";
            GUI.Label(new Rect(r.x+10*s,r.y+58*s,r.width-20*s,43*s),description,small);
            float bw=(r.width-30*s)/2;
            if(Button(new Rect(r.x+10*s,r.yMax-56*s,bw,46*s),"취소"))battle.CancelAction();
            if(Button(new Rect(r.xMax-10*s-bw,r.yMax-56*s,bw,46*s),"사용",selection.CanConfirm))battle.UseSelectedAction();
            var legend=R(safe.x+12*s,safe.y+128*s,Mathf.Min(310,safe.width/s-85),45);Panel(legend);
            GUI.Label(new Rect(legend.x+7*s,legend.y+3*s,legend.width-14*s,legend.height-6*s),"파랑: 사거리 · 초록: 대상\n주황: 효과 범위 · 노랑: 영향 후보",small);
        }
        void DrawUnitCard(BattleSnapshot state)
        {
            var actor=state.Find(battle.Selected);float width=Mathf.Min(actor==null?195:285,safe.width/s-208);
            width=Mathf.Max(92,width);var r=R(safe.x+12*s,safe.y+12*s,width,actor==null?54:104);Panel(r);
            if(actor==null){GUI.Label(new Rect(r.x+10*s,r.y+7*s,r.width-20*s,r.height-14*s),"부대를 선택하세요",small);return;}
            var unit=Array.Find(units.units,u=>u.id==actor.id);float left=r.x+10*s;
            if(width>=240&&unit!=null){GUI.DrawTexture(R(left,r.y+8*s,48,80),textures.Get(unit.texture),ScaleMode.ScaleToFit);left+=58*s;}
            float w=r.xMax-left-10*s;
            GUI.Label(new Rect(left,r.y+6*s,w,25*s),battle.UnitName(actor.id)+(width<200?"":" · Lv."+actor.level),text);
            GUI.Label(new Rect(left,r.y+33*s,w,20*s),(width<200?"Lv."+actor.level+" · ":"")+(unit?.jobName??""),small);
            Bar(new Rect(left,r.y+58*s,w,16*s),battle.Feedback.HP(actor),actor.maxHP,new Color(.22f,.65f,.37f),"HP");
            Bar(new Rect(left,r.y+80*s,w,16*s),battle.Feedback.MP(actor),actor.maxMP,new Color(.25f,.52f,.85f),"MP");
        }
        void Bar(Rect r,int value,int max,Color fill,string label)
        {
            var old=GUI.color;GUI.color=new Color(.05f,.07f,.06f,.9f);GUI.DrawTexture(r,Texture2D.whiteTexture);GUI.color=fill;GUI.DrawTexture(new Rect(r.x,r.y,r.width*Mathf.Clamp01(value/(float)Mathf.Max(1,max)),r.height),Texture2D.whiteTexture);GUI.color=old;
            GUI.Label(r,$"{label} {value}/{max}",barText);
        }
        Rect Center(float width,float height){float w=Mathf.Min(width*s,safe.width-24*s),h=Mathf.Min(height*s,safe.height-24*s);return new Rect(safe.center.x-w/2,safe.center.y-h/2,w,h);}
        void DrawMenu()
        {
            var r=Center(350,250);Panel(r);float x=r.x+12*s,w=(r.width-32*s)/2,y=r.y+48*s;
            GUI.Label(new Rect(x,r.y+10*s,r.width-24*s,30*s),"메뉴",title);
            if(Button(new Rect(x,y,w,48*s),"기본 배율로")){board.ResetView();menu=false;}
            if(Button(new Rect(x+w+8*s,y,w,48*s),board.GridVisible?"격자 숨기기":"격자 표시"))board.SetGrid(!board.GridVisible);
            if(Button(new Rect(x,y+56*s,w,48*s),"전투 기록")){menu=false;log=true;}
            if(Button(new Rect(x+w+8*s,y+56*s,w,48*s),"시작 화면")){menu=false;confirmHome=true;}
            if(Button(new Rect(x,r.yMax-60*s,r.width-24*s,48*s),"닫기"))menu=false;
        }

        void DrawLog(BattleSnapshot state)
        {
            var r=Center(610,380);Panel(r);GUI.Label(new Rect(r.x+14*s,r.y+10*s,r.width-28*s,28*s),"전투 기록",title);
            string content=battle.DisplayText(string.Join("\n",state.log??Array.Empty<string>()))+"\n\n미보유 자료: "+string.Join(", ",battle.Omitted)+"\n미복원 명령: "+string.Join(",",state.unsupported??Array.Empty<int>());
            var area=new Rect(r.x+14*s,r.y+48*s,r.width-28*s,r.height-112*s);float height=small.CalcHeight(new GUIContent(content),area.width-24*s);
            logScroll=GUI.BeginScrollView(area,logScroll,new Rect(0,0,area.width-24*s,Mathf.Max(height,area.height)));GUI.Label(new Rect(0,0,area.width-24*s,height),content,small);GUI.EndScrollView();
            if(Button(new Rect(r.x+14*s,r.yMax-52*s,r.width-28*s,42*s),"닫기"))log=false;
        }
        void DrawDialogue(string speaker,string message,string token,bool choice,Action yes,Action no)
        {
            if(lastDialogue!=token){lastDialogue=token;dialogueScroll=Vector2.zero;}
            float height=Mathf.Min(195*s,safe.height*.55f);var r=new Rect(safe.x+12*s,safe.yMax-height-12*s,safe.width-24*s,height);Panel(r);
            float controls=choice?96:84;var body=new Rect(r.x+14*s,r.y+43*s,r.width-(controls+42)*s,r.height-55*s);
            GUI.Label(new Rect(r.x+14*s,r.y+8*s,r.width-28*s,30*s),speaker,title);
            float h=text.CalcHeight(new GUIContent(message),body.width-18*s);dialogueScroll=GUI.BeginScrollView(body,dialogueScroll,new Rect(0,0,body.width-18*s,Mathf.Max(body.height,h)));GUI.Label(new Rect(0,0,body.width-18*s,h),message,text);GUI.EndScrollView();
            float x=r.xMax-(controls+12)*s;
            if(choice){if(Button(R(x,r.y+49*s,controls,48),"예"))yes();if(Button(R(x,r.y+105*s,controls,48),"아니오"))no();}
            else if(Button(R(x,r.yMax-64*s,controls,48),"다음"))yes();
        }
        void Confirm(string message,Action yes,Action no,string positive="확인",string negative="취소")
        {
            var r=Center(470,220);Panel(r);GUI.Label(new Rect(r.x+16*s,r.y+16*s,r.width-32*s,r.height-88*s),message,text);
            float w=(r.width-40*s)/2;if(Button(new Rect(r.x+12*s,r.yMax-60*s,w,48*s),negative))no();if(Button(new Rect(r.xMax-12*s-w,r.yMax-60*s,w,48*s),positive))yes();
        }
        void DrawResult(BattleSnapshot state)
        {
            var r=Center(470,270);Panel(r);GUI.Label(new Rect(r.x+20*s,r.y+16*s,r.width-40*s,40*s),state.outcome=="victory"?"승리":"패배",title);
            GUI.Label(new Rect(r.x+20*s,r.y+65*s,r.width-40*s,90*s),$"{state.round}턴\n보유 금 {state.money}\n보관 아이템 {state.inventory?.Length??0}개",text);
            if(Button(new Rect(r.x+16*s,r.yMax-104*s,r.width-32*s,42*s),"첫 전투 다시 시작")){Reset();battle.Begin();board.ResetView();}
            if(Button(new Rect(r.x+16*s,r.yMax-56*s,r.width-32*s,42*s),"시작 화면"))home();
        }
    }
}
