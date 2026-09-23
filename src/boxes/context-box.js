export class ContextBox {
  constructor(store,audit){ this.store=store; this.audit=audit; }
  active(user){ const saved=this.store.get(`context:${user.id}`); const a=(user.assignments||[]).find(x=>x.id===saved)||(user.assignments||[])[0]||null; return a; }
  switch(user,assignmentId){ if(!(user.assignments||[]).some(x=>x.id===assignmentId)) throw new Error('INVALID_CONTEXT'); this.store.set(`context:${user.id}`,assignmentId); this.audit?.record({actorId:user.id,action:'CONTEXT_SWITCH',resourceId:assignmentId}); return this.active(user); }
}
