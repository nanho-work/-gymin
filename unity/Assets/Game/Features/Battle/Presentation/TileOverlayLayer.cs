using System.Collections.Generic;
using UnityEngine;
namespace Sanha.Battle
{
    // Pool cells: area previews can change on every tap without repeated object churn.
    public sealed class TileOverlayLayer
    {
        sealed class Cell {public GameObject root;public SpriteRenderer fill;public LineRenderer edge;}
        readonly Transform parent;readonly Material material;readonly Sprite sprite;readonly int order;readonly List<Cell> pool=new List<Cell>();
        public TileOverlayLayer(Transform root,string name,Material lines,Sprite square,int sortingOrder){parent=new GameObject(name).transform;parent.SetParent(root,false);material=lines;sprite=square;order=sortingOrder;}
        public void Show(BattleCell[] cells,Color fill,Color edge)
        {
            int count=cells?.Length??0;
            while(pool.Count<count){var obj=new GameObject("Preview cell");obj.transform.SetParent(parent,false);obj.layer=30;var quad=obj.AddComponent<SpriteRenderer>();quad.sprite=sprite;quad.sortingOrder=order;
                var border=new GameObject("Outline");border.transform.SetParent(obj.transform,false);border.layer=30;var line=border.AddComponent<LineRenderer>();line.sharedMaterial=material;line.useWorldSpace=false;line.positionCount=5;line.SetPositions(new[]{new Vector3(-.45f,.45f),new Vector3(.45f,.45f),new Vector3(.45f,-.45f),new Vector3(-.45f,-.45f),new Vector3(-.45f,.45f)});line.startWidth=line.endWidth=.055f;line.sortingOrder=order+1;pool.Add(new Cell{root=obj,fill=quad,edge=line});}
            for(int i=0;i<pool.Count;i++){var c=pool[i];c.root.SetActive(i<count);if(i>=count)continue;c.root.transform.localPosition=new Vector3(cells[i].x+.5f,-cells[i].y-.5f,-.2f);c.fill.color=fill;c.edge.startColor=c.edge.endColor=edge;}
        }
        public void Clear()=>Show(null,Color.clear,Color.clear);
    }
}
