export class DelegationService{
  constructor(store,agents){this.store=store;this.agents=agents;}
  validate(agentId,d={}){
    const a=this.agents.find(x=>x.id===agentId); if(!a||a.status!=='ACTIVE') throw new Error('AGENT_NOT_ACTIVE');
    const caps=(d.capabilities||[]).filter(x=>a.capabilities.includes(x)); const actions=(d.actions||[]).filter(x=>a.defaultActions.includes(x));
    const rejectedCapabilities=(d.capabilities||[]).filter(x=>!caps.includes(x)); const rejectedActions=(d.actions||[]).filter(x=>!actions.includes(x));
    if(d.validUntil&&new Date(d.validUntil).getTime()<Date.now()) throw new Error('DELEGATION_EXPIRED');
    return {...d,capabilities:caps,actions,rejectedCapabilities,rejectedActions};
  }
  assignment({agentId,task,capabilities,actions,domain='OIS',resourceScope='*',dataScope='*',validUntil=null,humanCheckpoint='BEFORE_COMMIT',delegatedBy}){
    const d=this.validate(agentId,{capabilities,actions,domain,resourceScope,dataScope,validUntil,humanCheckpoint,delegatedBy});
    return {id:`ASG-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,agentId,task,status:'READY',...d};
  }
}
