import test from 'node:test';
import assert from 'node:assert/strict';
import {BrowserStore} from '../src/core/store.js';
import {seed} from '../src/core/seed.js';
import {migrateStore} from '../src/core/migrate.js';
import {ArtifactStore} from '../src/artifacts/artifact-store.js';
import {MultimodalProcessor} from '../src/input/multimodal-processor.js';
import {ModelGatewayBox} from '../src/boxes/model-gateway-box.js';

test('V5.2 seeds governed Human-AI data intake work',()=>{
  const w=seed.workItems.find(x=>x.id==='WORK-DATA-INTAKE');
  assert.ok(w);
  assert.equal(w.humanOwner,'USR-ADMIN');
  const ai=w.assignments.find(x=>x.agentId==='data-intake-agent');
  assert.ok(ai.actions.includes('READ_FILE'));
  assert.equal(ai.humanCheckpoint,'BEFORE_COMMIT');
});

test('V5.2 migration adds new baseline capabilities/actions without deleting existing data',()=>{
  const s=new BrowserStore(`v52-migrate-${Math.random()}`);
  s.set('agents',[{id:'data-intake-agent',name:'old',capabilities:['data.intake'],defaultActions:['READ_FILE'],status:'ACTIVE'}]);
  migrateStore(s,seed,{version:'5.2.0'});
  const a=s.get('agents',[]).find(x=>x.id==='data-intake-agent');
  assert.ok(a.capabilities.includes('model.reason'));
  assert.ok(a.defaultActions.includes('ANALYZE'));
  assert.equal(s.get('schemaVersion'),'5.2.0');
});

test('V5.2 multimodal processor stores AI-processed content and provenance',async()=>{
  const s=new BrowserStore(`v52-art-${Math.random()}`); migrateStore(s,seed,{version:'5.2.0'});
  const arts=new ArtifactStore(s); const file=new File([new Uint8Array([1,2,3,4])],'room.jpg',{type:'image/jpeg'});
  const a=await arts.ingest(file,{uploadedBy:'USR-ADMIN',workItemId:'WORK-DATA-INTAKE',domain:'FMS'});
  const model={analyzeFile:async()=>({text:'Ảnh cho thấy một phòng học với máy chiếu.',provider:'test-provider',model:'vision-test',mode:'VISION'})};
  const p=new MultimodalProcessor({artifacts:arts,model}); const out=await p.process(a.id);
  assert.equal(out.processingStatus,'AI_PROCESSED');
  assert.match(out.extractedText,/phòng học/);
  assert.equal(out.processor.provider,'test-provider');
});

test('V5.2 model gateway never pretends real multimodal processing when mock is selected',async()=>{
  const m=new ModelGatewayBox();
  const file=new File([new Uint8Array([1])],'x.png',{type:'image/png'});
  const r=await m.analyzeFile({file,artifact:{name:'x.png',mediaType:'IMAGE',mimeType:'image/png'},prompt:'Đọc ảnh'});
  assert.equal(r.provider,'mock');
  assert.equal(r.mode,'SIMULATED_MULTIMODAL');
  assert.match(r.text,/MÔ PHỎNG/);
});
