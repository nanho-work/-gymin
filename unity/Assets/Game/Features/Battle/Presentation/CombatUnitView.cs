using System;
using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    [Serializable] public sealed class MotionAtlas {public int id,cellWidth,frameWidth,frameHeight;public string atlas;public float ppu,pivotX,pivotY;}
    [Serializable] public sealed class MotionCatalog {public MotionAtlas[] records;}
    public sealed class CombatUnitView:MonoBehaviour
    {
        sealed class Model {public DeployedUnit source;public GameObject root;public SpriteRenderer art;public LineRenderer ring;public Sprite[] frames;public BattleActor actor;}
        readonly Dictionary<int,Model> models=new Dictionary<int,Model>();
        readonly Dictionary<string,Sprite[]> cache=new Dictionary<string,Sprite[]>();
        readonly Dictionary<int,Vector3> from=new Dictionary<int,Vector3>();
        Material material;BattlePending playing;float started,hitUntil;int hitID=-1;
        public void Initialize(UnitDeployment deployment,TextureCatalog textures)
        {
            var json=Resources.Load<TextAsset>("Battle/motions");if(json==null)throw new InvalidOperationException("Run export-unity-motion.mjs");var catalog=JsonUtility.FromJson<MotionCatalog>(json.text);
            material=new Material(Shader.Find("Sprites/Default"));
            foreach(var u in deployment.units){
                var atlas=Array.Find(catalog.records,x=>x.id==u.id);if(atlas==null)throw new InvalidOperationException("Missing unit motion "+u.id);
                if(!cache.TryGetValue(atlas.atlas,out var frames)){
                    var tex=textures.Get(atlas.atlas);frames=new Sprite[64];for(int i=0;i<64;i++)frames[i]=Sprite.Create(tex,new Rect((i%8)*64,512-(i/8)*64-atlas.frameHeight,atlas.frameWidth,atlas.frameHeight),new Vector2(atlas.pivotX,atlas.pivotY),atlas.ppu);cache[atlas.atlas]=frames;
                }
                var obj=new GameObject(u.name+" #"+u.id);obj.transform.SetParent(transform,false);obj.layer=30;obj.transform.localScale=Vector3.one*.75f;
                var art=obj.AddComponent<SpriteRenderer>();art.sprite=frames[0];
                var ringObj=new GameObject("진영/행동 표시");ringObj.transform.SetParent(obj.transform,false);ringObj.layer=30;
                var ring=ringObj.AddComponent<LineRenderer>();ring.sharedMaterial=material;ring.useWorldSpace=false;ring.positionCount=25;ring.startWidth=ring.endWidth=.05f;ring.sortingOrder=50;
                for(int i=0;i<25;i++){float a=i*Mathf.PI*2/24;ring.SetPosition(i,new Vector3(Mathf.Cos(a)*.38f,Mathf.Sin(a)*.12f,.05f));}
                models[u.id]=new Model{source=u,root=obj,art=art,ring=ring,frames=frames};obj.SetActive(false);
            }
        }
        public void Apply(BattleSnapshot snapshot)
        {
            foreach(var actor in snapshot.units){if(!models.TryGetValue(actor.id,out var m))continue;m.actor=actor;m.root.SetActive(!actor.hidden);m.root.transform.localPosition=Position(actor.x,actor.y);m.art.sortingOrder=100+actor.y;
                Color c=actor.side==0?new Color(.25f,.65f,1):actor.side==1?new Color(1,.3f,.25f):new Color(.35f,1,.5f);m.ring.startColor=m.ring.endColor=actor.acted?Color.gray:c;m.art.color=actor.acted?new Color(.65f,.65f,.65f):Color.white;
            }
        }
        public void Play(BattlePending pending){playing=pending;started=Time.unscaledTime;if(models.TryGetValue(pending.id,out var m))from[pending.id]=m.root.transform.localPosition;}
        public void Finish(){playing=null;hitID=-1;}
        public void Hit(int id){hitID=id;hitUntil=Time.unscaledTime+.22f;}
        void Update()
        {
            foreach(var m in models.Values){if(m.actor==null||!m.root.activeSelf)continue;
                m.art.color=m.actor.acted?new Color(.65f,.65f,.65f):Color.white;if(m.actor.id==hitID&&Time.unscaledTime<hitUntil)m.art.color=new Color(1,.35f,.35f);
                int action=0,frame=(int)(Time.unscaledTime/.32f)%4,direction=m.actor.facing;
                if(playing!=null&&playing.id==m.actor.id){float t=Time.unscaledTime-started;
                    if(playing.kind=="move"){action=1;frame=(int)(t/.08f)%4;var dest=Position(playing.x,playing.y);var origin=from[m.actor.id];direction=Mathf.Abs(dest.x-origin.x)>=Mathf.Abs(dest.y-origin.y)?(dest.x<origin.x?3:1):(dest.y>origin.y?0:2);m.root.transform.localPosition=Vector3.Lerp(origin,dest,Mathf.Clamp01(t/Mathf.Max(.01f,playing.duration)));}
                    else if(playing.kind=="attack"||playing.kind=="pose"&&(playing.pose==6||playing.pose==7)){action=2;frame=(int)(t/.16f)%4;}
                    else if(playing.kind=="spell"||playing.kind=="pose"&&playing.pose==2){action=3;frame=(int)(t/.2f)%4;}
                    else if(playing.kind=="retirement")m.art.color=new Color(1,1,1,playing.pose%2==0?.35f:1);
                }
                m.art.sprite=m.frames[Mathf.Clamp(direction,0,3)*16+action*4+frame];
            }
        }
        static Vector3 Position(int x,int y)=>new Vector3(x+.5f,-y-.9f,-.2f);
        void OnDestroy(){foreach(var frames in cache.Values)foreach(var s in frames)Destroy(s);if(material!=null)Destroy(material);}
    }
}
