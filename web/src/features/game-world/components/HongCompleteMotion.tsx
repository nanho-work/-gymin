import {GeneralCompleteMotion} from './GeneralCompleteMotion';
import characters from '../data/playable-characters.json';
export function HongCompleteMotion(){const c=characters.records.find(x=>x.id==='hong-yu')!;return <GeneralCompleteMotion name="홍유" originalName="하후돈" portrait={c.portrait} jobId={9}/>}
