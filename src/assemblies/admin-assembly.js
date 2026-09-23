export class AdminAssembly{
  constructor({identity,capabilities,audit,policy}){Object.assign(this,{identity,capabilities,audit,policy})}
  createUser(actor,user){if(!this.policy.canManageUsers(actor)) throw new Error('Not authorized'); const out=this.identity.upsert(user); this.audit.record({actorId:actor.id,action:'USER_UPSERT',resourceId:out.id}); return out}
  saveCapability(actor,cap){if(!this.policy.canManageCapabilities(actor)) throw new Error('Not authorized'); const out=this.capabilities.upsert(cap); this.audit.record({actorId:actor.id,action:'CAPABILITY_UPSERT',resourceId:out.id}); return out}
}
