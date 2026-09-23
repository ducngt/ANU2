import test from 'node:test';
import assert from 'node:assert/strict';
import {BrowserStore} from '../src/core/store.js';
import {seed} from '../src/core/seed.js';
import {IdentityBox} from '../src/boxes/identity-box.js';
import {AuditBox} from '../src/boxes/audit-box.js';
import {ContextBox} from '../src/boxes/context-box.js';
import {PolicyBox} from '../src/boxes/policy-box.js';
import {CapabilityRegistryBox} from '../src/boxes/capability-registry-box.js';
import {KnowledgeBox} from '../src/boxes/knowledge-box.js';
import {EvidenceBox} from '../src/boxes/evidence-box.js';
import {RegistryBox} from '../src/boxes/registry-box.js';
import {ProvenanceBox} from '../src/boxes/provenance-box.js';
import {MemoryBox} from '../src/boxes/memory-box.js';
import {FailureBox} from '../src/boxes/failure-box.js';
import {ModelGatewayBox,openAIParams} from '../src/boxes/model-gateway-box.js';
import {routeTask} from '../src/agents/task-router.js';
import {AgentRuntime} from '../src/agents/agent-runtime.js';

function make(){
 const s=new BrowserStore(`test-${Math.random()}`); const audit=new AuditBox(s); const identity=new IdentityBox(s,seed); const context=new ContextBox(s,audit); const policy=new PolicyBox(); const capabilities=new CapabilityRegistryBox(s,seed); const knowledge=new KnowledgeBox(s,seed); const evidence=new EvidenceBox(); const agents=new RegistryBox(s,'agents',seed.agents); const provenance=new ProvenanceBox(); const memory=new MemoryBox(s); const failure=new FailureBox(s,audit); const model=new ModelGatewayBox(); const runtime=new AgentRuntime({store:s,capabilities,agents,policy,knowledge,evidence,model,audit,provenance,memory,failure}); return {s,audit,identity,context,policy,capabilities,runtime};
}

test('multirole context changes effective role without union',()=>{ const x=make(); const u=x.identity.authenticate('multirole','MultiRole123!'); assert.equal(x.context.active(u).role,'VICE_RECTOR'); x.context.switch(u,'RA-MULTI-3'); assert.equal(x.context.active(u).role,'RESEARCHER'); assert.equal(x.policy.canApproveInstitutional(x.context.active(u)),false); });

test('system admin is not institutional decision authority',()=>{ const x=make(); const u=x.identity.authenticate('admin','Admin123!'); assert.equal(x.policy.canSystemAdmin(x.context.active(u)),true); assert.equal(x.policy.canApproveInstitutional(x.context.active(u)),false); });

test('task router sends general fact away from institutional knowledge',()=>{ assert.equal(routeTask('MU là đội bóng nước nào?').type,'GENERAL_FACT'); assert.equal(routeTask('ANU quy định dữ liệu Sống-Sạch-Đúng-Đủ thế nào?').type,'INTERNAL_KNOWLEDGE'); });

test('general fact completes without institutional evidence and approval',async()=>{ const x=make(); const u=x.identity.authenticate('researcher','Research123!'); const r=await x.runtime.run({task:'MU là đội bóng nước nào?',user:u,context:x.context.active(u)}); assert.equal(r.route.type,'GENERAL_FACT'); assert.equal(r.evidence.length,0); assert.equal(r.status,'COMPLETED'); });

test('management recommendation requires human handoff',async()=>{ const x=make(); const u=x.identity.authenticate('executive','Executive123!'); const r=await x.runtime.run({task:'Đề xuất mở ngành AI mới cho trường và đánh giá rủi ro quản trị',user:u,context:x.context.active(u)}); assert.equal(r.route.type,'MANAGEMENT_ANALYSIS'); assert.equal(r.status,'HANDOFF_REQUIRED'); });

test('OpenAI reasoning capability resolver selects max_completion_tokens',()=>{ const p=openAIParams('o3-mini',1000); assert.equal(p.tokenParameter,'max_completion_tokens'); assert.equal(p.instructionRole,'developer'); assert.equal(p.supportsTemperature,false); });
