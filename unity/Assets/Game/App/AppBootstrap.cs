using System;
using UnityEngine;
using Sanha.Scenario;
using Sanha.Campaign;
using Sanha.Battle;
using Sanha.Shared.Assets;
using Sanha.Shared.Configuration;
namespace Sanha.App
{
    public sealed class AppBootstrap : MonoBehaviour
    {
        TextureCatalog textures;
        string error;
        void Awake()
        {
            try
            {
                var settings=RuntimeSettings.Load();
                textures=new TextureCatalog();
                var repository=new ResourcesCampaignRepository(settings.campaignResource);
                // One explicit composition root in Game scene. No auto-injection into every scene.
                var view=gameObject.AddComponent<GameFlowScreen>();
                var board=ResourcesBoardRepository.Load();
                view.Initialize(repository,settings,textures,board,ResourcesUnitRepository.Load(board),()=>new NativeBattleSession(System.IO.Path.Combine(Application.streamingAssetsPath,"SanhaNative")));
            }
            catch(Exception e) { error=e.Message; Debug.LogException(e); }
        }
        void OnGUI() { if(error!=null) GUI.Label(new Rect(20,20,1000,100),error); }
        void OnDestroy() { textures?.Clear(); }
    }
}
