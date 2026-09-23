export class AdminAssembly {
  constructor({identity,capabilities,wires,audit,policy}){Object.assign(this,{identity,capabilities,wires,audit,policy});}
  guard(ctx){ if(!this.policy.canSystemAdmin(ctx)) throw new Error('SYSTEM_ADMIN_REQUIRED'); }
  createUser(actor,ctx,payload){ this.guard(ctx); const user=this.identity.create(payload); this.audit.record({actorId:actor.id,contextId:ctx.id,action:'USER_CREATE',resourceId:user.id}); return user; }
  addAssignment(actor,ctx,userId,assignment){ this.guard(ctx); const u=this.identity.addAssignment(userId,assignment); this.audit.record({actorId:actor.id,contextId:ctx.id,action:'ROLE_ASSIGN',resourceId:userId,assignment}); return u; }
  saveCapability(actor,ctx,cap){ this.guard(ctx); const c=this.capabilities.save(cap); this.audit.record({actorId:actor.id,contextId:ctx.id,action:'CAPABILITY_SAVE',resourceId:c.id}); return c; }
  saveWire(actor,ctx,wire){ this.guard(ctx); const w=this.wires.save(wire); this.audit.record({actorId:actor.id,contextId:ctx.id,action:'WIRE_SAVE',resourceId:w.id}); return w; }
}
