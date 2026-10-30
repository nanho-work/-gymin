using System;
using UnityEngine;
namespace Sanha.Shared.Configuration
{
    [Serializable] public sealed class RuntimeSettings
    {
        public string campaignResource, initialStageId;
        public string[] fontNames;
        public int referenceWidth, referenceHeight, fontSize;
        public static RuntimeSettings Load()
        {
            var asset=Resources.Load<TextAsset>("Settings/runtime");
            if(asset==null) throw new InvalidOperationException("Missing Settings/runtime.json");
            var settings=JsonUtility.FromJson<RuntimeSettings>(asset.text);
            if(settings==null || string.IsNullOrWhiteSpace(settings.campaignResource) || string.IsNullOrWhiteSpace(settings.initialStageId) || settings.referenceWidth<1280 || settings.referenceHeight<800 || settings.fontSize<12 || settings.fontSize>32 || settings.fontNames==null || settings.fontNames.Length==0)
                throw new InvalidOperationException("Invalid development viewer settings");
            return settings;
        }
    }
}
