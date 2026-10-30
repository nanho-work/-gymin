using System;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using Sanha.App;
namespace Sanha.Editor
{
    public static class ProjectSetup
    {
        public const string GameScene="Assets/Scenes/Game.unity";
        public const string PreviewScene="Assets/Scenes/Preview.unity";
        [MenuItem("Sanha/Create Preview Scene")]
        public static void CreateScene()=>CreateSceneAt(PreviewScene);
        [MenuItem("Sanha/Create Game Scene")]
        public static void CreateGame()=>CreateSceneAt(GameScene);
        static void CreateSceneAt(string scenePath)
        {
            if(!System.IO.File.Exists(scenePath))
            {
                if(!Application.isBatchMode && !EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo()) return;
                if(Application.isBatchMode && Enumerable.Range(0,UnityEngine.SceneManagement.SceneManager.sceneCount).Any(i=>UnityEngine.SceneManagement.SceneManager.GetSceneAt(i).isDirty))
                    throw new InvalidOperationException("Unsaved scene; refusing to replace it in batch mode.");
                System.IO.Directory.CreateDirectory("Assets/Scenes");
                var scene=EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
                var camera=new GameObject("Camera").AddComponent<Camera>();
                camera.backgroundColor=new Color(.06f,.12f,.09f);
                camera.clearFlags=CameraClearFlags.SolidColor;
                new GameObject("App Bootstrap").AddComponent<AppBootstrap>();
                if(!EditorSceneManager.SaveScene(scene,scenePath)) throw new InvalidOperationException("Scene save failed");
            }
            if(!EditorBuildSettings.scenes.Any(x=>x.path==scenePath))
                EditorBuildSettings.scenes=EditorBuildSettings.scenes.Concat(new[]{new EditorBuildSettingsScene(scenePath,true)}).ToArray();
            AssetDatabase.SaveAssets();
        }
        public static void PrepareAndValidate() { CampaignValidation.Validate(); CreateScene(); CreateGame(); }
    }
}
