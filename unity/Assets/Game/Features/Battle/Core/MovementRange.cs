using System;
using System.Collections.Generic;
namespace Sanha.Battle
{
    // Port of existing Movement.swift: entry costs, friendly transit, enemy ZOC,
    // and up/right/down/left path reconstruction tie order.
    public sealed class MovementRange
    {
        public readonly Dictionary<int,int> Costs=new Dictionary<int,int>();
        readonly Dictionary<int,int> previous=new Dictionary<int,int>();
        readonly int origin;
        public MovementRange(int x,int y,int width,int height,int budget,int[] prices,HashSet<int> occupied,HashSet<int> friendly,HashSet<int> stopping)
        {
            origin=y*width+x;
            if(width<1||height<1||prices==null||prices.Length!=width*height||x<0||y<0||x>=width||y>=height||budget<0)return;
            var all=new Dictionary<int,int>{{origin,0}};var frontier=new HashSet<int>{origin};
            while(frontier.Count>0){
                int current=-1;
                foreach(int tile in frontier)if(current<0||all[tile]<all[current]||all[tile]==all[current]&&tile<current)current=tile;
                frontier.Remove(current);int spent=all[current];
                if(prices[current]<1||prices[current]>=255||current!=origin&&stopping.Contains(current))continue;
                foreach(int next in Neighbors(current,width,height)){
                    if(occupied.Contains(next)&&!friendly.Contains(next))continue;
                    int price=prices[next];if(price<1||price>=255||price>budget-spent)continue;
                    int candidate=spent+price;
                    if(!all.ContainsKey(next)||candidate<all[next]){all[next]=candidate;frontier.Add(next);}
                }
            }
            foreach(var kv in all){
                if(kv.Key==origin||!friendly.Contains(kv.Key))Costs[kv.Key]=kv.Value;
                if(kv.Key==origin)continue;int lowest=kv.Value;
                foreach(int n in Neighbors(kv.Key,width,height)){
                    if(n!=origin&&stopping.Contains(n))continue;
                    if(all.TryGetValue(n,out int value)&&value<lowest){lowest=value;previous[kv.Key]=n;}
                }
            }
        }
        public int[] PathTo(int target)
        {
            if(!Costs.ContainsKey(target))return null;
            var path=new List<int>{target};int current=target;
            while(current!=origin){if(!previous.TryGetValue(current,out current))return null;path.Add(current);}
            path.Reverse();return path.ToArray();
        }
        public static IEnumerable<int> Neighbors(int tile,int width,int height)
        {
            int x=tile%width,y=tile/width;
            if(y>0)yield return tile-width;if(x+1<width)yield return tile+1;if(y+1<height)yield return tile+width;if(x>0)yield return tile-1;
        }
    }
}
