export class PolicyBox {
  effective(user,context){ return {identity:user?.id,role:context?.role,tier:context?.tier,scope:context?.scope,authority:context?.authority||[],dataScopes:context?.dataScopes||[]}; }
  canSystemAdmin(ctx){ return ctx?.role==='SYSTEM_ADMIN'; }
  canManageUsers(ctx){ return this.canSystemAdmin(ctx); }
  canManageCapabilities(ctx){ return this.canSystemAdmin(ctx); }
  canApproveInstitutional(ctx){ return ctx?.tier===1 && (ctx?.authority||[]).includes('INSTITUTIONAL_APPROVE'); }
  canApproveUnit(ctx,scopeId){ return ctx?.tier===2 && (ctx?.authority||[]).includes('UNIT_APPROVE') && ctx?.scope?.id===scopeId; }
  canUseCapability(ctx,cap){ if(!ctx||!cap||cap.status!=='ACTIVE') return false; if(ctx.role==='SYSTEM_ADMIN') return cap.authority==='READ' || cap.domain==='Help'; if(cap.scope==='UNIVERSITY' && ctx.tier>1) return false; return true; }
  decision(action,ctx,resource={}){
    if(action==='SYSTEM_ADMIN') return {allow:this.canSystemAdmin(ctx),reason:'SYSTEM_ADMIN_ROLE_REQUIRED'};
    if(action==='INSTITUTIONAL_APPROVE') return {allow:this.canApproveInstitutional(ctx),reason:'TIER1_INSTITUTIONAL_AUTHORITY_REQUIRED'};
    if(action==='UNIT_APPROVE') return {allow:this.canApproveUnit(ctx,resource.scopeId),reason:'UNIT_SCOPE_AUTHORITY_REQUIRED'};
    return {allow:true,reason:'DEFAULT_ALLOW'};
  }
}
