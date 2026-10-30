using System;
using UnityEngine;
namespace Sanha.Shared.UI
{
    public static class PlaybackControls
    {
        public static void Draw(Vector2 origin,bool atStart,bool atEnd,Action previous,Action next,Action restart)
        {
            var enabled=GUI.enabled;
            GUI.enabled=enabled&&!atStart;
            if(GUI.Button(new Rect(origin.x,origin.y,125,42),"이전")) previous();
            GUI.enabled=enabled&&!atEnd;
            if(GUI.Button(new Rect(origin.x+135,origin.y,145,42),"다음 대사 / 장면")) next();
            GUI.enabled=enabled;
            if(GUI.Button(new Rect(origin.x+290,origin.y,120,42),"처음부터")) restart();
            GUI.enabled=enabled;
        }
    }
}
