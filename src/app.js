import {IdentityBox} from './boxes/identity-box.js';
import {CapabilityRegistryBox} from './boxes/capability-registry-box.js';
import {WireRegistryBox} from './boxes/wire-registry-box.js';
import {AuditBox} from './boxes/audit-box.js';
import {PolicyBox} from './boxes/policy-box.js';
import {AdminAssembly} from './assemblies/admin-assembly.js';
import {SBBSRuntime} from './assemblies/sbbs-runtime.js';

const identity=new IdentityBox();
const capabilities=new CapabilityRegistryBox();
const wires=new WireRegistryBox();
const audit=new AuditBox();
const policy=new PolicyBox();
const adminAssembly=new AdminAssembly({identity,capabilities,audit,policy});
const runtime=new SBBSRuntime()
 .registerBox('SBBox-Identity',identity)
 .registerBox('SBBox-CapabilityRegistry',capabilities)
 .registerBox('SBBox-WireRegistry',wires)
 .registerBox('SBBox-Audit',audit)
 .registerBox('SBBox-Policy',policy)
 .registerAssembly('AdminGovernance',adminAssembly);

const state={actor:null,view:'dashboard'};
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function loginScreen(){
 app.innerHTML=`<div class="login"><h1>ANU2 — SBBS v2.0</h1><p class="muted">Executable reference implementation for GitHub Pages</p><label>Username</label><input id="u" value="admin"><label>Password</label><input id="p" type="password" value="Admin123!"><button class="btn" id="login">Đăng nhập</button><p class="small muted">Demo: admin / Admin123! · executive / Executive123! · manager / Manager123! · researcher / Research123!</p><div class="notice small">GitHub Pages là static hosting. Authentication/authorization trong bản này là reference/demo phía trình duyệt, không phải kiểm soát an ninh thể chế.</div></div>`;
 document.querySelector('#login').onclick=()=>{
  const u=document.querySelector('#u').value.trim();
  const pw=document.querySelector('#p').value;
  const pass={admin:'Admin123!',executive:'Executive123!',manager:'Manager123!',researcher:'Research123!'};
  const actor=identity.list().find(x=>x.username===u && pass[u]===pw);
  if(!actor){alert('Sai tài khoản demo');return}
  state.actor=actor;audit.record({actorId:actor.id,action:'LOGIN',resourceId:'browser-session'});render();
 };
}

function navButton(id,label){return `<button data-view="${id}" class="${state.view===id?'active':''}">${label}</button>`}
function shell(content){
 const actor=state.actor; const assignment=actor.assignments?.[0];
 app.innerHTML=`<div class="app"><aside class="sidebar"><div class="brand">ANU2</div><div class="version">SBBS v2.0 · GitHub Pages</div><div class="nav">${navButton('dashboard','Dashboard')}${navButton('capabilities','Capability Registry')}${navButton('users','Identity & Roles')}${navButton('wires','Smart Wires')}${navButton('architecture','SBBS Architecture')}${navButton('audit','Audit & Trust')}</div></aside><main class="main"><div class="topbar"><div><b>${esc(actor.displayName)}</b><div class="small muted">${esc(assignment?.role)} · Tier ${esc(assignment?.tier)} · ${esc(assignment?.scope)}</div></div><div class="context"><button class="btn secondary" id="logout">Đăng xuất</button></div></div>${content}<div class="footer">ANU2 v2.0 — Smart Boxes · Smart Wires · Assemblies · Components</div></main></div>`;
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;render()});
 document.querySelector('#logout').onclick=()=>{audit.record({actorId:actor.id,action:'LOGOUT'});state.actor=null;render()};
}

