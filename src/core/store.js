export class BrowserStore {
  constructor(namespace='anu2-v3'){ this.ns=namespace; this.memory=new Map(); }
  key(k){ return `${this.ns}:${k}`; }
  get(k, fallback=null){
    try { if(globalThis.localStorage){ const raw=globalThis.localStorage.getItem(this.key(k)); return raw==null?fallback:JSON.parse(raw); } } catch {}
    return this.memory.has(k)?structuredClone(this.memory.get(k)):fallback;
  }
  set(k, value){
    try { if(globalThis.localStorage){ globalThis.localStorage.setItem(this.key(k), JSON.stringify(value)); return value; } } catch {}
    this.memory.set(k, structuredClone(value)); return value;
  }
  remove(k){ try{ if(globalThis.localStorage) globalThis.localStorage.removeItem(this.key(k)); }catch{} this.memory.delete(k); }
  export(keys){ return Object.fromEntries(keys.map(k=>[k,this.get(k,[])])); }
  import(data){ Object.entries(data||{}).forEach(([k,v])=>this.set(k,v)); }
}
