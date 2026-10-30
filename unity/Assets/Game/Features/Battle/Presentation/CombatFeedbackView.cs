using System;
using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.UI;
namespace Sanha.Battle
{
    // Screen-sized typography anchored to the map. Reuses the bundled font; no new textures.
    public sealed class CombatFeedbackView
    {
        sealed class Entry {public CombatFeedback value;public float started;}
        readonly List<Entry> entries=new List<Entry>();readonly List<Rect> placed=new List<Rect>();readonly BattleBoardView board;
        GUIStyle label,tiny;Font lastFont;float lastScale;
        public CombatFeedbackView(BattleBoardView map){board=map;}
        public void Clear()=>entries.Clear();
        public void Show(CombatFeedback[] values){foreach(var value in values??Array.Empty<CombatFeedback>())entries.Add(new Entry{value=value,started=Time.unscaledTime});if(entries.Count>48)entries.RemoveRange(0,entries.Count-48);}
        Entry Latest(int id){for(int i=entries.Count-1;i>=0;i--)if(entries[i].value.id==id)return entries[i];return null;}
        public int HP(BattleActor actor){var e=Latest(actor.id);return e!=null&&Time.unscaledTime-e.started<.5f?e.value.AnimatedHP((Time.unscaledTime-e.started)/.5f):actor.hp;}
        public int MP(BattleActor actor){var e=Latest(actor.id);return e!=null&&Time.unscaledTime-e.started<.5f?e.value.AnimatedMP((Time.unscaledTime-e.started)/.5f):actor.mp;}
        public void Draw(Font font)
        {
            float now=Time.unscaledTime,s=MobileScreen.Scale;var safe=MobileScreen.SafeArea;entries.RemoveAll(e=>now-e.started>2.1f);placed.Clear();
            if(label==null||lastFont!=font||!Mathf.Approximately(lastScale,s)){lastFont=font;lastScale=s;label=new GUIStyle(GUI.skin.label){font=font,fontSize=Mathf.RoundToInt(21*s),fontStyle=FontStyle.Bold,alignment=TextAnchor.MiddleCenter,richText=false,wordWrap=false};tiny=new GUIStyle(label){fontStyle=FontStyle.Normal,fontSize=Mathf.RoundToInt(10*s)};}
            foreach(var e in entries){
                var v=e.value;float age=now-e.started;if(!board.ProjectAboveTile(v.x,v.y,out var point))continue;
                if(Latest(v.id)==e)DrawVitals(new Rect(point.x-43*s,point.y-12*s,86*s,28*s),v,age,s);
                if(age>1.1f)continue;
                int count=(v.Outcome.Length>0?1:0)+(v.HPText.Length>0?1:0)+(v.MPDelta!=0?1:0);if(count==0)continue;
                var r=new Rect(point.x-64*s,point.y-(22+count*25)*s-Mathf.Clamp01(age/.9f)*22*s,128*s,count*25*s);
                for(int lane=0;lane<5&&placed.Exists(p=>p.Overlaps(r));lane++)r.y-=26*s;
                r.x=Mathf.Clamp(r.x,safe.xMin+4*s,Mathf.Max(safe.xMin+4*s,safe.xMax-r.width-4*s));r.y=Mathf.Clamp(r.y,safe.yMin+4*s,Mathf.Max(safe.yMin+4*s,safe.yMax-r.height-4*s));placed.Add(r);
                float alpha=Mathf.Clamp01((1.1f-age)/.3f),y=r.y;
                if(v.Outcome.Length>0){Text(new Rect(r.x,y,r.width,25*s),v.Outcome,v.Miss?new Color(.9f,.92f,1):v.critical?new Color(1,.82f,.2f):Color.white,alpha,s);y+=25*s;}
                if(v.HPText.Length>0){Text(new Rect(r.x,y,r.width,25*s),v.HPText,v.HPDelta>0?new Color(.35f,1,.5f):v.HPDelta==0?Color.white:new Color(1,.4f,.28f),alpha,s);y+=25*s;}
                if(v.MPDelta!=0)Text(new Rect(r.x,y,r.width,25*s),v.MPText,new Color(.4f,.78f,1),alpha,s);
            }
        }
        void DrawVitals(Rect r,CombatFeedback v,float age,float s){float t=Mathf.Clamp01(age/.5f),alpha=Mathf.Clamp01((2.1f-age)/.35f);Bar(new Rect(r.x,r.y,r.width,12*s),v.AnimatedHP(t),v.maxHP,new Color(.22f,.7f,.35f),"HP",alpha);Bar(new Rect(r.x,r.y+15*s,r.width,12*s),v.AnimatedMP(t),v.maxMP,new Color(.25f,.5f,.9f),"MP",alpha);}
        void Bar(Rect r,int value,int max,Color color,string name,float alpha){var old=GUI.color;GUI.color=new Color(.02f,.03f,.025f,.95f*alpha);GUI.DrawTexture(r,Texture2D.whiteTexture);color.a=alpha;GUI.color=color;GUI.DrawTexture(new Rect(r.x,r.y,r.width*Mathf.Clamp01(value/(float)Mathf.Max(1,max)),r.height),Texture2D.whiteTexture);GUI.color=old;tiny.normal.textColor=new Color(1,1,1,alpha);GUI.Label(r,$"{name} {value}/{max}",tiny);}
        void Text(Rect r,string text,Color color,float alpha,float s){label.normal.textColor=new Color(0,0,0,alpha);foreach(var offset in new[]{new Vector2(-s,0),new Vector2(s,0),new Vector2(0,-s),new Vector2(0,s)})GUI.Label(new Rect(r.x+offset.x,r.y+offset.y,r.width,r.height),text,label);color.a=alpha;label.normal.textColor=color;GUI.Label(r,text,label);}
    }
}
