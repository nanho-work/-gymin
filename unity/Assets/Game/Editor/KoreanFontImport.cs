using UnityEditor;
namespace Sanha.Editor
{
    public sealed class KoreanFontImport:AssetPostprocessor
    {
        void OnPreprocessAsset(){if(assetPath!="Assets/Resources/Fonts/NanumGothic-Regular.ttf")return;var font=assetImporter as TrueTypeFontImporter;if(font==null)return;font.fontTextureCase=FontTextureCase.Dynamic;font.includeFontData=true;font.fontSize=20;}
    }
}
