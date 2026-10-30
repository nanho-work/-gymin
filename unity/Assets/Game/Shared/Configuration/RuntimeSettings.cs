using System;
using UnityEngine;
namespace Sanha.Shared.Configuration
{
    [Serializable] public sealed class RuntimeSettings
    {
        public string campaignResource, initialStageId,fontResource;
        public float battleTileUiSize=64,battleMinShortCells=8,battleMaxShortCells=14;
        public int referenceWidth, referenceHeight, fontSize;
        public static RuntimeSettings Load()
        {
            var asset=Resources.Load<TextAsset>("Settings/runtime");
            if(asset==null) throw new InvalidOperationException("Missing Settings/runtime.json");
            var settings=JsonUtility.FromJson<RuntimeSettings>(asset.text);
            if(settings==null || string.IsNullOrWhiteSpace(settings.fontResource) || settings.battleTileUiSize<40 || settings.battleMinShortCells<4 || settings.battleMaxShortCells<settings.battleMinShortCells || string.IsNullOrWhiteSpace(settings.campaignResource) || string.IsNullOrWhiteSpace(settings.initialStageId) || settings.referenceWidth<1280 || settings.referenceHeight<800 || settings.fontSize<12 || settings.fontSize>32)
                throw new InvalidOperationException("Invalid runtime settings");
            return settings;
        }
    }
}
