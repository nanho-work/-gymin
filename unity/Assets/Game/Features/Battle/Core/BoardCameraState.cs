using System;
namespace Sanha.Battle
{
    // Orthographic geometry in board cells. Screen coordinates use top-left origin.
    public sealed class BoardCameraState
    {
        readonly double mapWidth,mapHeight;
        double pixelsWidth=1,pixelsHeight=1,shortCells=10,defaultCells=10;
        bool fitted;
        public double X {get;private set;}
        public double Y {get;private set;}
        public double Width=>shortCells*Math.Max(1,pixelsWidth/pixelsHeight);
        public double Height=>shortCells*Math.Max(1,pixelsHeight/pixelsWidth);
        public double DefaultCells=>defaultCells;
        double FitCells=>Math.Max(mapWidth/Math.Max(1,pixelsWidth/pixelsHeight),mapHeight/Math.Max(1,pixelsHeight/pixelsWidth))*1.02;
        public BoardCameraState(double width,double height){if(width<=0||height<=0)throw new ArgumentException("Invalid map size");mapWidth=width;mapHeight=height;X=width/2;Y=-height/2;}
        public void Resize(double width,double height,double pixelsPerUiUnit,double targetTileSize=64,double minCells=8,double maxCells=14)
        {
            if(width<=0||height<=0||pixelsPerUiUnit<=0||targetTileSize<=0||minCells<=0||maxCells<minCells)throw new ArgumentException("Invalid viewport");
            double relative=shortCells/defaultCells;pixelsWidth=width;pixelsHeight=height;
            defaultCells=Clamp(Math.Min(width,height)/pixelsPerUiUnit/targetTileSize,minCells,maxCells);
            // A very wide window must not expose empty map edges at the default zoom.
            defaultCells=Math.Min(defaultCells,Math.Min(mapWidth/Math.Max(1,width/height),mapHeight/Math.Max(1,height/width)));
            shortCells=fitted?FitCells:Clamp(defaultCells*relative,Math.Min(4,FitCells),FitCells);ClampCenter();
        }
        public void Reset(double x,double y){fitted=false;shortCells=defaultCells;SetCenter(x,y);}
        public void Fit(){fitted=true;shortCells=FitCells;SetCenter(mapWidth/2,-mapHeight/2);}
        public void SetCenter(double x,double y){X=x;Y=y;ClampCenter();}
        public void Pan(double dx,double dy){fitted=false;SetCenter(X-dx*Width/pixelsWidth,Y+dy*Height/pixelsHeight);}
        public void WorldAt(double x,double y,out double worldX,out double worldY){worldX=X+(x/pixelsWidth-.5)*Width;worldY=Y+(.5-y/pixelsHeight)*Height;}
        public void Zoom(double factor,double x,double y)
        {
            if(factor<=0||double.IsNaN(factor)||double.IsInfinity(factor))return;
            WorldAt(x,y,out var beforeX,out var beforeY);fitted=false;shortCells=Clamp(shortCells*factor,Math.Min(4,FitCells),FitCells);
            WorldAt(x,y,out var afterX,out var afterY);SetCenter(X+beforeX-afterX,Y+beforeY-afterY);
        }
        void ClampCenter(){X=Width>=mapWidth?mapWidth/2:Clamp(X,Width/2,mapWidth-Width/2);Y=Height>=mapHeight?-mapHeight/2:Clamp(Y,-mapHeight+Height/2,-Height/2);}
        static double Clamp(double value,double min,double max)=>Math.Max(min,Math.Min(max,value));
    }
    // A pinch or a drag can never end as a tile command, including finger lift order.
    public sealed class MapGesture
    {
        double startX,startY;bool dragged;public bool Active {get;private set;}
        public void Begin(double x,double y){startX=x;startY=y;dragged=false;Active=true;}
        public bool Move(double x,double y,double threshold){if(!Active)return false;if((x-startX)*(x-startX)+(y-startY)*(y-startY)>threshold*threshold)dragged=true;return dragged;}
        public bool End(double x,double y,double threshold){if(!Active)return false;Move(x,y,threshold);Active=false;return !dragged;}
        public void Cancel(){Active=false;dragged=true;}
    }
}