function dashboard(){
 const snap=runtime.snapshot();
 return `<h1>Living University Dashboard</h1><div class="notice">ANU định nghĩa mục đích và vòng đời; SBBS định nghĩa cách đóng gói, kết nối, lắp ráp và biểu diễn năng lực.</div><div class="card"><h3>ANU Living Cycle</h3><div class="cycle">${['REALITY','DATA','KNOWLEDGE','CAPABILITY','INTELLIGENCE','DECISION','ACTION','EVIDENCE','LEARNING','NEW CAPABILITY'].map((x,i)=>`<span>${x}</span>${i<9?'<b class="arrow">→</b>':''}`).join('')}</div></div><div class="grid"><div class="card"><div class="muted">Smart Boxes</div><div class="metric">${snap.boxes.length}</div></div><div class="card"><div class="muted">Smart Wires</div><div class="metric">${wires.list().length}</div></div><div class="card"><div class="muted">Capabilities</div><div class="metric">${capabilities.list().length}</div></div><div class="card"><div class="muted">Identities</div><div class="metric">${identity.list().length}</div></div></div><div class="card"><h3>Constitutional checks</h3><table><tr><th>Invariant</th><th>Status</th></tr><tr><td>Capability ≠ Authority</td><td class="ok">Enforced by PolicyBox</td></tr><tr><td>System Admin ≠ institutional decision authority</td><td class="ok">Enforced</td></tr><tr><td>Action → Audit</td><td class="ok">Enabled</td></tr><tr><td>GitHub Pages security boundary</td><td class="danger">Demo/reference only</td></tr></table></div>`;
}

function capabilityView(){
 const can=policy.canManageCapabilities(state.actor);
 const rows=capabilities.list().map(c=>`<tr><td><b>${esc(c.id)}</b><br><span class="small muted">${esc(c.name)}</span></td><td>${esc(c.box)}</td><td>${esc(c.authority)}</td><td>${esc(c.scope)}</td><td>${esc(c.version)}</td><td><span class="tag">${esc(c.status)}</span></td></tr>`).join('');
 return `<h1>Capability Registry</h1><p class="muted">Capability được quản trị như contract tái sử dụng và được hiện thực bởi Smart Box/Agent/Tool phù hợp. Capability không tự sinh Authority.</p>${can?`<div class="card"><h3>Đăng ký / cập nhật Capability</h3><div class="form-grid"><label>ID<input id="cap-id" placeholder="research.synthesize"></label><label>Name<input id="cap-name" placeholder="Research Synthesize"></label><label>Smart Box<input id="cap-box" placeholder="SBBox-Research"></label><label>Authority<select id="cap-auth"><option>READ</option><option>ANALYZE</option><option>REASON</option><option>RECOMMEND</option><option>EXECUTE_DELEGATED</option></select></label><label>Scope<input id="cap-scope" value="CONTEXT"></label><label>Version<input id="cap-ver" value="2.0.0"></label></div><br><button class="btn" id="save-cap">Lưu Capability</button></div>`:''}<div class="card"><table><tr><th>Capability</th><th>Smart Box</th><th>Authority</th><th>Scope</th><th>Version</th><th>Status</th></tr>${rows}</table></div>`;
}

function usersView(){
 const can=policy.canManageUsers(state.actor);
 const rows=identity.list().map(u=>`<tr><td><b>${esc(u.displayName)}</b><br><span class="small muted">${esc(u.username)} · ${esc(u.id)}</span></td><td>${(u.assignments||[]).map(a=>`<span class="pill">${esc(a.role)} / T${esc(a.tier)} / ${esc(a.scope)}</span>`).join('')}</td><td>${esc(u.status)}</td></tr>`).join('');
 return `<h1>University Identity & Role Assignment</h1><p class="muted">Một Identity có thể có nhiều role assignment; quyền hiệu lực phụ thuộc active context, scope, authority và policy.</p>${can?`<div class="card"><h3>Tạo / phân quyền tài khoản</h3><div class="form-grid"><label>Username<input id="usr-name"></label><label>Tên hiển thị<input id="usr-display"></label><label>Role<select id="usr-role"><option>SYSTEM_ADMIN</option><option>VICE_RECTOR</option><option>DEPARTMENT_HEAD</option><option>LECTURER</option><option>RESEARCHER</option><option>STUDENT</option><option>STAFF</option></select></label><label>Tier<select id="usr-tier"><option>0</option><option>1</option><option>2</option><option>3</option></select></label><label>Scope<input id="usr-scope" value="UNIVERSITY"></label></div><br><button class="btn" id="save-user">Tạo Identity</button></div>`:`<div class="notice">Context hiện tại không có quyền quản trị Identity.</div>`}<div class="card"><table><tr><th>Identity</th><th>Assignments</th><th>Status</th></tr>${rows}</table></div>`;
}

