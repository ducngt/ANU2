export class WorkService {
  constructor(store,agents){ this.store=store; this.agents=agents; }
  list(){ return this.store.get('workItems',[]); }
  get(id){ return this.list().find(x=>x.id===id); }
  save(work){ const arr=this.list(); const i=arr.findIndex(x=>x.id===work.id); if(i>=0) arr[i]=work; else arr.unshift(work); this.store.set('workItems',arr); return work; }
  create({title,purpose,humanOwner,scope,priority='MEDIUM',deadline='',expectedOutcome=''}){ const w={id:`WORK-${Date.now()}`,title,purpose,humanOwner,scope,priority,status:'NEW',deadline,expectedOutcome,assignments:[],outputs:[],createdAt:new Date().toISOString()}; return this.save(w); }
  assign(workId,{agentId,task,capabilities=[],actions=[]}){ const w=this.get(workId); if(!w) throw new Error('Work item not found'); const agent=this.agents.find(a=>a.id===agentId); if(!agent) throw new Error('Agent not found'); const delegatedCaps=capabilities.filter(c=>agent.capabilities.includes(c)); const delegatedActions=actions.filter(a=>agent.defaultActions.includes(a)); w.assignments.push({id:`ASG-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,agentId,task,capabilities:delegatedCaps,actions:delegatedActions,status:'READY',validUntil:null}); return this.save(w); }
}
