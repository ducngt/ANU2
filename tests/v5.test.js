import test from 'node:test';
import assert from 'node:assert/strict';
import {BrowserStore} from '../src/core/store.js';
import {seed} from '../src/core/seed.js';
import {migrateStore} from '../src/core/migrate.js';
import {IdentityBox} from '../src/boxes/identity-box.js';
import {ArtifactStore,mediaTypeOf} from '../src/artifacts/artifact-store.js';
import {DOMAIN_REGISTRY} from '../src/domains/domain-registry.js';
import {WorkService} from '../src/work/work-service.js';

test('V5 restores seven domain intelligence areas',()=>{
  assert.deepEqual(DOMAIN_REGISTRY.map(x=>x.id),['LIS','RIS','SIS','PIS','OIS','FIS','FMS']);
  for(const d of DOMAIN_REGISTRY){ assert.ok(d.dataKeys.length>0); assert.ok(d.defaultAgents.length>0); }
});

test('multimodal intake classifies image video audio and document',()=>{
  assert.equal(mediaTypeOf({name:'room.jpg',type:'image/jpeg'}),'IMAGE');
  assert.equal(mediaTypeOf({name:'meeting.mp4',type:'video/mp4'}),'VIDEO');
  assert.equal(mediaTypeOf({name:'voice.m4a',type:'audio/mp4'}),'AUDIO');
  assert.equal(mediaTypeOf({name:'report.pdf',type:'application/pdf'}),'DOCUMENT');
});

test('artifact intake persists provenance metadata',async()=>{
  const s=new BrowserStore(`art-${Math.random()}`); migrateStore(s,seed,{version:'5.0.0'});
  const a=new ArtifactStore(s);
  const file={name:'note.txt',type:'text/plain',size:12,text:async()=> 'hello ANU',arrayBuffer:async()=>new TextEncoder().encode('hello ANU').buffer};
  const out=await a.ingest(file,{uploadedBy:'USR-ADMIN',domain:'OIS'});
  assert.equal(out.mediaType,'DOCUMENT'); assert.equal(out.uploadedBy,'USR-ADMIN'); assert.equal(out.domain,'OIS'); assert.match(out.textPreview,/hello ANU/); assert.equal(s.get('artifacts').length,1);
});

test('system admin user administration works',()=>{
  const s=new BrowserStore(`id-${Math.random()}`); migrateStore(s,seed,{version:'5.0.0'}); const id=new IdentityBox(s,seed);
  const u=id.create({username:'new.user',password:'Password123!',displayName:'New User',assignment:{id:'RA-X',role:'STAFF',tier:3,scope:{type:'UNIT',id:'OFFICE-ACADEMIC'},authority:[],dataScopes:['OFFICE-ACADEMIC'],status:'ACTIVE'}});
  assert.ok(id.authenticate('new.user','Password123!')); id.suspend(u.id); assert.equal(id.authenticate('new.user','Password123!'),null); id.activate(u.id); assert.ok(id.authenticate('new.user','Password123!'));
  id.addAssignment(u.id,{id:'RA-Y',role:'RESEARCHER',tier:3,scope:{type:'PROJECT',id:'PROJECT-AI-2026'},authority:[],dataScopes:['PROJECT-AI-2026'],status:'ACTIVE'}); assert.equal(id.get(u.id).assignments.length,2);
});

test('admin has Human-AI governance work with delegated AI',()=>{
  const w=seed.workItems.find(x=>x.id==='WORK-SYS-GOV'); assert.ok(w); assert.equal(w.humanOwner,'USR-ADMIN'); assert.ok(w.assignments.some(x=>x.agentId==='access-governance-agent')); assert.ok(w.assignments.every(x=>x.humanCheckpoint));
});

test('work delegation carries domain resource data validity and checkpoint',()=>{
  const s=new BrowserStore(`w-${Math.random()}`); migrateStore(s,seed,{version:'5.0.0'}); const ws=new WorkService(s,s.get('agents'));
  const w=ws.create({title:'Test',purpose:'Test delegation',humanOwner:'USR-ADMIN',scope:{type:'SYSTEM',id:'ANU2'},domain:'OIS'});
  const ag=s.get('agents').find(x=>x.id==='system-governance-agent');
  ws.assign(w.id,{agentId:ag.id,task:'Review',capabilities:ag.capabilities,actions:ag.defaultActions,domain:'OIS',resourceScope:'SYSTEM',dataScope:'audit,users',validUntil:new Date(Date.now()+86400000).toISOString(),humanCheckpoint:'BEFORE_CHANGE',delegatedBy:'USR-ADMIN'});
  const a=ws.get(w.id).assignments[0]; assert.equal(a.domain,'OIS'); assert.equal(a.resourceScope,'SYSTEM'); assert.equal(a.dataScope,'audit,users'); assert.equal(a.humanCheckpoint,'BEFORE_CHANGE');
});
