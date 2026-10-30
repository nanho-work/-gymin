using UnityEngine;
namespace Sanha.Shared.UI
{
    public static class DialoguePanel
    {
        public static void Draw(Rect area,string speaker,string message,GUIStyle style)
        {
            GUI.Box(area,"");
            GUI.Label(new Rect(area.x+20,area.y+13,area.width-40,30),speaker,style);
            GUI.Label(new Rect(area.x+20,area.y+50,area.width-40,area.height-55),message,style);
        }
    }
}
