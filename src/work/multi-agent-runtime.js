export class MultiAgentRuntime {
  constructor({store,model,agents,capabilities,audit}){ Object.assign(this,{store,model,agents,capabilities,audit}); }
  getAgent(id){ return this.agents.find(a=>a.id===id); }
  verifyAssignment(work,asg){
    const agent=this.getAgent(asg.agentId); if(!agent||agent.status!=='ACTIVE') throw new Error('Agent không hoạt động');
    for(const c of asg.capabilities||[]){ if(!agent.capabilities.includes(c)) throw new Error(`Agent không có năng lực ${c}`); }
    for(const a of asg.actions||[]){ if(!agent.defaultActions.includes(a)) throw new Error(`Agent không được phép ${a}`); }
    return agent;
  }
  async runAssignment({workId,assignmentId,human,userContext}){
    const items=this.store.get('workItems',[]); const work=items.find(w=>w.id===workId); if(!work) throw new Error('Không tìm thấy công việc');
    const asg=work.assignments.find(a=>a.id===assignmentId); if(!asg) throw new Error('Không tìm thấy phân công AI');
    const agent=this.verifyAssignment(work,asg); asg.status='RUNNING'; asg.startedAt=new Date().toISOString(); this.store.set('workItems',items);
    const result=await this.model.reason({system:`Bạn là ${agent.name}. Bạn đang cùng con người thực hiện một nhiệm vụ được ủy quyền. Chỉ thực hiện trong các năng lực: ${(asg.capabilities||[]).join(', ')}; hành động cho phép: ${(asg.actions||[]).join(', ')}. Không tự mở rộng quyền. Phân biệt dữ kiện, bằng chứng, suy luận, khuyến nghị và quyết định.`,user:`Công việc: ${work.title}\nMục tiêu: ${work.purpose}\nNhiệm vụ được giao: ${asg.task}\nPhạm vi: ${JSON.stringify(work.scope)}\nHãy tạo kết quả làm việc cụ thể, ngắn gọn, có điểm cần con người xác nhận nếu cần.`});
    asg.status='COMPLETED'; asg.completedAt=new Date().toISOString(); asg.result={text:result.text,provider:result.provider,model:result.model};
    work.outputs.unshift({id:`OUT-${Date.now()}`,assignmentId:asg.id,agentId:agent.id,text:result.text,createdAt:new Date().toISOString(),evidence:{workId,assignmentId:asg.id,capabilities:asg.capabilities,actions:asg.actions}});
    if(work.assignments.every(x=>x.status==='COMPLETED')) work.status='WAITING_FOR_HUMAN'; else work.status='IN_PROGRESS';
    this.store.set('workItems',items);
    const traces=this.store.get('traces',[]); traces.unshift({id:`TRACE-${Date.now()}`,timestamp:new Date().toISOString(),workId,assignmentId:asg.id,humanOwner:work.humanOwner,executedBy:agent.id,onBehalfOf:human?.id||null,context:userContext,capabilities:asg.capabilities,actions:asg.actions,model:result.model,status:'COMPLETED'}); this.store.set('traces',traces.slice(0,500));
    this.audit.record({actorId:human?.id||'UNKNOWN',agent:agent.id,action:'AGENT_TASK_EXECUTE',resourceId:workId,assignmentId:asg.id,capabilities:asg.capabilities,delegatedActions:asg.actions,model:result.model});
    return asg.result;
  }
  async runReady({workId,human,userContext}){ const work=this.store.get('workItems',[]).find(w=>w.id===workId); if(!work) throw new Error('Không tìm thấy công việc'); const out=[]; for(const asg of work.assignments.filter(a=>a.status==='READY')) out.push(await this.runAssignment({workId,assignmentId:asg.id,human,userContext})); return out; }
}
