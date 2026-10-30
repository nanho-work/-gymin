using System;

namespace Sanha.Scenario
{
    [Serializable] public sealed class CampaignData { public int schemaVersion; public StageData[] stages; }
    [Serializable] public sealed class StageData
    {
        public string id, title, period, route, situation;
        public SceneData[] scenes;
    }
    [Serializable] public sealed class SceneData
    {
        public string id, type, trigger, direction, background;
        public DialogueLine[] lines;
        public ActorData[] actors;
    }
    [Serializable] public sealed class DialogueLine { public string speaker, text; }
    [Serializable] public sealed class ActorData { public string name, texture; public float x; }

}
