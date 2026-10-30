using System;
using UnityEngine;
namespace Sanha.Shared.UI
{
    public static class GameFont
    {
        static Font font;
        public static Font Load(string resource)
        {
            if(font!=null)return font;
            font=Resources.Load<Font>(resource);
            if(font==null)throw new InvalidOperationException("한글 폰트 에셋을 가져오지 못했습니다: "+resource);
            // Shared Resources font: callers must not Destroy it on screen changes.
            return font;
        }
    }
}
