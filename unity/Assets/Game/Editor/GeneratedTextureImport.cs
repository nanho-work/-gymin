using UnityEditor;
using UnityEngine;
namespace Sanha.Editor
{
    public sealed class GeneratedTextureImport:AssetPostprocessor
    {
        void OnPreprocessTexture(){
            if(!assetPath.StartsWith("Assets/Resources/Battle/")&&!assetPath.StartsWith("Assets/Resources/Campaign/"))return;
            var texture=(TextureImporter)assetImporter;texture.npotScale=TextureImporterNPOTScale.None;texture.maxTextureSize=4096;texture.textureCompression=TextureImporterCompression.Uncompressed;texture.filterMode=FilterMode.Point;texture.mipmapEnabled=false;texture.alphaIsTransparency=true;
        }
    }
}
