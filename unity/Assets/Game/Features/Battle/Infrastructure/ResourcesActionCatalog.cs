using System;
using UnityEngine;
namespace Sanha.Battle
{
    [Serializable] public sealed class ActionLabel {public int id;public string name,description,icon;}
    [Serializable] public sealed class ActionCatalog {public ActionLabel[] skills,items;public ActionLabel Find(string kind,int id)=>Array.Find(kind=="skill"?skills:items,x=>x.id==id);}
    public static class ResourcesActionCatalog
    {
        public static ActionCatalog Load(){var json=Resources.Load<TextAsset>("Battle/Actions/catalog");if(json==null)throw new InvalidOperationException("스킬/도구 자료를 생성하세요: export-unity-actions.mjs");return JsonUtility.FromJson<ActionCatalog>(json.text);}
    }
}
