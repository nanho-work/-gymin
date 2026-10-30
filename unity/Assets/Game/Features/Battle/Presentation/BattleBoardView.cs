using System;
using UnityEngine;
using Sanha.Shared.Assets;
namespace Sanha.Battle
{
    // Actual world-space board. Pixel input is mapped by the same camera used to render it.
    public sealed class BattleBoardView : MonoBehaviour
    {
        public Transform Content=>content;
        public Action<int,int> TileClicked;
        GameObject rangeRoot;
        public BoardState State {get;private set;}
        Camera boardCamera;
        Transform content;
        Sprite sprite;
        Material linesMaterial;
        GameObject grid;
        LineRenderer selection;
        Vector2 press,previous;
        bool dragging,moved;
        float fitSize;
        public Rect Viewport {get;private set;}
        public void Initialize(BoardData data,TextureCatalog textures,UnitDeployment units)
        {
            State=new BoardState(data);
            content=new GameObject("Board map and grid").transform;content.SetParent(transform,false);
            // Isolate board rendering from the scene camera and future gameplay objects.
            var cameraObject=new GameObject("Board Camera");cameraObject.transform.SetParent(transform,false);
            boardCamera=cameraObject.AddComponent<Camera>();boardCamera.orthographic=true;boardCamera.clearFlags=CameraClearFlags.SolidColor;
            boardCamera.backgroundColor=new Color(.035f,.065f,.055f);boardCamera.cullingMask=1<<30;boardCamera.depth=10;
            var texture=textures.Get(data.background);
            if(texture.width*data.height!=texture.height*data.width)throw new InvalidOperationException("Map image/grid aspect ratio mismatch");
            sprite=Sprite.Create(texture,new Rect(0,0,texture.width,texture.height),new Vector2(.5f,.5f),texture.width/(float)data.width);
            var map=new GameObject("Existing map background");map.transform.SetParent(content,false);map.layer=30;
            map.transform.localPosition=new Vector3(data.width/2f,-data.height/2f,0);
            map.AddComponent<SpriteRenderer>().sprite=sprite;
            var shader=Shader.Find("Sprites/Default");if(shader==null)throw new InvalidOperationException("Missing sprite shader");
            linesMaterial=new Material(shader);
            grid=new GameObject("Tile grid");grid.transform.SetParent(content,false);
            for(int x=0;x<=data.width;x++) Line(grid.transform,new[]{new Vector3(x,0,-.1f),new Vector3(x,-data.height,-.1f)},new Color(1,1,1,.23f),.018f);
            for(int y=0;y<=data.height;y++) Line(grid.transform,new[]{new Vector3(0,-y,-.1f),new Vector3(data.width,-y,-.1f)},new Color(1,1,1,.23f),.018f);
            selection=Line(content,new Vector3[5],new Color(1,.82f,.18f),.065f);selection.gameObject.name="Selected tile";selection.gameObject.SetActive(false);
            rangeRoot=new GameObject("Movement range");rangeRoot.transform.SetParent(content,false);
            UpdateViewport();Fit();SetVisible(false);
        }
        LineRenderer Line(Transform parent,Vector3[] points,Color color,float width)
        {
            var item=new GameObject("Grid line");item.transform.SetParent(parent,false);item.layer=30;
            var line=item.AddComponent<LineRenderer>();line.sharedMaterial=linesMaterial;line.useWorldSpace=false;line.positionCount=points.Length;line.SetPositions(points);line.startWidth=line.endWidth=width;line.startColor=line.endColor=color;return line;
        }
        public void SetRange(BattleCell[] cells)
        {
            for(int i=rangeRoot.transform.childCount-1;i>=0;i--)Destroy(rangeRoot.transform.GetChild(i).gameObject);
            if(cells==null)return;
            foreach(var c in cells)Line(rangeRoot.transform,new[]{new Vector3(c.x+.08f,-c.y-.08f,-.12f),new Vector3(c.x+.92f,-c.y-.08f,-.12f),new Vector3(c.x+.92f,-c.y-.92f,-.12f),new Vector3(c.x+.08f,-c.y-.92f,-.12f),new Vector3(c.x+.08f,-c.y-.08f,-.12f)},new Color(.2f,.65f,1,.8f),.055f);
        }
        public void SetVisible(bool value)
        {
            content.gameObject.SetActive(value);boardCamera.enabled=value;dragging=false;
        }
        public void SetGrid(bool value)=>grid.SetActive(value);
        public void UpdateViewport()
        {
            // Match the app's 1280x800 letterboxed coordinate system.
            float s=Mathf.Min(Screen.width/1280f,Screen.height/800f),ox=(Screen.width-1280*s)/2,oy=(Screen.height-800*s)/2;
            Viewport=new Rect(ox+24*s,oy+90*s,900*s,660*s); // GUI top-left coordinates
            boardCamera.pixelRect=new Rect(Viewport.x,Screen.height-Viewport.yMax,Viewport.width,Viewport.height);
            fitSize=Mathf.Max(State.Data.height/2f,State.Data.width/(2f*(Viewport.width/Viewport.height)))*1.04f;
        }
        public void Fit()
        {
            boardCamera.orthographicSize=fitSize;boardCamera.transform.position=new Vector3(State.Data.width/2f,-State.Data.height/2f,-10);
        }
        public void ClearSelection(){State.ClearSelection();selection.gameObject.SetActive(false);}
        public void HandleInput(Event e)
        {
            if(e.type==EventType.MouseDown && Viewport.Contains(e.mousePosition) && e.button==0){dragging=true;moved=false;press=previous=e.mousePosition;e.Use();}
            else if(e.type==EventType.MouseDrag && dragging)
            {
                if((e.mousePosition-press).sqrMagnitude>25)moved=true;
                if(moved){float unit=2*boardCamera.orthographicSize/Viewport.height;var d=e.mousePosition-previous;boardCamera.transform.position+=new Vector3(-d.x*unit,d.y*unit,0);Clamp();}
                previous=e.mousePosition;e.Use();
            }
            else if(e.type==EventType.MouseUp && dragging)
            {
                dragging=false;
                if(!moved && Viewport.Contains(e.mousePosition)){
                    var p=boardCamera.ScreenToWorldPoint(new Vector3(e.mousePosition.x,Screen.height-e.mousePosition.y,10));
                    if(State.TrySelect(p.x,p.y)){
                        int x=State.SelectedX,y=State.SelectedY;
                        selection.SetPositions(new[]{new Vector3(x,-y,-.3f),new Vector3(x+1,-y,-.3f),new Vector3(x+1,-y-1,-.3f),new Vector3(x,-y-1,-.3f),new Vector3(x,-y,-.3f)});selection.gameObject.SetActive(true);TileClicked?.Invoke(x,y);
                    }
                }e.Use();
            }
            else if(e.type==EventType.ScrollWheel && Viewport.Contains(e.mousePosition))
            {
                var before=boardCamera.ScreenToWorldPoint(new Vector3(e.mousePosition.x,Screen.height-e.mousePosition.y,10));
                boardCamera.orthographicSize=Mathf.Clamp(boardCamera.orthographicSize*Mathf.Exp(e.delta.y*.08f),fitSize*.3f,fitSize);
                var after=boardCamera.ScreenToWorldPoint(new Vector3(e.mousePosition.x,Screen.height-e.mousePosition.y,10));boardCamera.transform.position+=before-after;Clamp();e.Use();
            }
        }
        void Clamp()
        {
            var p=boardCamera.transform.position;float hy=boardCamera.orthographicSize,hx=hy*Viewport.width/Viewport.height;
            p.x=hx*2>=State.Data.width?State.Data.width/2f:Mathf.Clamp(p.x,hx,State.Data.width-hx);
            p.y=hy*2>=State.Data.height?-State.Data.height/2f:Mathf.Clamp(p.y,-State.Data.height+hy,-hy);boardCamera.transform.position=p;
        }
        void OnDestroy(){if(sprite!=null)Destroy(sprite);if(linesMaterial!=null)Destroy(linesMaterial);}
    }
}
