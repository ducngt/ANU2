export class PolicyBox{
  canManageUsers(actor){return actor?.assignments?.some(a=>a.role==='SYSTEM_ADMIN')}
  canManageCapabilities(actor){return actor?.assignments?.some(a=>['SYSTEM_ADMIN','VICE_RECTOR'].includes(a.role))}
  canApproveInstitutional(actor){return actor?.assignments?.some(a=>['RECTOR','VICE_RECTOR'].includes(a.role))}
  explain(actor,action){
    if(action==='manage-users') return this.canManageUsers(actor)?'ALLOW: SYSTEM_ADMIN':'DENY: requires SYSTEM_ADMIN';
    if(action==='manage-capabilities') return this.canManageCapabilities(actor)?'ALLOW':'DENY: requires SYSTEM_ADMIN or VICE_RECTOR';
    if(action==='institutional-approve') return this.canApproveInstitutional(actor)?'ALLOW':'DENY: system administration alone is not institutional authority';
    return 'DENY: no matching policy';
  }
}
