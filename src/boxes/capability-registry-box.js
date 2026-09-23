import {RegistryBox} from './registry-box.js';
export const seedCapabilities=[
 {id:'knowledge.retrieve',name:'Knowledge Retrieve',version:'2.0.0',domain:'Knowledge',owner:'University',status:'ACTIVE',authority:'READ',scope:'CONTEXT',box:'SBBox-Knowledge',agents:['Knowledge Agent','Research Agent'],tools:['knowledge-tool'],evidence:'REQUIRED'},
 {id:'evidence.evaluate',name:'Evidence Evaluate',version:'2.0.0',domain:'Trust',owner:'University',status:'ACTIVE',authority:'ANALYZE',scope:'CONTEXT',box:'SBBox-Evidence',agents:['Evidence Agent','Research Agent'],tools:['evidence-tool'],evidence:'REQUIRED'},
 {id:'model.reason',name:'Model Reason',version:'2.0.0',domain:'Intelligence',owner:'University',status:'ACTIVE',authority:'REASON',scope:'CONTEXT',box:'SBBox-Model',agents:['Research Agent','Management Agent'],tools:['model-tool'],evidence:'CONTEXTUAL'},
 {id:'decision.prepare',name:'Decision Prepare',version:'2.0.0',domain:'Decision',owner:'University',status:'ACTIVE',authority:'RECOMMEND',scope:'CONTEXT',box:'SBBox-Decision',agents:['Executive Agent'],tools:['decision-tool'],evidence:'REQUIRED'}
];
export class CapabilityRegistryBox extends RegistryBox{constructor(){super('anu2.capabilities',seedCapabilities)}}
