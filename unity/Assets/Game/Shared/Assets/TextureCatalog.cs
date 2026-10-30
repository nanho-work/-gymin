using System;
using System.Collections.Generic;
using UnityEngine;
namespace Sanha.Shared.Assets
{
    public sealed class TextureCatalog
    {
        readonly Dictionary<string,Texture2D> cache=new Dictionary<string,Texture2D>();
        public Texture2D Get(string key)
        {
            if(string.IsNullOrEmpty(key)) return null;
            if(cache.TryGetValue(key,out var texture)) return texture;
            texture=Resources.Load<Texture2D>(key);
            if(texture==null) throw new InvalidOperationException("Missing texture: "+key);
            cache.Add(key,texture); return texture;
        }
        // Resources owns textures: do not Destroy shared textures.
        public void Clear() { cache.Clear(); }
    }
}
