export class AuditBox {
  constructor(store){ this.store=store; if(!store.get('audit')) store.set('audit',[]); }
  record(evt){ const arr=this.list(); const event={id:`AUD-${Date.now()}-${Math.random().toString(16).slice(2,6)}`,timestamp:new Date().toISOString(),...evt}; arr.unshift(event); this.store.set('audit',arr.slice(0,1000)); return event; }
  list(){ return this.store.get('audit',[]); }
}
