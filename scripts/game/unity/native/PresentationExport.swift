import AppKit
import Foundation
// Build-time extraction only. Original restored MCALL decoder/renderer remain readonly.
@main struct PresentationExport {
 static func main()throws {
  let root=URL(fileURLWithPath:CommandLine.arguments[1]),out=URL(fileURLWithPath:CommandLine.arguments[2]);try FileManager.default.createDirectory(at:out,withIntermediateDirectories:true)
  let resource=try OriginalMCALL(Data(contentsOf:root.appendingPathComponent("original-mcall-05.e5")))
  let palette=Array(try Data(contentsOf:root.appendingPathComponent("original-mcall-palette-0.bin")))
  guard let lookup=OriginalMCALLPalette.lookup(palette),let colors=OriginalMCALLPalette.rgba(palette) else{fatalError("MCALL palette")}
  let width=960,height=1016,map=Array(try Data(contentsOf:root.appendingPathComponent("original-indexed/scenario-map-0.bin")))
  var base=[UInt8](repeating:0,count:width*height);base.replaceSubrange(width*56..<base.count,with:map)
  var renderer=try OriginalMCALLRenderer(canvas:base,width:width,height:height,viewport:.init(left:0,top:56,right:959,bottom:1015),palette:palette,lookup:lookup)
  var frames:[[String:Any]]=[]
  for i in 0..<resource.frameCount {
   try renderer.render(resource:resource,frameIndex:i,centerX:504,centerY:464,first:i==0)
   var l=width,t=height,r=0,b=0
   for y in 56..<height {for x in 0..<width {let at=y*width+x;if renderer.canvas[at] != base[at]{l=min(l,x);r=max(r,x+1);t=min(t,y);b=max(b,y+1)}}}
   let frame=try resource.frame(i),sound=(i==0 && frame.soundMode != 2)||frame.soundMode==3 ? Int(resource.header[16])+100:-1
   if l>=r||t>=b {frames.append(["image":"","x":0,"y":0,"sound":sound]);continue}
   let w=r-l,h=b-t,bitmap=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:w,pixelsHigh:h,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:w*4,bitsPerPixel:32)!
   let pixels=bitmap.bitmapData!
   for y in t..<b {for x in l..<r {let at=y*width+x,j=((y-t)*w+x-l)*4;if renderer.canvas[at] != base[at]{let c=Int(renderer.canvas[at])*4;for k in 0..<4{pixels[j+k]=colors[c+k]}}else{for k in 0..<4{pixels[j+k]=0}}}}
   let name="mcall-105-\(i)";try bitmap.representation(using:.png,properties:[:])!.write(to:out.appendingPathComponent(name+".png"))
   frames.append(["image":"Battle/Presentation/"+name,"x":l,"y":t-56,"sound":sound])
  }
  let data:[String:Any]=["id":105,"seconds":Double(resource.ticks)*0.05,"frames":frames,"source":"OriginalMCALLRenderer; B00 terrain base; Unity actor blending remains a host boundary"]
  try JSONSerialization.data(withJSONObject:data,options:[.sortedKeys]).write(to:out.appendingPathComponent("mcall-105.json"))
  print("Exported original MCALL105: \(frames.count) frames, \(resource.ticks) ticks/frame")
 }
}
