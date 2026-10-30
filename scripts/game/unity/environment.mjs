import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
export const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
// Tool configuration only; none of these values are copied into game JSON.
export function toolSettings(env=process.env){
 return {
  originalAssets:path.resolve(env.SANHA_ORIGINAL_ASSETS||path.join(os.homedir(),'Documents/ChatGPT/조조전/outputs/jojo-mac-preview/assets')),
  project:path.resolve(env.SANHA_UNITY_PROJECT||path.join(repo,'unity')),
  editor:env.SANHA_UNITY_EDITOR||'/Applications/Unity/Hub/Editor/6000.2.6f2/Unity.app/Contents/MacOS/Unity',
  exportConfig:path.resolve(env.SANHA_EXPORT_CONFIG||path.join(repo,'config/unity/export.json')),
 };
}
