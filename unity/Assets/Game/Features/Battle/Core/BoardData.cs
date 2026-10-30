using System;
namespace Sanha.Battle
{
    [Serializable] public sealed class BoardData
    {
        public int schemaVersion, mapId, width, height;
        public string stageId, background, battleIntroSceneId;
        public string[] introSceneIds, terrainNames;
        public int[] terrain;
        public void Validate()
        {
            if(schemaVersion!=1 || width<1 || height<1 || width>256 || height>256 || terrain==null || terrain.Length!=width*height || terrainNames==null || string.IsNullOrEmpty(stageId) || string.IsNullOrEmpty(background) || introSceneIds==null || introSceneIds.Length==0 || string.IsNullOrEmpty(battleIntroSceneId)) throw new ArgumentException("Invalid board data");
            foreach(int id in terrain) if(id<0 || id>=terrainNames.Length || string.IsNullOrEmpty(terrainNames[id])) throw new ArgumentException("Invalid terrain ID");
        }
    }
    public sealed class BoardState
    {
        public BoardData Data {get;}
        public int SelectedX {get;private set;}=-1;
        public int SelectedY {get;private set;}=-1;
        public bool HasSelection => SelectedX>=0;
        public BoardState(BoardData data) {data.Validate();Data=data;}
        public bool Contains(int x,int y)=>x>=0&&y>=0&&x<Data.width&&y<Data.height;
        public int TerrainAt(int x,int y) {if(!Contains(x,y))throw new ArgumentOutOfRangeException();return Data.terrain[y*Data.width+x];}
        // World origin at map top-left. Boundaries on right/bottom are outside.
        public bool TrySelect(double worldX,double worldY)
        {
            if(double.IsNaN(worldX)||double.IsInfinity(worldX)||double.IsNaN(worldY)||double.IsInfinity(worldY))return false;
            if(worldX<0||worldX>=Data.width||worldY>0||worldY<=-Data.height)return false;
            SelectedX=(int)Math.Floor(worldX);SelectedY=(int)Math.Floor(-worldY);return true;
        }
        public void ClearSelection(){SelectedX=-1;SelectedY=-1;}
    }
}