function wiresView(){const rows=wires.list().map(w=>`<tr><td><b>${esc(w.id)}</b></td><td>${esc(w.from)}</td><td>→</td><td>${esc(w.to)}</td><td>${esc(w.contract)}</td><td>${esc(w.policy)}</td></tr>`).join('');return `<h1>Smart Wire Registry</h1><p class="muted">Smart Wires kết nối các năng lực qua contract ổn định, không phụ thuộc implementation bên trong Box.</p><div class="card"><table><tr><th>Wire</th><th>From</th><th></th><th>To</th><th>Contract</th><th>Policy</th></tr>${rows}</table></div>`}
function architectureView(){return `<h1>SBBS Architecture</h1><div class="arch">ANU OPERATING PURPOSE
        │
        ▼
SMART BLACK BOX SYSTEM
        │
 ┌──────┼────────┐
 │      │        │
BOXES  WIRES  ASSEMBLIES
 │      │        │
 └──────┼────────┘
        │
   COMPONENTS

ANU cycle:
REALITY → DATA → KNOWLEDGE → CAPABILITY → INTELLIGENCE
→ DECISION → ACTION → EVIDENCE → LEARNING → NEW CAPABILITY

Constitutional envelope:
IDENTITY × TRUST × GOVERNANCE × PRIVACY
Human purpose remains authoritative.</div><div class="card"><h3>Runtime snapshot</h3><pre>${esc(JSON.stringify(runtime.snapshot(),null,2))}</pre></div>`}
function auditView(){const rows=audit.list().slice(0,100).map(e=>`<tr><td>${esc(e.timestamp)}</td><td>${esc(e.actorId)}</td><td>${esc(e.action)}</td><td>${esc(e.resourceId||'')}</td></tr>`).join('');return `<h1>Audit & Trust</h1><p class="muted">Mọi thay đổi quan trọng trong reference runtime được ghi dấu. Không ghi API key.</p><div class="card"><table><tr><th>Time</th><th>Actor</th><th>Action</th><th>Resource</th></tr>${rows||'<tr><td colspan="4">Chưa có sự kiện</td></tr>'}</table></div>`}

function bindViewActions(){
 if(state.view==='capabilities' && policy.canManageCapabilities(state.actor)) document.querySelector('#save-cap')?.addEventListener('click',()=>{
   const id=document.querySelector('#cap-id').value.trim(); if(!id)return alert('Cần ID');
   adminAssembly.saveCapability(state.actor,{id,name:document.querySelector('#cap-name').value.trim()||id,box:document.querySelector('#cap-box').value.trim()||'SBBox-Generic',authority:document.querySelector('#cap-auth').value,scope:document.querySelector('#cap-scope').value.trim()||'CONTEXT',version:document.querySelector('#cap-ver').value.trim()||'2.0.0',domain:'Custom',owner:'University',status:'ACTIVE',agents:[],tools:[],evidence:'REQUIRED'}); render();
 });
 if(state.view==='users' && policy.canManageUsers(state.actor)) document.querySelector('#save-user')?.addEventListener('click',()=>{
   const username=document.querySelector('#usr-name').value.trim(); if(!username)return alert('Cần username');
   const role=document.querySelector('#usr-role').value; const tier=Number(document.querySelector('#usr-tier').value); const scope=document.querySelector('#usr-scope').value.trim()||'UNIVERSITY';
   adminAssembly.createUser(state.actor,{id:'USR-'+crypto.randomUUID().slice(0,8).toUpperCase(),username,displayName:document.querySelector('#usr-display').value.trim()||username,status:'ACTIVE',assignments:[{role,tier,scope}]}); render();
 });
}

function render(){
 if(!state.actor){loginScreen();return}
 const views={dashboard:dashboard,capabilities:capabilityView,users:usersView,wires:wiresView,architecture:architectureView,audit:auditView};
 shell((views[state.view]||dashboard)()); bindViewActions();
}
render();
