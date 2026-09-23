import {routeTask} from './task-router.js';
const plans={
  GENERAL_FACT:{agent:'knowledge-agent',caps:['model.reason'],tools:['model-tool'],approval:false},
  INTERNAL_KNOWLEDGE:{agent:'knowledge-agent',caps:['knowledge.retrieve','model.reason'],tools:['knowledge-tool','model-tool'],approval:false},
  RESEARCH:{agent:'research-agent',caps:['knowledge.retrieve','evidence.evaluate','model.reason','research.synthesize'],tools:['knowledge-tool','evidence-tool','model-tool'],approval:'POLICY'},
  DATA_ANALYSIS:{agent:'data-agent',caps:['data.analyze','model.reason'],tools:['data-tool','model-tool'],approval:'POLICY'},
  MANAGEMENT_ANALYSIS:{agent:'management-agent',caps:['knowledge.retrieve','evidence.evaluate','scenario.compare','risk.assess','decision.prepare','model.reason'],tools:['knowledge-tool','evidence-tool','model-tool','decision-tool'],approval:true},
  DECISION_SUPPORT:{agent:'executive-agent',caps:['knowledge.retrieve','risk.assess','decision.prepare','model.reason'],tools:['knowledge-tool','evidence-tool','model-tool','decision-tool'],approval:true},
  HELP:{agent:'help-agent',caps:['help.context','model.reason'],tools:['help-tool','model-tool'],approval:false}
};
export class AgentRuntime {
  constructor({store,capabilities,agents,policy,knowledge,evidence,model,audit,provenance,memory,failure}){ Object.assign(this,{store,capabilities,agents,policy,knowledge,evidence,model,audit,provenance,memory,failure}); if(!store.get('traces')) store.set('traces',[]); }
  traces(){ return this.store.get('traces',[]); }
  saveTrace(t){ const arr=this.traces(); arr.unshift(t); this.store.set('traces',arr.slice(0,300)); }
  async run({task,user,context}){
    const taskId=`TASK-${Date.now()}`; const route=routeTask(task);
    if(route.type==='INVALID') return {status:'FAILED',failure:this.failure.stop({taskId,reason:'EMPTY_TASK',state:{task},actorId:user.id})};
    const plan=plans[route.type]; const agent=this.agents.get(plan.agent); const policyChecks=[];
    for(const id of plan.caps){ const cap=this.capabilities.get(id); const allow=this.policy.canUseCapability(context,cap); policyChecks.push({capability:id,allow}); if(!allow){ return {status:'HANDOFF_REQUIRED',failure:this.failure.stop({taskId,reason:`CAPABILITY_DENIED:${id}`,state:{route,plan},actorId:user.id})}; } }
    let records=[]; let evaluated=[];
    if(plan.caps.includes('knowledge.retrieve')){ records=this.knowledge.search(task,context,5); evaluated=this.evidence.evaluate(records); }
    if(['INTERNAL_KNOWLEDGE','RESEARCH','MANAGEMENT_ANALYSIS','DECISION_SUPPORT'].includes(route.type) && plan.caps.includes('knowledge.retrieve') && records.length===0){
      const failure=this.failure.stop({taskId,reason:'INSUFFICIENT_EVIDENCE',state:{route,plan},actorId:user.id}); return {status:'HANDOFF_REQUIRED',route,plan,failure};
    }
    const modelResult=await this.model.reason({system:`You are ${agent?.name?.en||plan.agent}. Distinguish facts, evidence, inference, recommendation and decision. Never claim institutional authority.`,user:task});
    const handoff = plan.approval===true || (plan.approval==='POLICY' && route.type==='RESEARCH' && records.length<2);
    const result={taskId,status:handoff?'HANDOFF_REQUIRED':'COMPLETED',route,plan,agent,answer:modelResult.text,evidence:records,evidenceAssessment:evaluated,model:{provider:modelResult.provider,model:modelResult.model},policyChecks,handoff:handoff?{required:true,reason:plan.approval===true?'HUMAN_DECISION':'EVIDENCE_REVIEW'}:{required:false}};
    result.provenance=this.provenance.build({task,evidence:records,model:modelResult.model,agent:plan.agent,capabilities:plan.caps,tools:plan.tools,decision:handoff?'PENDING_HUMAN':null,outcome:result.status});
    const trace={id:`TRACE-${Date.now()}`,timestamp:new Date().toISOString(),actorId:user.id,contextId:context.id,task,...result}; this.saveTrace(trace);
    this.audit.record({actorId:user.id,contextId:context.id,role:context.role,agent:plan.agent,action:'AGENT_RUN',resourceId:taskId,capabilities:plan.caps,tools:plan.tools,model:modelResult.model,handoff:result.handoff});
    this.memory.remember({type:'AGENT_OUTCOME',taskId,route:route.type,status:result.status,capabilities:plan.caps,provenance:result.provenance});
    return result;
  }
}
