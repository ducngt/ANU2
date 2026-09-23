export class PasswordRecoveryBox {
  constructor(store,{gatewayUrl=''}={}){ this.store=store; this.gatewayUrl=gatewayUrl; }
  findUser(identifier){
    const q=String(identifier||'').trim().toLowerCase();
    return this.store.get('users',[]).find(u=>[u.username,u.email,u.phone].some(v=>String(v||'').toLowerCase()===q))||null;
  }
  mask(v,type){ const s=String(v||''); if(type==='email'){ const [a,b='']=s.split('@'); return a?`${a.slice(0,2)}***@${b}`:''; } return s.length>4?`${'*'.repeat(Math.max(0,s.length-4))}${s.slice(-4)}`:s; }
  async request({identifier,channel='email'}){
    const user=this.findUser(identifier);
    // Do not disclose account existence in production-facing response.
    if(!user) return {ok:true,delivered:false,message:'Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.'};
    const destination=channel==='sms'?user.phone:user.email;
    if(!destination) throw new Error(channel==='sms'?'Tài khoản chưa có số điện thoại.':'Tài khoản chưa có email.');
    const token=crypto.randomUUID(); const expiresAt=new Date(Date.now()+15*60*1000).toISOString();
    const req={id:`PWD-${Date.now()}`,userId:user.id,channel,destination,token,expiresAt,status:'PENDING',createdAt:new Date().toISOString()};
    const arr=this.store.get('passwordResetRequests',[]); arr.unshift(req); this.store.set('passwordResetRequests',arr);
    if(this.gatewayUrl){
      const res=await fetch(this.gatewayUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:user.id,channel,destination,token,expiresAt})});
      if(!res.ok) throw new Error(`Recovery gateway ${res.status}`);
      req.status='SENT'; this.store.set('passwordResetRequests',arr);
      return {ok:true,delivered:true,masked:this.mask(destination,channel==='sms'?'sms':'email')};
    }
    // Static GitHub Pages cannot securely send SMS/email. Keep a test token for alpha UX only.
    req.status='DEMO_READY'; this.store.set('passwordResetRequests',arr);
    return {ok:true,delivered:false,demoToken:token,masked:this.mask(destination,channel==='sms'?'sms':'email')};
  }
  reset({token,newPassword}){
    const requests=this.store.get('passwordResetRequests',[]); const r=requests.find(x=>x.token===token&&['SENT','DEMO_READY','PENDING'].includes(x.status));
    if(!r) throw new Error('Mã đặt lại mật khẩu không hợp lệ.');
    if(Date.parse(r.expiresAt)<Date.now()) throw new Error('Mã đặt lại mật khẩu đã hết hạn.');
    if(String(newPassword||'').length<8) throw new Error('Mật khẩu mới phải có ít nhất 8 ký tự.');
    const users=this.store.get('users',[]); const u=users.find(x=>x.id===r.userId); if(!u) throw new Error('Không tìm thấy tài khoản.');
    u.password=newPassword; r.status='USED'; r.usedAt=new Date().toISOString(); this.store.set('users',users); this.store.set('passwordResetRequests',requests); return true;
  }
}
