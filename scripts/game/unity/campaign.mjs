// Pure conversion: authored story + presentation bindings; no filesystem or Unity dependency.
export function buildCampaign(data, config, assets) {
  if(config.schemaVersion!==1) throw Error('Unsupported export config');
  const stages=data.stages.map(x=>({id:x.id,title:x.title,period:x.period,route:x.route,situation:x.situation,
    scenes:x.scenes.map(s=>({...s,lines:s.lines.map(l=>({...l})),background:'',actors:[]}))}));
  const stage=stages.find(x=>x.id===config.visualStageId);
  if(!stage) throw Error('Unknown visual stage: '+config.visualStageId);
  const intro=data.interludes.find(x=>x.title.startsWith(config.introId+' '));
  if(!intro) throw Error('Missing intro');
  const lines=intro.body.split('\n').flatMap(line=>{const m=line.match(/^([^:]+): “(.+)”$/);return m?[{speaker:m[1],text:m[2]}]:[]});
  if(lines.length!==config.introExpectedLines) throw Error('Intro format changed; review the source');
  stage.scenes.unshift({id:config.introId,type:config.introTitle,trigger:'도입',direction:'기존 마당 배경 군영 대역',lines});
  const ids=new Set(stage.scenes.map(x=>x.id));
  for(const id of [...Object.keys(config.casts),...config.mapScenes,...config.battlefieldScenes])
    if(!ids.has(id)) throw Error('Binding refers to unknown scene: '+id);
  for(const scene of stage.scenes){
    const battle=config.battlefieldScenes.includes(scene.id);
    scene.background=battle||config.mapScenes.includes(scene.id)?assets.map:assets.background;
    if(!scene.background) throw Error('Missing background binding');
    scene.actors=(config.casts[scene.id]??[]).map((name,index)=>{
      const texture=assets.actors[name]?.[battle?'combat':'scenario'];
      const x=config.positions[index];
      if(!texture||!Number.isFinite(x)||x<0||x>1) throw Error('Invalid actor binding: '+name);
      return {name,texture,x};
    });
  }
  const campaign={schemaVersion:1,stages};
  validateCampaign(campaign);
  return campaign;
}
export function validateCampaign(data){
  if(data.schemaVersion!==1||!data.stages?.length) throw Error('Unsupported/empty campaign');
  const ids=new Set();
  for(const stage of data.stages){
    if(!stage.id||ids.has(stage.id)||!stage.scenes?.length) throw Error('Invalid stage: '+stage.id);
    ids.add(stage.id); const scenes=new Set();
    for(const scene of stage.scenes){
      if(!scene.id||scenes.has(scene.id)||!scene.lines?.length) throw Error('Invalid scene: '+scene.id);
      scenes.add(scene.id);
      if(scene.lines.some(l=>!l.speaker?.trim()||!l.text?.trim())) throw Error('Empty dialogue: '+scene.id);
      for(const a of scene.actors??[]) if(!a.texture||!Number.isFinite(a.x)||a.x<0||a.x>1) throw Error('Invalid actor');
    }
  }
}
