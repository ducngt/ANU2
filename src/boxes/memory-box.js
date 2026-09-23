export class MemoryBox {
  constructor(store){ this.store=store; if(!store.get('memory')) store.set('memory',[]); }
  remember(item){ const arr=this.list(); arr.unshift({id:`MEM-${Date.now()}`,timestamp:new Date().toISOString(),...item}); this.store.set('memory',arr.slice(0,500)); }
  list(){ return this.store.get('memory',[]); }
}
