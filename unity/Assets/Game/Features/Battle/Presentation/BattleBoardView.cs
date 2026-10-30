using System;
using UnityEngine;
using Sanha.Shared.Assets;
using Sanha.Shared.Configuration;
using Sanha.Shared.UI;
namespace Sanha.Battle
{
    public sealed class BattleBoardView:MonoBehaviour
    {
        public Transform Content=>content;
        public Action<int,int> TileClicked;
        public Func<Vector2,bool> IsPointerOverUi;
        public bool InputEnabled,SelectionEnabled=true;
        public BoardState State {get;private set;}
        public Rect Viewport {get;private set;}
        public float VisibleColumns=>(float)cameraState.Width;
        public float VisibleRows=>(float)cameraState.Height;
        public bool GridVisible=>grid.activeSelf;
        Camera boardCamera;BoardCameraState cameraState;RuntimeSettings settings;
        Transform content;GameObject grid,rangeRoot;LineRenderer selection;Material linesMaterial;Sprite sprite,overlaySprite;TileOverlayLayer actionRange,actionArea,actionTargets,actionAffected;
        readonly MapGesture gesture=new MapGesture();Vector2 previous,pinchCenter;float pinchDistance,lastTouchTime=-10,userPanUntil;int finger=-1;
        bool pinching,follow;Vector2 followTarget,initialFocus;int oldWidth,oldHeight;float oldScale;
        public void Initialize(BoardData data,TextureCatalog textures,UnitDeployment units,RuntimeSettings configuration=null)
        {
            settings=configuration;State=new BoardState(data);cameraState=new BoardCameraState(data.width,data.height);
            content=new GameObject("Board map and grid").transform;content.SetParent(transform,false);
            var cameraObject=new GameObject("Board Camera");cameraObject.transform.SetParent(transform,false);
            boardCamera=cameraObject.AddComponent<Camera>();boardCamera.orthographic=true;boardCamera.clearFlags=CameraClearFlags.SolidColor;
            boardCamera.backgroundColor=new Color(.035f,.065f,.055f);boardCamera.cullingMask=1<<30;boardCamera.depth=10;
            var texture=textures.Get(data.background);
            if(texture.width*data.height!=texture.height*data.width)throw new InvalidOperationException("Map image/grid aspect ratio mismatch");
            sprite=Sprite.Create(texture,new Rect(0,0,texture.width,texture.height),new Vector2(.5f,.5f),texture.width/(float)data.width);
            var map=new GameObject("Existing map background");map.transform.SetParent(content,false);map.layer=30;map.transform.localPosition=new Vector3(data.width/2f,-data.height/2f,0);map.AddComponent<SpriteRenderer>().sprite=sprite;
            linesMaterial=new Material(Shader.Find("Sprites/Default"));grid=new GameObject("Tile grid");grid.transform.SetParent(content,false);
            for(int x=0;x<=data.width;x++)Line(grid.transform,new[]{new Vector3(x,0,-.1f),new Vector3(x,-data.height,-.1f)},new Color(1,1,1,.13f),.012f);
            for(int y=0;y<=data.height;y++)Line(grid.transform,new[]{new Vector3(0,-y,-.1f),new Vector3(data.width,-y,-.1f)},new Color(1,1,1,.13f),.012f);
            selection=Line(content,new Vector3[5],new Color(1,.82f,.18f),.055f);selection.gameObject.name="Selected tile";selection.gameObject.SetActive(false);
            overlaySprite=Sprite.Create(Texture2D.whiteTexture,new Rect(0,0,Texture2D.whiteTexture.width,Texture2D.whiteTexture.height),new Vector2(.5f,.5f),Texture2D.whiteTexture.width);
            actionRange=new TileOverlayLayer(content,"Action reach",linesMaterial,overlaySprite,20);actionArea=new TileOverlayLayer(content,"Action area",linesMaterial,overlaySprite,30);actionTargets=new TileOverlayLayer(content,"Valid targets",linesMaterial,overlaySprite,40);actionAffected=new TileOverlayLayer(content,"Affected units",linesMaterial,overlaySprite,50);
            rangeRoot=new GameObject("Movement range");rangeRoot.transform.SetParent(content,false);
            float fx=0,fy=0;int n=0;foreach(var u in units.units)if(u.IsOnBoard&&u.side!=1){fx+=u.x+.5f;fy-=u.y+.5f;n++;}
            initialFocus=n>0?new Vector2(fx/n,fy/n):new Vector2(data.width/2f,-data.height/2f);
            UpdateViewport();ResetView();SetVisible(false);
        }
        LineRenderer Line(Transform parent,Vector3[] points,Color color,float width)
        {
            var item=new GameObject("Board line");item.transform.SetParent(parent,false);item.layer=30;
            var line=item.AddComponent<LineRenderer>();line.sharedMaterial=linesMaterial;line.useWorldSpace=false;line.positionCount=points.Length;line.SetPositions(points);line.startWidth=line.endWidth=width;line.startColor=line.endColor=color;return line;
        }
        public void SetRange(BattleCell[] cells)
        {
            for(int i=rangeRoot.transform.childCount-1;i>=0;i--)Destroy(rangeRoot.transform.GetChild(i).gameObject);
            if(cells==null)return;
            foreach(var c in cells)Line(rangeRoot.transform,new[]{new Vector3(c.x+.06f,-c.y-.06f,-.12f),new Vector3(c.x+.94f,-c.y-.06f,-.12f),new Vector3(c.x+.94f,-c.y-.94f,-.12f),new Vector3(c.x+.06f,-c.y-.94f,-.12f),new Vector3(c.x+.06f,-c.y-.06f,-.12f)},new Color(.2f,.65f,1,.9f),.05f);
        }
        public void ClearActionPreview(){actionRange.Clear();actionArea.Clear();actionTargets.Clear();actionAffected.Clear();}
        public void ShowActionPreview(BattleAim aim,BattleActor[] actors){
            SetRange(null);if(aim==null){ClearActionPreview();return;}
            actionRange.Show(aim.range,new Color(.15f,.45f,1,.22f),new Color(.3f,.65f,1,.7f));
            actionArea.Show(aim.area,new Color(1,.5f,.12f,.32f),new Color(1,.65f,.2f,.95f));
            actionTargets.Show(TargetCells(aim.targets,actors),new Color(.15f,1,.4f,.12f),new Color(.25f,1,.45f,1));
            actionAffected.Show(TargetCells(aim.affected,actors),Color.clear,new Color(1,.85f,.2f,1));
        }
        BattleCell[] TargetCells(int[] ids,BattleActor[] actors){var result=new System.Collections.Generic.List<BattleCell>();foreach(int id in ids??Array.Empty<int>()){var u=Array.Find(actors,x=>x.id==id);if(u!=null&&!u.hidden&&u.hp>0&&State.Contains(u.x,u.y))result.Add(new BattleCell{x=u.x,y=u.y});}return result.ToArray();}
        public void SetVisible(bool value){content.gameObject.SetActive(value);boardCamera.enabled=value;if(!value){InputEnabled=false;CancelGesture();}}
        public void SetGrid(bool value)=>grid.SetActive(value);
        public void UpdateViewport()
        {
            if(Screen.width<=0||Screen.height<=0)return;
            Viewport=new Rect(0,0,Screen.width,Screen.height);
            float scale=MobileScreen.Scale;
            if(oldWidth==Screen.width&&oldHeight==Screen.height&&Mathf.Approximately(oldScale,scale))return;
            boardCamera.pixelRect=Viewport;cameraState.Resize(Screen.width,Screen.height,scale,settings?.battleTileUiSize??64,settings?.battleMinShortCells??8,settings?.battleMaxShortCells??14);
            oldWidth=Screen.width;oldHeight=Screen.height;oldScale=scale;follow=false;CancelGesture();ApplyCamera();
        }
        public bool ProjectAboveTile(int x,int y,out Vector2 point){var p=boardCamera.WorldToScreenPoint(content.TransformPoint(new Vector3(x+.5f,-y+.4f,-.2f)));point=new Vector2(p.x,Screen.height-p.y);return p.z>0&&p.x>=0&&p.x<=Screen.width&&p.y>=0&&p.y<=Screen.height;}
        public void Fit(){follow=false;cameraState.Fit();ApplyCamera();}
        public void ResetView(){follow=false;userPanUntil=0;cameraState.Reset(State.HasSelection?State.SelectedX+.5:initialFocus.x,State.HasSelection?-State.SelectedY-.5:initialFocus.y);ApplyCamera();}
        public void Zoom(float factor){follow=false;cameraState.Zoom(factor,Screen.width*.5,Screen.height*.5);ApplyCamera();}
        public void FocusTiles(int x,int y,int otherX=-1,int otherY=-1)
        {
            if(Time.unscaledTime<userPanUntil)return;
            float cx=x+.5f,cy=-y-.5f;if(otherX>=0){cx=(x+otherX+1)*.5f;cy=-(y+otherY+1)*.5f;}
            double width=otherX>=0?Math.Abs(x-otherX)+3:3,height=otherX>=0?Math.Abs(y-otherY)+3:3;
            double factor=Math.Max(width/cameraState.Width,height/cameraState.Height);
            if(factor>1)cameraState.Zoom(factor,Screen.width*.5,Screen.height*.5);
            if(Math.Abs(cx-cameraState.X)<cameraState.Width*.28&&Math.Abs(cy-cameraState.Y)<cameraState.Height*.26){ApplyCamera();return;}
            double oldX=cameraState.X,oldY=cameraState.Y;cameraState.SetCenter(cx,cy);followTarget=new Vector2((float)cameraState.X,(float)cameraState.Y);cameraState.SetCenter(oldX,oldY);follow=true;ApplyCamera();
        }
        public void ClearSelection(){State.ClearSelection();selection.gameObject.SetActive(false);}
        void SelectPoint(Vector2 p)
        {
            if(!SelectionEnabled||Blocked(p))return;
            cameraState.WorldAt(p.x,p.y,out var xw,out var yw);if(!State.TrySelect(xw,yw))return;
            HighlightTile(State.SelectedX,State.SelectedY);TileClicked?.Invoke(State.SelectedX,State.SelectedY);
        }
        public void HighlightTile(int x,int y)
        {
            if(!State.TrySelect(x+.5,-y-.5))return;
            selection.SetPositions(new[]{new Vector3(x,-y,-.3f),new Vector3(x+1,-y,-.3f),new Vector3(x+1,-y-1,-.3f),new Vector3(x,-y-1,-.3f),new Vector3(x,-y,-.3f)});selection.gameObject.SetActive(true);
        }
        bool Blocked(Vector2 p)=>!InputEnabled||!Viewport.Contains(p)||(IsPointerOverUi?.Invoke(p)??false);
        void UserPan(Vector2 delta){follow=false;userPanUntil=Time.unscaledTime+2;cameraState.Pan(delta.x,delta.y);ApplyCamera();}
        void UserZoom(float factor,Vector2 anchor){follow=false;userPanUntil=Time.unscaledTime+2;cameraState.Zoom(factor,anchor.x,anchor.y);ApplyCamera();}
        void CancelGesture(){gesture.Cancel();finger=-1;pinching=false;}
        public void HandleInput(Event e)
        {
            if(Input.touchCount>0||Time.unscaledTime-lastTouchTime<.25f)return;
            if(!InputEnabled){CancelGesture();return;}
            if(e.type==EventType.MouseDown&&e.button==0&&!Blocked(e.mousePosition)){gesture.Begin(e.mousePosition.x,e.mousePosition.y);previous=e.mousePosition;e.Use();}
            else if(e.type==EventType.MouseDrag&&gesture.Active){if(gesture.Move(e.mousePosition.x,e.mousePosition.y,8*MobileScreen.Scale))UserPan(e.mousePosition-previous);previous=e.mousePosition;e.Use();}
            else if(e.type==EventType.MouseUp&&gesture.Active){if(gesture.End(e.mousePosition.x,e.mousePosition.y,8*MobileScreen.Scale))SelectPoint(e.mousePosition);e.Use();}
            else if(e.type==EventType.ScrollWheel&&!Blocked(e.mousePosition)){UserZoom(Mathf.Exp(e.delta.y*.08f),e.mousePosition);e.Use();}
        }
        void Update()
        {
            if(boardCamera==null)return;UpdateViewport();
            int count=Input.touchCount;
            if(count>0)lastTouchTime=Time.unscaledTime;
            if(!InputEnabled||!boardCamera.enabled){CancelGesture();return;}
            if(count>=2){
                var a=Input.GetTouch(0);var b=Input.GetTouch(1);if(a.phase==TouchPhase.Ended||b.phase==TouchPhase.Ended||a.phase==TouchPhase.Canceled||b.phase==TouchPhase.Canceled){gesture.Cancel();finger=-1;pinching=true;return;}var p=MobileScreen.GuiPoint(a.position);var q=MobileScreen.GuiPoint(b.position);gesture.Cancel();finger=-1;
                if(!pinching){if(Blocked(p)||Blocked(q))return;pinching=true;pinchCenter=(p+q)*.5f;pinchDistance=Vector2.Distance(p,q);}
                else {var center=(p+q)*.5f;float distance=Vector2.Distance(p,q);if(distance>8&&pinchDistance>8)UserZoom(pinchDistance/distance,pinchCenter);UserPan(center-pinchCenter);pinchCenter=center;pinchDistance=distance;}return;
            }
            if(pinching){if(count==0)pinching=false;return;} // The last finger of a pinch cannot become a tap.
            if(count==0){if(finger>=0)CancelGesture();return;}
            var t=Input.GetTouch(0);var point=MobileScreen.GuiPoint(t.position);
            if(t.phase==TouchPhase.Began){if(Blocked(point))return;finger=t.fingerId;gesture.Begin(point.x,point.y);previous=point;}
            else if(t.fingerId==finger){
                if(t.phase==TouchPhase.Moved){if(gesture.Move(point.x,point.y,8*MobileScreen.Scale))UserPan(point-previous);previous=point;}
                else if(t.phase==TouchPhase.Ended){if(gesture.End(point.x,point.y,8*MobileScreen.Scale))SelectPoint(point);finger=-1;}
                else if(t.phase==TouchPhase.Canceled)CancelGesture();
            }
        }
        void LateUpdate(){if(!follow||!InputEnabled)return;float t=1-Mathf.Exp(-Time.unscaledDeltaTime*12);cameraState.SetCenter(Mathf.Lerp((float)cameraState.X,followTarget.x,t),Mathf.Lerp((float)cameraState.Y,followTarget.y,t));ApplyCamera();if(Vector2.Distance(new Vector2((float)cameraState.X,(float)cameraState.Y),followTarget)<.02f)follow=false;}
        void ApplyCamera(){boardCamera.orthographicSize=(float)cameraState.Height/2;boardCamera.transform.position=new Vector3((float)cameraState.X,(float)cameraState.Y,-10);}
        void OnDestroy(){if(sprite!=null)Destroy(sprite);if(overlaySprite!=null)Destroy(overlaySprite);if(linesMaterial!=null)Destroy(linesMaterial);}
    }
}
