using System;
using UnityEngine;
namespace Sanha.Battle
{
    public static class ResourcesBoardRepository
    {
        public static BoardData Load()
        {
            var asset=Resources.Load<TextAsset>("Battle/first-stage");
            if(asset==null)throw new InvalidOperationException("Missing first stage board; run export-unity-board.mjs");
            var data=JsonUtility.FromJson<BoardData>(asset.text);data.Validate();return data;
        }
    }
}
