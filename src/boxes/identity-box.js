export class IdentityBox {
  constructor(store, seed){ this.store=store; this.seed=seed; if(!store.get('users')) store.set('users',seed.users); if(!store.get('roles')) store.set('roles',seed.roles); }
  list(){ return this.store.get('users',[]); }
  roles(){ return this.store.get('roles',[]); }
  authenticate(username,password){ return this.list().find(u=>u.status==='ACTIVE'&&u.username===username&&u.password===password)||null; }
  get(id){ return this.list().find(u=>u.id===id)||null; }
  save(user){ const arr=this.list(); const i=arr.findIndex(x=>x.id===user.id); if(i>=0) arr[i]=user; else arr.push(user); this.store.set('users',arr); return user; }
  create({username,password,displayName,assignment}){ if(this.list().some(u=>u.username===username)) throw new Error('USERNAME_EXISTS'); const user={id:`USR-${crypto.randomUUID().slice(0,8).toUpperCase()}`,username,password,displayName,status:'ACTIVE',assignments:[assignment]}; return this.save(user); }
  addAssignment(userId,assignment){ const u=this.get(userId); if(!u) throw new Error('USER_NOT_FOUND'); u.assignments=[...(u.assignments||[]),assignment]; return this.save(u); }
  suspend(userId){ const u=this.get(userId); if(!u) throw new Error('USER_NOT_FOUND'); u.status='SUSPENDED'; return this.save(u); }
}
