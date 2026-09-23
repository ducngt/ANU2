export class IdentityBox {
  constructor(store, seed){ this.store=store; this.seed=seed; if(!store.get('users')) store.set('users',seed.users); if(!store.get('roles')) store.set('roles',seed.roles); }
  list(){ return this.store.get('users',[]); }
  roles(){ return this.store.get('roles',[]); }
  authenticate(username,password){ return this.list().find(u=>u.status==='ACTIVE'&&u.username===username&&u.password===password)||null; }
  get(id){ return this.list().find(u=>u.id===id)||null; }
  save(user){ const arr=this.list(); const i=arr.findIndex(x=>x.id===user.id); if(i>=0) arr[i]=user; else arr.push(user); this.store.set('users',arr); return user; }
  create({username,password,displayName,email='',phone='',assignment}){ if(!username||!password||!displayName) throw new Error('REQUIRED_FIELDS'); if(this.list().some(u=>u.username===username)) throw new Error('USERNAME_EXISTS'); const user={id:`USR-${globalThis.crypto?.randomUUID?.().slice(0,8).toUpperCase()||Date.now()}`,username,password,displayName,email,phone,status:'ACTIVE',assignments:assignment?[assignment]:[]}; return this.save(user); }
  addAssignment(userId,assignment){ const u=this.get(userId); if(!u) throw new Error('USER_NOT_FOUND'); const exists=(u.assignments||[]).some(a=>a.role===assignment.role&&a.scope?.id===assignment.scope?.id&&a.status==='ACTIVE'); if(exists) throw new Error('ASSIGNMENT_EXISTS'); u.assignments=[...(u.assignments||[]),assignment]; return this.save(u); }
  suspend(userId){ const u=this.get(userId); if(!u) throw new Error('USER_NOT_FOUND'); u.status='SUSPENDED'; return this.save(u); }
  activate(userId){ const u=this.get(userId); if(!u) throw new Error('USER_NOT_FOUND'); u.status='ACTIVE'; return this.save(u); }
  resetPassword(userId,newPassword){const u=this.get(userId);if(!u)throw new Error('USER_NOT_FOUND');if(!newPassword||newPassword.length<8)throw new Error('WEAK_PASSWORD');u.password=newPassword;return this.save(u);}
  removeAssignment(userId,assignmentId){const u=this.get(userId);if(!u)throw new Error('USER_NOT_FOUND');u.assignments=(u.assignments||[]).filter(a=>a.id!==assignmentId);return this.save(u);}
}
