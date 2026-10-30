using System;
using Sanha.Battle;
static class BoardCameraTests
{
    static void Check(bool value,string message){if(!value)throw new Exception(message);}
    static void Near(double a,double b,string message){Check(Math.Abs(a-b)<.00001,message);}
    public static void Run()
    {
        var camera=new BoardCameraState(40,40);
        camera.Resize(1920,1080,3);camera.Reset(20,-20);double phoneRows=camera.Height,phoneColumns=camera.Width;
        Check(phoneRows>=8&&phoneRows<=14&&phoneColumns>phoneRows,"landscape keeps square readable tiles");
        Near(camera.Width/camera.Height,1920d/1080,"viewport aspect ratio");
        camera.Resize(2400,1080,3);Check(camera.Width>phoneColumns,"wider phone shows more columns");
        camera.Resize(2200,1800,2);Check(camera.Height>phoneRows,"larger unfolded viewport shows more rows");
        camera.Resize(1600,1000,1.5);camera.Reset(20,-20);
        camera.WorldAt(600,400,out var x,out var y);camera.Zoom(.7,600,400);camera.WorldAt(600,400,out var x2,out var y2);Near(x,x2,"pinch anchor x");Near(y,y2,"pinch anchor y");
        camera.WorldAt(600,400,out x,out y);camera.Zoom(.9,600,400);camera.Pan(50,30);camera.WorldAt(650,430,out x2,out y2);Near(x,x2,"moving pinch anchor x");Near(y,y2,"moving pinch anchor y");
        camera.Pan(100000,100000);Check(camera.X>=camera.Width/2&&camera.Y<=-camera.Height/2,"map clamp top-left");
        camera.Pan(-200000,-200000);Check(camera.X<=40-camera.Width/2&&camera.Y>=-40+camera.Height/2,"map clamp bottom-right");
        camera.Fit();Check(camera.Width>=40&&camera.Height>=40,"explicit whole-map overview");camera.Resize(1000,1600,2);Check(camera.Width>=40&&camera.Height>=40,"overview survives rotation");
        camera.Reset(20,-20);Near(camera.Width/camera.Height,1000d/1600,"portrait square tile projection");Check(camera.Width<40,"reset leaves overview");
        camera.Zoom(0,0,0);Check(camera.Width>0,"invalid zoom ignored");
        var small=new BoardCameraState(20,20);small.Resize(3000,700,1);small.Reset(10,-10);Check(small.Width<=20.0001,"ultrawide default stays within map");
        var gesture=new MapGesture();gesture.Begin(100,100);Check(gesture.End(103,102,8),"tap accepted");
        gesture.Begin(100,100);Check(gesture.Move(140,100,8),"drag threshold");Check(!gesture.End(100,100,8),"drag back to origin is not a tap");
        gesture.Begin(100,100);gesture.Cancel();Check(!gesture.End(100,100,8),"second finger cancellation never selects a tile");
        Console.WriteLine("PASS: responsive board geometry, fold/rotation, pinch anchor, bounds and gesture cancellation");
    }
}
