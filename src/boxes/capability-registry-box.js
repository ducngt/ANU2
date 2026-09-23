export class CapabilityRegistryBox {
  constructor(store, seed){ this.store=store; if(!store.get('capabilities')) store.set('capabilities',seed.capabilities); }
  list(){ return this.store.get('capabilities',[]); }
  get(id){ return this.list().find(x=>x.id===id)||null; }
  save(cap){ const arr=this.list(); const i=arr.findIndex(x=>x.id===cap.id); const next={status:'ACTIVE',version:'2.0.0',agents:[],tools:[],evidence:'REQUIRED',...cap}; if(i>=0) arr[i]=next; else arr.push(next); this.store.set('capabilities',arr); return next; }
  deactivate(id){ const c=this.get(id); if(!c) throw new Error('CAPABILITY_NOT_FOUND'); c.status='INACTIVE'; return this.save(c); }
}
