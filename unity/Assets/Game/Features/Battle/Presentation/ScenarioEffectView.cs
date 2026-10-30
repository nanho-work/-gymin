using System;
using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    [Serializable] public sealed class OriginalEffectFrame {public string image;public int x,y,sound;}
    [Serializable] public sealed class OriginalEffectFrames {public int id;public float seconds;public OriginalEffectFrame[] frames;}
    public sealed class ScenarioEffectView:MonoBehaviour
    {
        TextureCatalog textures;SpriteRenderer art;readonly Dictionary<string,Sprite> sprites=new Dictionary<string,Sprite>();
        public void Initialize(TextureCatalog catalog){textures=catalog;gameObject.layer=30;art=gameObject.AddComponent<SpriteRenderer>();art.sortingOrder=2000;Hide();}
        public OriginalEffectFrames Load(int id){var json=Resources.Load<TextAsset>("Battle/Presentation/mcall-"+id);if(json==null)throw new InvalidOperationException("보유 원본 특수 연출 추출 필요: "+id);return JsonUtility.FromJson<OriginalEffectFrames>(json.text);}
        public void Show(OriginalEffectFrame frame,int x,int y){
            if(string.IsNullOrEmpty(frame.image)){Hide();return;}
            if(!sprites.TryGetValue(frame.image,out var sprite)){var tex=textures.Get(frame.image);sprite=Sprite.Create(tex,new Rect(0,0,tex.width,tex.height),new Vector2(0,1),48);sprites.Add(frame.image,sprite);}
            art.sprite=sprite;art.enabled=true;transform.localPosition=new Vector3(frame.x/48f+x-10,-frame.y/48f-y+8,-1);
        }
        public void Hide(){if(art!=null)art.enabled=false;}
        void OnDestroy(){foreach(var sprite in sprites.Values)Destroy(sprite);}
    }
}
