using System.Diagnostics;
using System.Text;
namespace Sanha.Battle
{
    // Explicit wire encoding: Unity/Mono's locale-dependent process defaults can be ASCII.
    public static class BattleProcess
    {
        public static ProcessStartInfo StartInfo(string executable,string folder)=>new ProcessStartInfo{
            FileName=executable,Arguments="\""+folder.Replace("\"","\\\"")+"\"",UseShellExecute=false,
            RedirectStandardInput=true,RedirectStandardOutput=true,RedirectStandardError=true,CreateNoWindow=true,
            StandardInputEncoding=new UTF8Encoding(false,true),StandardOutputEncoding=new UTF8Encoding(false,true),StandardErrorEncoding=new UTF8Encoding(false,true)
        };
    }
}
