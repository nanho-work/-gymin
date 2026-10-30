using System;
using System.IO;
using System.Text;
using System.Reflection;
using Sanha.Battle;
class WireEncodingTest
{
    static int Main(string[] args)
    {
        const string sample="왕건 · 한글 전투 시작 — 성문을 지켜라!";
        var utf8=new UTF8Encoding(false,true);
        if(Environment.GetEnvironmentVariable("SANHA_WIRE_TEST_CHILD")=="1"){
            using(var input=new StreamReader(Console.OpenStandardInput(),utf8))using(var output=new StreamWriter(Console.OpenStandardOutput(),utf8)){output.WriteLine(input.ReadLine());}return 0;
        }
        var start=BattleProcess.StartInfo(args[0],Assembly.GetExecutingAssembly().Location);start.EnvironmentVariables["SANHA_WIRE_TEST_CHILD"]="1";start.EnvironmentVariables["LANG"]="C";start.EnvironmentVariables["LC_ALL"]="C";
        using(var process=System.Diagnostics.Process.Start(start)){
            process.StandardInput.WriteLine(sample);process.StandardInput.Close();var read=process.StandardOutput.ReadLineAsync();
            if(!read.Wait(5000)||!process.WaitForExit(5000)){process.Kill();throw new Exception("UTF-8 echo timeout");}
            if(read.Result!=sample||process.ExitCode!=0)throw new Exception("Korean process transport corrupted under C locale");
        }
        Console.WriteLine("PASS: Korean UTF-8 process input/output round trip under C locale (parent default codepage="+Encoding.Default.CodePage+")");return 0;
    }
}
