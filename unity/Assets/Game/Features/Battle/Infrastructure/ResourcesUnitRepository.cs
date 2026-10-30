using System;
using UnityEngine;
namespace Sanha.Battle
{
    public static class ResourcesUnitRepository
    {
        public static UnitDeployment Load(BoardData board){var json=Resources.Load<TextAsset>("Battle/first-units");if(json==null)throw new InvalidOperationException("Run export-unity-units.mjs");var data=JsonUtility.FromJson<UnitDeployment>(json.text);data.Validate(board);return data;}
    }
}
