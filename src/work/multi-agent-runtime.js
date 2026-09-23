export class MultiAgentRuntime {
  constructor({store,model,agents,capabilities,audit}){ Object.assign(this,{store,model,agents,capabilities,audit}); }
  getAgent(id){ return this.agents.find(a=>a.id===id); }

  artifactContext(work){
    const artifacts=this.store.get('artifacts',[]).filter(a=>(work.artifactIds||[]).includes(a.id));
    return artifacts.map(a=>`- ${a.name} [${a.mediaType}] ${a.textPreview?`Nội dung trích: ${a.textPreview.slice(0,2000)}`:'đã ghi nhận; browser runtime chưa trích xuất nội dung nhị phân của loại tệp này'}`).join('\n');
  }
  async respondToHumanRequest({workId,request,human,userContext}){
    const items=this.store.get('workItems',[]); const work=items.find(w=>w.id===workId); if(!work) throw new Error('Không tìm thấy công việc');
    const prompt=String(request?.text||request||'').trim(); if(!prompt) throw new Error('Yêu cầu cho AI đang trống');
    const active=(work.assignments||[]).filter(a=>a.status!=='REVOKED'); if(!active.length) throw new Error('Công việc chưa được phân công AI. Hãy phân công AI và phạm vi ủy quyền trước.');
    const artifactContext=this.artifactContext(work); const outputs=[];
    for(const asg of active){
      const agent=this.verifyAssignment(work,asg);
      const result=await this.model.reason({system:`Bạn là ${agent.name}. Bạn đang phối hợp cùng con người trong Work Item và chỉ được hành động trong phạm vi đã ủy quyền. Năng lực: ${(asg.capabilities||[]).join(', ')}. Hành động: ${(asg.actions||[]).join(', ')}. Miền: ${asg.domain||work.domain||'OIS'}. Data scope: ${asg.dataScope||'*'}. Resource scope: ${asg.resourceScope||'*'}. Human checkpoint: ${asg.humanCheckpoint||'BEFORE_COMMIT'}. Không tự mở rộng quyền. Khi tài liệu chỉ có metadata mà chưa trích được nội dung, phải nói rõ giới hạn thay vì suy đoán.`,user:`Công việc: ${work.title}
Mục tiêu: ${work.purpose}
Nhiệm vụ AI đã được giao: ${asg.task}
Yêu cầu mới của con người: ${prompt}
Dữ liệu/tài liệu đính kèm:
${artifactContext||'(không có)'}
Hãy hỗ trợ trực tiếp theo yêu cầu mới, tận dụng dữ liệu đính kèm có thể đọc được, nêu rõ bằng chứng/giới hạn và phần cần con người xác nhận.`});
      const output={id:`OUT-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:'HUMAN_REQUEST',requestId:request?.id||null,assignmentId:asg.id,agentId:agent.id,text:result.text,createdAt:new Date().toISOString(),evidence:{workId,assignmentId:asg.id,domain:asg.domain||work.domain,resourceScope:asg.resourceScope,dataScope:asg.dataScope,humanCheckpoint:asg.humanCheckpoint,artifactIds:work.artifactIds||[],capabilities:asg.capabilities,actions:asg.actions,humanRequest:prompt}};
      work.outputs.unshift(output); outputs.push(output);
      const traces=this.store.get('traces',[]); traces.unshift({id:`TRACE-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,timestamp:new Date().toISOString(),workId,assignmentId:asg.id,humanOwner:work.humanOwner,executedBy:agent.id,onBehalfOf:human?.id||null,context:userContext,domain:asg.domain||work.domain,resourceScope:asg.resourceScope,dataScope:asg.dataScope,humanCheckpoint:asg.humanCheckpoint,capabilities:asg.capabilities,actions:asg.actions,model:result.model,status:'COMPLETED',event:'HUMAN_AI_COLLAB_RESPONSE',requestId:request?.id||null}); this.store.set('traces',traces.slice(0,500));
      this.audit.record({actorId:human?.id||'UNKNOWN',agent:agent.id,action:'HUMAN_AI_COLLAB_RESPONSE',resourceId:workId,assignmentId:asg.id,requestId:request?.id||null,domain:asg.domain||work.domain,resourceScope:asg.resourceScope,dataScope:asg.dataScope,capabilities:asg.capabilities,delegatedActions:asg.actions,model:result.model});
    }
    work.status='WAITING_FOR_HUMAN'; this.store.set('workItems',items); return outputs;
  }

  verifyAssignment(work,asg){
    const agent=this.getAgent(asg.agentId); if(!agent||agent.status!=='ACTIVE') throw new Error('Agent không hoạt động');
    if(asg.validUntil&&new Date(asg.validUntil).getTime()<Date.now()) throw new Error('Ủy quyền đã hết hạn');
    for(const c of asg.capabilities||[]){ if(!agent.capabilities.includes(c)) throw new Error(`Agent không có năng lực ${c}`); }
    for(const a of asg.actions||[]){ if(!agent.defaultActions.includes(a)) throw new Error(`Agent không được phép ${a}`); }
    return agent;
  }
  async runAssignment({workId,assignmentId,human,userContext}){
    const items=this.store.get('workItems',[]); const work=items.find(w=>w.id===workId); if(!work) throw new Error('Không tìm thấy công việc');
    const asg=work.assignments.find(a=>a.id===assignmentId); if(!asg) throw new Error('Không tìm thấy phân công AI');
    const agent=this.verifyAssignment(work,asg); asg.status='RUNNING'; asg.startedAt=new Date().toISOString(); this.store.set('workItems',items);
    const artifactContext=this.artifactContext(work);
    const result=await this.model.reason({system:`Bạn là ${agent.name}. Bạn đang cùng con người thực hiện một nhiệm vụ được ủy quyền. Chỉ thực hiện trong các năng lực: ${(asg.capabilities||[]).join(', ')}; hành động cho phép: ${(asg.actions||[]).join(', ')}. Miền: ${asg.domain||work.domain||'OIS'}; resource scope: ${asg.resourceScope||'*'}; data scope: ${asg.dataScope||'*'}; checkpoint: ${asg.humanCheckpoint||'BEFORE_COMMIT'}. Không tự mở rộng quyền. Phân biệt dữ kiện, bằng chứng, suy luận, khuyến nghị và quyết định.`,user:`Công việc: ${work.title}\nMục tiêu: ${work.purpose}\nNhiệm vụ được giao: ${asg.task}\nPhạm vi công việc: ${JSON.stringify(work.scope)}\nDữ liệu đính kèm:\n${artifactContext||'(không có)'}\nHãy tạo kết quả làm việc cụ thể, nêu rõ điều cần con người xác nhận.`});
    asg.status='COMPLETED'; asg.completedAt=new Date().toISOString(); asg.result={text:result.text,provider:result.provider,model:result.model};
    work.outputs.unshift({id:`OUT-${Date.now()}`,assignmentId:asg.id,agentId:agent.id,text:result.text,createdAt:new Date().toISOString(),evidence:{workId,assignmentId:asg.id,domain:asg.domain||work.domain,resourceScope:asg.resourceScope,dataScope:asg.dataScope,humanCheckpoint:asg.humanCheckpoint,artifactIds:work.artifactIds||[],capabilities:asg.capabilities,actions:asg.actions}});
    if(work.assignments.every(x=>x.status==='COMPLETED')) work.status='WAITING_FOR_HUMAN'; else work.status='IN_PROGRESS';
    this.store.set('workItems',items);
    const traces=this.store.get('traces',[]); traces.unshift({id:`TRACE-${Date.now()}`,timestamp:new Date().toISOString(),workId,assignmentId:asg.id,humanOwner:work.humanOwner,executedBy:agent.id,onBehalfOf:human?.id||null,context:userContext,domain:asg.domain||work.domain,resourceScope:asg.resourceScope,dataScope:asg.dataScope,humanCheckpoint:asg.humanCheckpoint,capabilities:asg.capabilities,actions:asg.actions,model:result.model,status:'COMPLETED'}); this.store.set('traces',traces.slice(0,500));
    this.audit.record({actorId:human?.id||'UNKNOWN',agent:agent.id,action:'AGENT_TASK_EXECUTE',resourceId:workId,assignmentId:asg.id,domain:asg.domain||work.domain,resourceScope:asg.resourceScope,dataScope:asg.dataScope,capabilities:asg.capabilities,delegatedActions:asg.actions,model:result.model});
    return asg.result;
  }
  async runReady({workId,human,userContext}){ const work=this.store.get('workItems',[]).find(w=>w.id===workId); if(!work) throw new Error('Không tìm thấy công việc'); const out=[]; for(const asg of work.assignments.filter(a=>a.status==='READY')) out.push(await this.runAssignment({workId,assignmentId:asg.id,human,userContext})); return out; }
}
