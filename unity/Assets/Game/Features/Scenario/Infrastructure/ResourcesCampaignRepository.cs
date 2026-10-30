using System;
using UnityEngine;
namespace Sanha.Scenario
{
    public sealed class ResourcesCampaignRepository : ICampaignRepository
    {
        readonly string key;
        public ResourcesCampaignRepository(string resourceKey) { key=resourceKey; }
        public CampaignData Load()
        {
            var asset=Resources.Load<TextAsset>(key);
            if(asset==null) throw new InvalidOperationException("Missing campaign: "+key+". Run export-unity.mjs.");
            var data=JsonUtility.FromJson<CampaignData>(asset.text);
            CampaignValidator.Validate(data);
            return data;
        }
    }
}
