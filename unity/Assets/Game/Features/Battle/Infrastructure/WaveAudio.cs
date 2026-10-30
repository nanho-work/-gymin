using System;
using System.IO;
using UnityEngine;
namespace Sanha.Battle
{
    public static class WaveAudio
    {
        public static AudioClip Load(string path)
        {
            using(var file=new BinaryReader(File.OpenRead(path))){
                if(new string(file.ReadChars(4))!="RIFF")throw new InvalidDataException("Not RIFF");file.ReadInt32();if(new string(file.ReadChars(4))!="WAVE")throw new InvalidDataException("Not WAVE");
                int format=0,channels=0,hz=0,bits=0;byte[] pcm=null;
                while(file.BaseStream.Position+8<=file.BaseStream.Length){string id=new string(file.ReadChars(4));int size=file.ReadInt32();long next=file.BaseStream.Position+size+(size%2);
                    if(id=="fmt "){format=file.ReadUInt16();channels=file.ReadUInt16();hz=file.ReadInt32();file.ReadInt32();file.ReadUInt16();bits=file.ReadUInt16();}
                    else if(id=="data")pcm=file.ReadBytes(size);file.BaseStream.Position=next;
                }
                if(format!=1||channels<1||hz<1||pcm==null||(bits!=8&&bits!=16))throw new InvalidDataException("Unsupported supplied WAV format: "+path);
                int bytes=bits/8;var samples=new float[pcm.Length/bytes];
                for(int i=0;i<samples.Length;i++)samples[i]=bits==8?(pcm[i]-128)/128f:BitConverter.ToInt16(pcm,i*2)/32768f;
                var clip=AudioClip.Create(Path.GetFileName(path),samples.Length/channels,channels,hz,false);clip.SetData(samples,0);return clip;
            }
        }
    }
}
