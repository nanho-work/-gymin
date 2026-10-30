using UnityEngine;
namespace Sanha.Shared.UI
{
    public static class MobileScreen
    {
        public static float Scale=>Application.isMobilePlatform&&Screen.dpi>=120?Mathf.Clamp(Screen.dpi/160f,1,4):Mathf.Clamp(Mathf.Min(Screen.width,Screen.height)/640f,.75f,2);
        public static Rect SafeArea {get{var r=Screen.safeArea;if(r.width<=0||r.height<=0)r=new Rect(0,0,Screen.width,Screen.height);return new Rect(r.x,Screen.height-r.yMax,r.width,r.height);}}
        public static Vector2 GuiPoint(Vector2 bottomLeftPoint)=>new Vector2(bottomLeftPoint.x,Screen.height-bottomLeftPoint.y);
    }
}
