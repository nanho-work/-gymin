using System;
using System.Diagnostics;
using System.IO;
using UnityEngine;
namespace Sanha.Battle
{
    // Local macOS validation backend. UI/Core only depend on IBattleSession.
    // No shell, server, network access or machine environment in the game layer.
    public sealed class NativeBattleSession:IBattleSession
    {
        readonly Process process;bool disposed;
        public NativeBattleSession(string folder)
        {
            string exe=Path.Combine(folder,"sanha-battle");
            if(!File.Exists(exe))throw new InvalidOperationException("먼저 node scripts/game/build-unity-native.mjs를 실행하세요. 현재 백엔드는 macOS 전용입니다.");
            process=new Process{StartInfo=BattleProcess.StartInfo(exe,folder)};
            process.Start();process.BeginErrorReadLine();
        }
        public BattleSnapshot Send(BattleCommand command)
        {
            if(process.HasExited)throw new InvalidOperationException("전투 엔진이 종료됐습니다.");
            process.StandardInput.WriteLine(JsonUtility.ToJson(command));process.StandardInput.Flush();
            var read=process.StandardOutput.ReadLineAsync();
            if(!read.Wait(10000)){Dispose();throw new TimeoutException("전투 엔진 응답 대기 만료");}
            if(string.IsNullOrEmpty(read.Result))throw new InvalidOperationException("전투 응답이 없습니다.");
            var result=JsonUtility.FromJson<BattleSnapshot>(read.Result);
            if(result!=null&&!result.hasPending)result.pending=null;
            if(result!=null&&!result.hasAim)result.aim=null;
            if(result!=null&&result.stateVersion<3)throw new InvalidDataException("전투 엔진을 갱신하세요: node scripts/game/build-unity-native.mjs");
            if(result?.units==null)throw new InvalidDataException("Invalid battle snapshot");return result;
        }
        public void Dispose(){if(disposed)return;disposed=true;try{if(!process.HasExited){process.StandardInput.Close();if(!process.WaitForExit(300))process.Kill();}}finally{process.Dispose();}}
    }
}
