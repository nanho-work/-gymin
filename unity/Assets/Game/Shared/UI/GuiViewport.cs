using System;
using UnityEngine;
namespace Sanha.Shared.UI
{
    public sealed class GuiViewport : IDisposable
    {
        readonly Matrix4x4 matrix;
        readonly Font font;
        readonly bool enabled;
        public GuiViewport(int width,int height,Font currentFont)
        {
            matrix=GUI.matrix; font=GUI.skin.font; enabled=GUI.enabled;
            float scale=Mathf.Min(Screen.width/(float)width,Screen.height/(float)height);
            GUI.matrix=Matrix4x4.TRS(new Vector3((Screen.width-width*scale)/2,(Screen.height-height*scale)/2,0),Quaternion.identity,new Vector3(scale,scale,1));
            GUI.skin.font=currentFont;
        }
        public void Dispose() { GUI.matrix=matrix; GUI.skin.font=font; GUI.enabled=enabled; }
    }
}
