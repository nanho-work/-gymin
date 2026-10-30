using System;
using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    public sealed class ItemUseView:MonoBehaviour
    {
        SpriteRenderer art;TextureCatalog textures;ActionCatalog catalog;readonly Dictionary<int,Sprite> sprites=new Dictionary<int,Sprite>();
        public void Initialize(TextureCatalog images,ActionCatalog labels){textures=images;catalog=labels;gameObject.layer=30;art=gameObject.AddComponent<SpriteRenderer>();art.sortingOrder=2100;Hide();}
        public void Show(int item,BattleActor target,float progress){if(!sprites.TryGetValue(item,out var sprite)){var label=catalog.Find("item",item);if(label==null||string.IsNullOrEmpty(label.icon))throw new InvalidOperationException("도구 아이콘 누락: "+item);var tex=textures.Get(label.icon);sprite=Sprite.Create(tex,new Rect(0,0,tex.width,tex.height),new Vector2(.5f,.5f),64);sprites[item]=sprite;}
            art.sprite=sprite;art.enabled=true;transform.localPosition=new Vector3(target.x+.5f,-target.y+.5f+progress*.4f,-1);art.color=new Color(1,1,1,Mathf.Clamp01((1-progress)*4));}
        public void Hide(){if(art!=null)art.enabled=false;}
        void OnDestroy(){foreach(var sprite in sprites.Values)Destroy(sprite);}
    }
}
