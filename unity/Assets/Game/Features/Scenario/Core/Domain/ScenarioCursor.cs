using System;
namespace Sanha.Scenario
{
    // Pure progression; no battle outcome, rewards, or implicit stage transitions.
    public sealed class ScenarioCursor
    {
        public StageData Stage { get; private set; }
        public int SceneIndex { get; private set; }
        public int LineIndex { get; private set; }
        public SceneData Scene => Stage.scenes[SceneIndex];
        public DialogueLine Line => Scene.lines[LineIndex];
        public bool AtStart => SceneIndex == 0 && LineIndex == 0;
        public bool AtEnd => SceneIndex == Stage.scenes.Length - 1 && LineIndex == Scene.lines.Length - 1;
        public void Load(StageData stage)
        {
            if(stage?.scenes == null || stage.scenes.Length == 0) throw new ArgumentException("Missing scenes");
            foreach(var scene in stage.scenes)
                if(scene == null || scene.lines == null || scene.lines.Length == 0) throw new ArgumentException("Missing lines: " + scene.id);
            Stage=stage; SceneIndex=0; LineIndex=0;
        }
        public void SelectScene(int index)
        {
            if(index < 0 || index >= Stage.scenes.Length) throw new ArgumentOutOfRangeException(nameof(index));
            SceneIndex=index; LineIndex=0;
        }
        public void Next()
        {
            if(AtEnd) return;
            if(LineIndex + 1 < Scene.lines.Length) LineIndex++;
            else { SceneIndex++; LineIndex=0; }
        }
        public void Previous()
        {
            if(AtStart) return;
            if(LineIndex > 0) LineIndex--;
            else { SceneIndex--; LineIndex=Scene.lines.Length-1; }
        }
    }
}
