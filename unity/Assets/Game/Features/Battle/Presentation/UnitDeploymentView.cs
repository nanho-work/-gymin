using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    public sealed class UnitDeploymentView : MonoBehaviour
    {
        readonly Dictionary<string,Sprite> sprites=new Dictionary<string,Sprite>();
        Material material;
        public void Initialize(UnitDeployment data,Transform board,TextureCatalog textures)
        {
            transform.SetParent(board,false);material=new Material(Shader.Find("Sprites/Default"));
            foreach(var u in data.units){
                if(!u.IsOnBoard)continue;
                if(!sprites.TryGetValue(u.texture,out var sprite)){
                    var t=textures.Get(u.texture);sprite=Sprite.Create(t,new Rect(0,0,t.width,t.height),new Vector2(.5f,0),100);sprites.Add(u.texture,sprite);
                }
                var item=new GameObject(u.SideName+" · "+u.name+" #"+u.id);item.transform.SetParent(transform,false);item.layer=30;
                item.transform.localPosition=new Vector3(u.x+.5f,-u.y-.90f,-.2f);
                float scale=Mathf.Min(1.05f/sprite.bounds.size.x,1.35f/sprite.bounds.size.y);item.transform.localScale=Vector3.one*scale*.75f;
                var renderer=item.AddComponent<SpriteRenderer>();renderer.sprite=sprite;renderer.sortingOrder=100+u.y;
                var badge=new GameObject("진영 표시");badge.transform.SetParent(transform,false);badge.layer=30;
                badge.transform.localPosition=new Vector3(u.x+.5f,-u.y-.91f,-.15f);
                var line=badge.AddComponent<LineRenderer>();line.sharedMaterial=material;line.useWorldSpace=false;line.positionCount=25;line.startWidth=line.endWidth=.055f;
                Color color=u.side==0?new Color(.25f,.65f,1):u.side==1?new Color(1,.3f,.25f):new Color(.35f,1,.5f);line.startColor=line.endColor=color;line.sortingOrder=50;
                for(int i=0;i<25;i++){float a=i*Mathf.PI*2/24;line.SetPosition(i,new Vector3(Mathf.Cos(a)*.285f,Mathf.Sin(a)*.09f,0));}
            }
        }
        void OnDestroy(){foreach(var s in sprites.Values)Destroy(s);if(material!=null)Destroy(material);}
    }
}
