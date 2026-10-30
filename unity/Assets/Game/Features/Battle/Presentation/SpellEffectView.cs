using System;
using System.Collections.Generic;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    [Serializable] public sealed class SpellFrame {public int x,y;}
    [Serializable] public sealed class SpellFrames {public int id,width,height,atlasHeight,sound;public float interval;public string name,atlas;public SpellFrame[] frames;}
    [Serializable] public sealed class SpellFramesCatalog {public SpellFrames[] records;}
    public sealed class SpellEffectView:MonoBehaviour
    {
        SpellFramesCatalog catalog;TextureCatalog textures;readonly Dictionary<int,Sprite[]> cache=new Dictionary<int,Sprite[]>();readonly List<SpriteRenderer> targets=new List<SpriteRenderer>();
        public void Initialize(TextureCatalog images){textures=images;catalog=JsonUtility.FromJson<SpellFramesCatalog>(Resources.Load<TextAsset>("Battle/Presentation/spells").text);}
        public SpellFrames Load(int id)=>Array.Find(catalog.records,x=>x.id==id)??throw new InvalidOperationException("책략 이펙트 추출 필요: "+id);
        public void Show(SpellFrames effect,int index,BattleActor[] actors){
            if(!cache.TryGetValue(effect.id,out var sprites)){var tex=textures.Get(effect.atlas);sprites=new Sprite[effect.frames.Length];for(int i=0;i<sprites.Length;i++)sprites[i]=Sprite.Create(tex,new Rect(i%8*effect.width,effect.atlasHeight-(i/8+1)*effect.height,effect.width,effect.height),new Vector2(.5f,.5f),48);cache.Add(effect.id,sprites);}
            while(targets.Count<actors.Length){var item=new GameObject("Spell target effect");item.transform.SetParent(transform,false);item.layer=30;var art=item.AddComponent<SpriteRenderer>();art.sortingOrder=2050;targets.Add(art);}
            for(int i=0;i<targets.Count;i++){var art=targets[i];art.enabled=i<actors.Length;if(!art.enabled)continue;var actor=actors[i];var frame=effect.frames[index];art.sprite=sprites[index];art.transform.localPosition=new Vector3(actor.x+.5f+frame.x/48f,-actor.y-.5f-frame.y/48f,-1);}
        }
        public void Hide(){foreach(var art in targets)art.enabled=false;}
        void OnDestroy(){foreach(var sprites in cache.Values)foreach(var sprite in sprites)Destroy(sprite);}
    }
}
