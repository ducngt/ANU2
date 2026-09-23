export class AuditBox {
  constructor(key='anu2.audit'){ this.key=key; }
  record(event){
    const all=this.list(); all.unshift({id:crypto.randomUUID(),timestamp:new Date().toISOString(),...event});
    localStorage.setItem(this.key,JSON.stringify(all.slice(0,500))); return all[0];
  }
  list(){ try{return JSON.parse(localStorage.getItem(this.key)||'[]')}catch{return []} }
}
