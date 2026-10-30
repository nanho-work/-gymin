using System;
using System.Collections.Generic;
namespace Sanha.Scenario
{
    public static class CampaignValidator
    {
        public static void Validate(CampaignData data)
        {
            if(data == null || data.schemaVersion != 1 || data.stages == null || data.stages.Length == 0)
                throw new ArgumentException("Unsupported or empty campaign");
            var stages=new HashSet<string>();
            foreach(var stage in data.stages)
            {
                if(stage == null || string.IsNullOrWhiteSpace(stage.id) || !stages.Add(stage.id))
                    throw new ArgumentException("Missing/duplicate stage ID");
                new ScenarioCursor().Load(stage);
                var scenes=new HashSet<string>();
                foreach(var scene in stage.scenes)
                {
                    if(string.IsNullOrWhiteSpace(scene.id) || !scenes.Add(scene.id)) throw new ArgumentException("Invalid scene ID");
                    foreach(var line in scene.lines)
                        if(line == null || string.IsNullOrWhiteSpace(line.speaker) || string.IsNullOrWhiteSpace(line.text))
                            throw new ArgumentException("Invalid dialogue: "+scene.id);
                    foreach(var actor in scene.actors ?? Array.Empty<ActorData>())
                        if(actor == null || string.IsNullOrWhiteSpace(actor.texture) || float.IsNaN(actor.x) || actor.x < 0 || actor.x > 1)
                            throw new ArgumentException("Invalid actor: "+scene.id);
                }
            }
        }
    }
}
