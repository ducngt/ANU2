export class RegistryBox {
  constructor(store,key,seed=[]){ this.store=store; this.key=key; if(!store.get(key)) store.set(key,seed); }
  list(){ return this.store.get(this.key,[]); }
  get(id){ return this.list().find(x=>x.id===id)||null; }
  save(item){ const arr=this.list(); const i=arr.findIndex(x=>x.id===item.id); if(i>=0) arr[i]=item; else arr.push(item); this.store.set(this.key,arr); return item; }
}
