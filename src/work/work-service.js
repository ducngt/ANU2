import {DelegationService} from './delegation-service.js';
export class WorkService {
  constructor(store,agents){ this.store=store; this.agents=agents; this.delegation=new DelegationService(store,agents); }
  list(){ return this.store.get('workItems',[]); }
  get(id){ return this.list().find(x=>x.id===id); }
  save(work){ const arr=this.list(); const i=arr.findIndex(x=>x.id===work.id); if(i>=0) arr[i]=work; else arr.unshift(work); this.store.set('workItems',arr); return work; }
  create({title,purpose,humanOwner,scope,domain='OIS',priority='MEDIUM',deadline='',expectedOutcome=''}){ const w={id:`WORK-${Date.now()}`,title,purpose,humanOwner,scope,domain,priority,status:'NEW',deadline,expectedOutcome,assignments:[],outputs:[],artifactIds:[],requests:[],createdAt:new Date().toISOString()}; return this.save(w); }
  assign(workId,{agentId,task,capabilities=[],actions=[],domain=null,resourceScope='*',dataScope='*',validUntil=null,humanCheckpoint='BEFORE_COMMIT',delegatedBy=null}){ const w=this.get(workId); if(!w) throw new Error('Work item not found'); const asg=this.delegation.assignment({agentId,task,capabilities,actions,domain:domain||w.domain||'OIS',resourceScope,dataScope,validUntil,humanCheckpoint,delegatedBy}); w.assignments.push(asg); if(w.status==='NEW')w.status='IN_PROGRESS'; return this.save(w); }
  attachArtifact(workId,artifactId){const w=this.get(workId);if(!w)throw new Error('Work item not found');w.artifactIds=[...new Set([...(w.artifactIds||[]),artifactId])];return this.save(w);}
  addRequest(workId,{text,source='TEXT',createdBy=null,artifactId=null}={}){ const w=this.get(workId); if(!w) throw new Error('Work item not found'); const value=String(text||'').trim(); if(!value) throw new Error('Request text required'); const req={id:`REQ-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,text:value,source,createdBy,artifactId,createdAt:new Date().toISOString()}; w.requests=w.requests||[]; w.requests.unshift(req); if(w.status==='NEW')w.status='IN_PROGRESS'; this.save(w); return req; }
}
