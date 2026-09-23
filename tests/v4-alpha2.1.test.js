import test from 'node:test';
import assert from 'node:assert/strict';
import {BrowserStore} from '../src/core/store.js';
import {seed} from '../src/core/seed.js';
import {migrateStore} from '../src/core/migrate.js';
import {IdentityBox} from '../src/boxes/identity-box.js';
import {PasswordRecoveryBox} from '../src/boxes/password-recovery-box.js';
import {ModelGatewayBox} from '../src/boxes/model-gateway-box.js';

test('migration adds rector to an existing older browser store without wiping local users',()=>{
  const s=new BrowserStore(`mig-${Math.random()}`);
  s.set('users',[{id:'USR-ADMIN',username:'admin',password:'CustomAdmin!',displayName:'Local Admin',status:'ACTIVE',assignments:[]}]);
  migrateStore(s,seed);
  const users=s.get('users');
  assert.ok(users.find(u=>u.username==='rector'));
  assert.equal(users.find(u=>u.username==='admin').password,'CustomAdmin!');
});

test('rector demo account authenticates after migration',()=>{
  const s=new BrowserStore(`rector-${Math.random()}`); migrateStore(s,seed);
  const identity=new IdentityBox(s,seed);
  const u=identity.authenticate('rector','Rector123!');
  assert.equal(u?.assignments?.[0]?.role,'RECTOR');
  assert.ok(u?.assignments?.[0]?.dataScopes?.includes('*'));
});

test('password recovery can complete in alpha demo mode',async()=>{
  const s=new BrowserStore(`pwd-${Math.random()}`); migrateStore(s,seed);
  const recovery=new PasswordRecoveryBox(s);
  const r=await recovery.request({identifier:'rector',channel:'email'});
  assert.ok(r.demoToken);
  recovery.reset({token:r.demoToken,newPassword:'NewRector123!'});
  const identity=new IdentityBox(s,seed);
  assert.ok(identity.authenticate('rector','NewRector123!'));
});

test('AI inference test executes the selected runtime, not only model listing',async()=>{
  const g=new ModelGatewayBox(); g.setConfig({provider:'mock'});
  const r=await g.testInference();
  assert.equal(r.provider,'mock');
  assert.ok(r.text.length>0);
  assert.ok(Number.isFinite(r.latencyMs));
});

test('expanded university reality domains are present',()=>{
  assert.ok(seed.organizations.length>=8);
  assert.ok(seed.programs.length>=2);
  assert.ok(seed.courses.length>=2);
  assert.ok(seed.researchProjects.length>=1);
});
