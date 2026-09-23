import test from 'node:test';
import assert from 'node:assert/strict';
import {seed} from '../src/core/seed.js';
import {BrowserStore} from '../src/core/store.js';
import {AuditBox} from '../src/boxes/audit-box.js';
import {ImportService} from '../src/import/import-service.js';
import {ModelGatewayBox} from '../src/boxes/model-gateway-box.js';

test('Rector and Vice Rector have university-wide data scope',()=>{
  const rector=seed.users.find(x=>x.username==='rector');
  const vice=seed.users.find(x=>x.username==='executive');
  assert.equal(rector.assignments[0].role,'RECTOR');
  assert.ok(rector.assignments[0].dataScopes.includes('*'));
  assert.ok(vice.assignments[0].dataScopes.includes('*'));
  assert.equal(rector.assignments[0].scope.id,'ANU');
  assert.equal(vice.assignments[0].scope.id,'ANU');
});

test('organization import preserves functions and responsibilities',()=>{
  const s=new BrowserStore(`org-${Math.random()}`); for(const k of ['organizations','importBatches','audit','provisioningQueue']) s.set(k,structuredClone(seed[k]||[]));
  const imp=new ImportService(s,new AuditBox(s));
  const rows=imp.validate('ORGANIZATION',imp.normalize('ORGANIZATION',[{code:'OFF-X',name:'Office X',type:'OFFICE',parentId:'ANU',functions:'Planning;Reporting',responsibilities:'Prepare plan;Publish report'}]));
  const b=imp.commit({type:'ORGANIZATION',rows,userId:'USR-ADMIN',fileName:'org.csv'});
  assert.equal(b.valid,1);
  const o=s.get('organizations').find(x=>x.code==='OFF-X');
  assert.deepEqual(o.functions,['Planning','Reporting']);
  assert.deepEqual(o.responsibilities,['Prepare plan','Publish report']);
});

test('real provider never silently falls back to mock when key is missing',async()=>{
  const g=new ModelGatewayBox(); g.setConfig({provider:'openai',model:'gpt-5'});
  await assert.rejects(()=>g.reason({system:'s',user:'u'}),/API key is required/);
});

test('mock runs only when explicitly selected',async()=>{
  const g=new ModelGatewayBox(); g.setConfig({provider:'mock'}); const r=await g.reason({system:'s',user:'hello'}); assert.equal(r.provider,'mock');
});
