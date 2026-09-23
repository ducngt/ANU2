export class FailureBox {
  constructor(store,audit){ this.store=store; this.audit=audit; if(!store.get('failures')) store.set('failures',[]); }
  stop({taskId,reason,state,actorId}){ const f={id:`FAIL-${Date.now()}`,timestamp:new Date().toISOString(),taskId,reason,state,preserved:true,status:'HANDOFF_REQUIRED'}; const arr=this.list(); arr.unshift(f); this.store.set('failures',arr); this.audit?.record({actorId,action:'SAFE_FAILURE',resourceId:taskId,reason}); return f; }
  list(){ return this.store.get('failures',[]); }
}
