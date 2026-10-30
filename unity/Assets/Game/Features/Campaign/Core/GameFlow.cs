using System;
namespace Sanha.Campaign
{
    public enum GameScreen { Title,Scenario,Preparation,Battle }
    public sealed class GameFlow
    {
        public GameScreen Screen {get;private set;}=GameScreen.Title;
        public void StartNew()=>Screen=GameScreen.Scenario;
        public void FinishIntroduction(bool atEnd){if(Screen!=GameScreen.Scenario||!atEnd)throw new InvalidOperationException("Introduction is not complete");Screen=GameScreen.Preparation;}
        public void EnterBoard(){if(Screen!=GameScreen.Preparation)throw new InvalidOperationException("Preparation required");Screen=GameScreen.Battle;}
        public void BackToPreparation(){if(Screen!=GameScreen.Battle)throw new InvalidOperationException("Board is not open");Screen=GameScreen.Preparation;}
        public void ReturnToTitle()=>Screen=GameScreen.Title;
        // No result transition until an actual battle outcome exists.
    }
}
