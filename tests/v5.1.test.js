import test from 'node:test';
import assert from 'node:assert/strict';
import {BrowserStore} from '../src/core/store.js';
import {seed} from '../src/core/seed.js';
import {migrateStore} from '../src/core/migrate.js';
import {ArtifactStore} from '../src/artifacts/artifact-store.js';
import {WorkService} from '../src/work/work-service.js';
import {MultiAgentRuntime} from '../src/work/multi-agent-runtime.js';
import {AuditBox} from '../src/boxes/audit-box.js';
import {speechSupported,SpeechInputService} from '../src/input/speech-input-service.js';

test('V5.1 detects browser speech recognition support through standard or webkit API',()=>{
  assert.equal(speechSupported({SpeechRecognition:class {}}),true);
  assert.equal(speechSupported({webkitSpeechRecognition:class {}}),true);
  assert.equal(speechSupported({}),false);
});

test('V5.1 speech service emits final transcript',()=>{
  let instance;
  class FakeRecognition {
    constructor(){instance=this; this.lang='';}
    start(){this.onstart?.();}
    stop(){this.onend?.();}
  }
  const svc=new SpeechInputService({scope:{SpeechRecognition:FakeRecognition},lang:'vi-VN'});
  let final=''; let status='';
  svc.start({onFinal:x=>final=x,onStatus:x=>status=x});
  assert.equal(status,'LISTENING');
  instance.onresult({resultIndex:0,results:[Object.assign([{transcript:'Phân tích tài liệu này'}],{isFinal:true})]});
  assert.equal(final,'Phân tích tài liệu này');
  svc.stop(); assert.equal(status,'STOPPED');
});

test('V5.1 saves spoken or typed request as a provenance artifact',()=>{
  const s=new BrowserStore(`v51-art-${Math.random()}`); migrateStore(s,seed,{version:'5.1.0'});
  const a=new ArtifactStore(s);
  const out=a.ingestText('Hãy tóm tắt tài liệu',{uploadedBy:'USR-ADMIN',workItemId:'WORK-SYS-GOV',domain:'OIS',source:'VOICE_TRANSCRIPT'});
  assert.equal(out.mediaType,'TEXT');
  assert.equal(out.source,'VOICE_TRANSCRIPT');
  assert.match(out.textPreview,/tóm tắt/);
});

test('V5.1 Human-AI request uses delegated agents and attached text artifacts',async()=>{
  const s=new BrowserStore(`v51-work-${Math.random()}`); migrateStore(s,seed,{version:'5.1.0'});
  const ws=new WorkService(s,s.get('agents',[]));
  const w=ws.create({title:'Rà soát báo cáo',purpose:'Tóm tắt và đề xuất',humanOwner:'USR-ADMIN',scope:{type:'SYSTEM',id:'ANU2'},domain:'OIS'});
  const ag=s.get('agents',[]).find(x=>x.id==='system-governance-agent');
  ws.assign(w.id,{agentId:ag.id,task:'Phân tích tài liệu',capabilities:ag.capabilities,actions:ag.defaultActions,domain:'OIS',resourceScope:'SYSTEM',dataScope:'*',humanCheckpoint:'BEFORE_CHANGE',delegatedBy:'USR-ADMIN'});
  const art=new ArtifactStore(s); const a=art.ingestText('Báo cáo có ba vấn đề dữ liệu.',{uploadedBy:'USR-ADMIN',workItemId:w.id,domain:'OIS'}); ws.attachArtifact(w.id,a.id);
  const req=ws.addRequest(w.id,{text:'Hãy tóm tắt và đề xuất 2 việc cần làm',source:'VOICE',createdBy:'USR-ADMIN'});
  let received='';
  const model={reason:async({user})=>{received=user; return {text:'Kết quả AI',provider:'test',model:'test-model'};}};
  const runtime=new MultiAgentRuntime({store:s,model,agents:s.get('agents',[]),capabilities:s.get('capabilities',[]),audit:new AuditBox(s)});
  const out=await runtime.respondToHumanRequest({workId:w.id,request:req,human:{id:'USR-ADMIN'},userContext:{id:'CTX',role:'SYSTEM_ADMIN'}});
  assert.equal(out.length,1);
  assert.match(received,/Báo cáo có ba vấn đề dữ liệu/);
  assert.match(received,/tóm tắt và đề xuất 2 việc/);
  assert.equal(ws.get(w.id).outputs[0].type,'HUMAN_REQUEST');
});
