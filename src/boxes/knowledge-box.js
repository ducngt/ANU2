export class KnowledgeBox {
  constructor(store,seed){ this.store=store; if(!store.get('knowledge')) store.set('knowledge',seed.knowledge); }
  list(){ return this.store.get('knowledge',[]); }
  search(query,ctx,limit=5){ const q=String(query||'').toLowerCase(); const scopes=new Set(['PUBLIC',ctx?.scope?.id,...(ctx?.dataScopes||[])]); return this.list().filter(r=>r.valid!==false && scopes.has(r.scope) && (r.title+' '+r.text).toLowerCase().split(/\s+/).some(t=>q.includes(t)||t.length>4&&q.split(/\s+/).includes(t))).slice(0,limit); }
}
