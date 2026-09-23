const clone=v=>structuredClone(v);
const keyFor={
  users:x=>x.id||x.username,
  roles:x=>x.id,
  capabilities:x=>x.id,
  agents:x=>x.id,
  knowledge:x=>x.id,
  workItems:x=>x.id,
  organizations:x=>x.id||x.code,
  personnel:x=>x.id||x.employeeCode,
  students:x=>x.id||x.studentCode,
  facilities:x=>x.id,
  assets:x=>x.id||x.assetCode,
  inventory:x=>x.id||x.itemCode,
  programs:x=>x.id||x.code,
  courses:x=>x.id||x.code,
  researchProjects:x=>x.id||x.code
};

function mergeSeedArray(existing=[], incoming=[], keyFn){
  const out=clone(existing||[]);
  const index=new Map(out.map((x,i)=>[String(keyFn(x)),i]));
  for(const s of incoming||[]){
    const k=String(keyFn(s));
    if(!index.has(k)){ index.set(k,out.length); out.push(clone(s)); continue; }
    const i=index.get(k);
    // Existing/local data wins; seed only fills newly introduced fields.
    out[i]={...clone(s),...out[i]};
    if(Array.isArray(s.assignments)&&Array.isArray(out[i].assignments)){
      const byId=new Map(out[i].assignments.map(a=>[a.id,a]));
      for(const a of s.assignments) if(!byId.has(a.id)) out[i].assignments.push(clone(a));
    }
  }
  return out;
}

export function migrateStore(store,seed,{version='4.0.0-alpha.2.1'}={}){
  const report=[];
  for(const [name,keyFn] of Object.entries(keyFor)){
    const before=store.get(name,[]);
    const merged=mergeSeedArray(before,seed[name]||[],keyFn);
    store.set(name,merged);
    if(merged.length!==before.length) report.push({name,before:before.length,after:merged.length});
  }
  for(const name of ['importBatches','provisioningQueue','audit','traces','memory','failures','passwordResetRequests']){
    if(store.get(name)==null) store.set(name,clone(seed[name]||[]));
  }
  store.set('schemaVersion',version);
  return report;
}
