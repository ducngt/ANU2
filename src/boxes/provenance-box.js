export class ProvenanceBox {
  build({task,evidence=[],model,agent,capabilities=[],tools=[],decision=null,humanApproval=null,outcome=null}){ return {claim:task,data:evidence.map(e=>e.recordId||e.id),model:model||'mock',prompt:'USER_TASK',tools,agent,capabilities,decision,humanApproval,outcome}; }
}
