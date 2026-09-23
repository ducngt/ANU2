import {RegistryBox} from './registry-box.js';
const seed=[
 {id:'WIRE-KNOWLEDGE-EVIDENCE',from:'SBBox-Knowledge',to:'SBBox-Evidence',contract:'knowledge-record -> evidence-candidate',policy:'audited',status:'ACTIVE'},
 {id:'WIRE-EVIDENCE-CAPABILITY',from:'SBBox-Evidence',to:'SBBox-CapabilityRegistry',contract:'validated-evidence -> capability-learning',policy:'human-validation',status:'ACTIVE'},
 {id:'WIRE-ACTION-AUDIT',from:'SBBox-Decision',to:'SBBox-Audit',contract:'action -> audit-event',policy:'mandatory',status:'ACTIVE'}
];
export class WireRegistryBox extends RegistryBox{constructor(){super('anu2.wires',seed)}}
