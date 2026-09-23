export const seed = {
  users: [
    {id:'USR-ADMIN',username:'admin',password:'Admin123!',displayName:'System Administrator',status:'ACTIVE',assignments:[{id:'RA-ADMIN',role:'SYSTEM_ADMIN',tier:0,scope:{type:'SYSTEM',id:'ANU2'},authority:['SYSTEM_ADMIN'],dataScopes:['SYSTEM'],validFrom:'2026-09-01',validUntil:null}]},
    {id:'USR-EXEC',username:'executive',password:'Executive123!',displayName:'Executive Demo',status:'ACTIVE',assignments:[{id:'RA-EXEC',role:'VICE_RECTOR',tier:1,scope:{type:'UNIVERSITY',id:'ANU'},authority:['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],dataScopes:['UNIVERSITY'],validFrom:'2026-09-01',validUntil:null}]},
    {id:'USR-MANAGER',username:'manager',password:'Manager123!',displayName:'Manager Demo',status:'ACTIVE',assignments:[{id:'RA-MGR',role:'DEPARTMENT_HEAD',tier:2,scope:{type:'UNIT',id:'FACULTY-ENG'},authority:['UNIT_RECOMMEND','UNIT_APPROVE'],dataScopes:['FACULTY-ENG'],validFrom:'2026-09-01',validUntil:null}]},
    {id:'USR-RESEARCH',username:'researcher',password:'Research123!',displayName:'Researcher Demo',status:'ACTIVE',assignments:[{id:'RA-RES',role:'RESEARCHER',tier:3,scope:{type:'PROJECT',id:'PROJECT-AI-2026'},authority:['RESEARCH'],dataScopes:['PROJECT-AI-2026','PUBLIC'],validFrom:'2026-09-01',validUntil:null}]},
    {id:'USR-MULTI',username:'multirole',password:'MultiRole123!',displayName:'Multi-role Demo',status:'ACTIVE',assignments:[
      {id:'RA-MULTI-1',role:'VICE_RECTOR',tier:1,scope:{type:'UNIVERSITY',id:'ANU'},authority:['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],dataScopes:['UNIVERSITY'],validFrom:'2026-09-01',validUntil:null},
      {id:'RA-MULTI-2',role:'LECTURER',tier:3,scope:{type:'UNIT',id:'FACULTY-ENG'},authority:['TEACHING'],dataScopes:['FACULTY-ENG','PUBLIC'],validFrom:'2026-09-01',validUntil:null},
      {id:'RA-MULTI-3',role:'RESEARCHER',tier:3,scope:{type:'PROJECT',id:'PROJECT-AI-2026'},authority:['RESEARCH'],dataScopes:['PROJECT-AI-2026','PUBLIC'],validFrom:'2026-09-01',validUntil:null}
    ]}
  ],
  roles: [
    {id:'SYSTEM_ADMIN',tier:0,label:{vi:'Quản trị hệ thống',en:'System Administrator'}},
    {id:'RECTOR',tier:1,label:{vi:'Hiệu trưởng',en:'Rector'}},
    {id:'VICE_RECTOR',tier:1,label:{vi:'Phó Hiệu trưởng',en:'Vice Rector'}},
    {id:'DEPARTMENT_HEAD',tier:2,label:{vi:'Trưởng đơn vị',en:'Department Head'}},
    {id:'LECTURER',tier:3,label:{vi:'Giảng viên',en:'Lecturer'}},
    {id:'RESEARCHER',tier:3,label:{vi:'Nhà nghiên cứu',en:'Researcher'}},
    {id:'STUDENT',tier:3,label:{vi:'Sinh viên',en:'Student'}},
    {id:'STAFF',tier:3,label:{vi:'Cán bộ',en:'Staff'}}
  ],
  capabilities: [
    {id:'knowledge.retrieve',name:'Knowledge Retrieve',version:'2.0.0',domain:'Knowledge',box:'SBBox-Knowledge',authority:'READ',scope:'CONTEXT',status:'ACTIVE',agents:['knowledge-agent','research-agent','management-agent','executive-agent'],tools:['knowledge-tool'],evidence:'PROVENANCE_REQUIRED'},
    {id:'evidence.evaluate',name:'Evidence Evaluate',version:'2.0.0',domain:'Trust',box:'SBBox-Evidence',authority:'ANALYZE',scope:'CONTEXT',status:'ACTIVE',agents:['evidence-agent','research-agent','management-agent'],tools:['evidence-tool'],evidence:'REQUIRED'},
    {id:'model.reason',name:'Model Reason',version:'2.0.0',domain:'Intelligence',box:'SBBox-ModelGateway',authority:'REASON',scope:'CONTEXT',status:'ACTIVE',agents:['research-agent','knowledge-agent','data-agent','management-agent','executive-agent','help-agent'],tools:['model-tool'],evidence:'TRACE_REQUIRED'},
    {id:'research.synthesize',name:'Research Synthesize',version:'2.0.0',domain:'Research',box:'SBBox-Research',authority:'RECOMMEND',scope:'PROJECT',status:'ACTIVE',agents:['research-agent'],tools:['model-tool','evidence-tool'],evidence:'REQUIRED'},
    {id:'data.analyze',name:'Data Analyze',version:'2.0.0',domain:'Data',box:'SBBox-DataTrust',authority:'ANALYZE',scope:'CONTEXT',status:'ACTIVE',agents:['data-agent','management-agent','executive-agent'],tools:['data-tool'],evidence:'REQUIRED'},
    {id:'scenario.compare',name:'Scenario Compare',version:'2.0.0',domain:'Management',box:'SBBox-Reasoning',authority:'RECOMMEND',scope:'UNIT',status:'ACTIVE',agents:['management-agent','executive-agent'],tools:['model-tool'],evidence:'REQUIRED'},
    {id:'risk.assess',name:'Risk Assess',version:'2.0.0',domain:'Management',box:'SBBox-Risk',authority:'RECOMMEND',scope:'CONTEXT',status:'ACTIVE',agents:['management-agent','executive-agent'],tools:['model-tool','evidence-tool'],evidence:'REQUIRED'},
    {id:'decision.prepare',name:'Decision Prepare',version:'2.0.0',domain:'Decision',box:'SBBox-Decision',authority:'RECOMMEND',scope:'CONTEXT',status:'ACTIVE',agents:['management-agent','executive-agent'],tools:['decision-tool'],evidence:'HUMAN_APPROVAL_REQUIRED'},
    {id:'help.context',name:'Context Help',version:'2.0.0',domain:'Help',box:'SBBox-Help',authority:'READ',scope:'UI_CONTEXT',status:'ACTIVE',agents:['help-agent'],tools:['help-tool'],evidence:'NONE'}
  ],
  agents: [
    {id:'research-agent',name:{vi:'Agent Nghiên cứu',en:'Research Agent'},purpose:'Evidence-based research assistance',capabilities:['knowledge.retrieve','evidence.evaluate','model.reason','research.synthesize'],authority:{canRecommend:true,canApprove:false,canDecide:false},scopes:['PROJECT','PUBLIC'],handoff:['LOW_CONFIDENCE','INSUFFICIENT_EVIDENCE','AUTHORITY_EXCEEDED']},
    {id:'knowledge-agent',name:{vi:'Agent Tri thức',en:'Knowledge Agent'},purpose:'Institutional knowledge explanation',capabilities:['knowledge.retrieve','model.reason'],authority:{canRecommend:false,canApprove:false,canDecide:false},scopes:['CONTEXT'],handoff:['INSUFFICIENT_EVIDENCE']},
    {id:'evidence-agent',name:{vi:'Agent Bằng chứng',en:'Evidence Agent'},purpose:'Evidence quality and provenance',capabilities:['evidence.evaluate'],authority:{canRecommend:false,canApprove:false,canDecide:false},scopes:['CONTEXT'],handoff:['INSUFFICIENT_EVIDENCE']},
    {id:'data-agent',name:{vi:'Agent Dữ liệu',en:'Data Agent'},purpose:'Scope-aware analysis',capabilities:['data.analyze','model.reason'],authority:{canRecommend:true,canApprove:false,canDecide:false},scopes:['CONTEXT'],handoff:['LOW_CONFIDENCE']},
    {id:'management-agent',name:{vi:'Agent Quản trị',en:'Management Agent'},purpose:'Management analysis and recommendation',capabilities:['knowledge.retrieve','evidence.evaluate','data.analyze','scenario.compare','risk.assess','decision.prepare','model.reason'],authority:{canRecommend:true,canApprove:false,canDecide:false},scopes:['UNIT','UNIVERSITY'],handoff:['HUMAN_REVIEW','AUTHORITY_EXCEEDED']},
    {id:'executive-agent',name:{vi:'Agent Điều hành',en:'Executive Agent'},purpose:'Executive decision support',capabilities:['knowledge.retrieve','data.analyze','scenario.compare','risk.assess','decision.prepare','model.reason'],authority:{canRecommend:true,canApprove:false,canDecide:false},scopes:['UNIVERSITY'],handoff:['HUMAN_DECISION']},
    {id:'help-agent',name:{vi:'Agent Trợ giúp',en:'Help Agent'},purpose:'Explain UI/context without business actions',capabilities:['help.context','model.reason'],authority:{canRecommend:false,canApprove:false,canDecide:false},scopes:['UI_CONTEXT'],handoff:[]}
  ],
  tools: [
    {id:'knowledge-tool',name:'Knowledge Tool',status:'ACTIVE'}, {id:'evidence-tool',name:'Evidence Tool',status:'ACTIVE'},
    {id:'data-tool',name:'Data Tool',status:'ACTIVE'}, {id:'model-tool',name:'Model Tool',status:'ACTIVE'},
    {id:'decision-tool',name:'Decision Tool',status:'ACTIVE'}, {id:'help-tool',name:'Help Tool',status:'ACTIVE'}
  ],
  wires: [
    {id:'WIRE-CONTEXT-POLICY',from:'SBBox-Context',to:'SBBox-Policy',contract:'AuthorizationContext/v2',policy:'DENY_OVERRIDES_ALLOW',status:'ACTIVE'},
    {id:'WIRE-KNOWLEDGE-EVIDENCE',from:'SBBox-Knowledge',to:'SBBox-Evidence',contract:'EvidenceBundle/v2',policy:'PROVENANCE_REQUIRED',status:'ACTIVE'},
    {id:'WIRE-CAPABILITY-AGENT',from:'SBBox-CapabilityRegistry',to:'AgentRuntime',contract:'CapabilitySelection/v2',policy:'AUTHORITY_CHECK',status:'ACTIVE'},
    {id:'WIRE-ACTION-AUDIT',from:'AgentRuntime',to:'SBBox-Audit',contract:'AuditEvent/v2',policy:'ALWAYS',status:'ACTIVE'},
    {id:'WIRE-RESULT-MEMORY',from:'AgentRuntime',to:'SBBox-UniversityMemory',contract:'LearningRecord/v2',policy:'NO_SECRET',status:'ACTIVE'}
  ],
  knowledge: [
    {id:'KN-ANU-001',title:'ANU dữ liệu Sống-Sạch-Đúng-Đủ',text:'Dữ liệu của ANU phải phản ánh thực tại, có nguồn gốc, chủ sở hữu, phiên bản, ngữ cảnh, mức kiểm chứng và hiệu lực; dữ liệu quan trọng phải có thể tin cậy và kiểm chứng.',scope:'PUBLIC',classification:'INTERNAL',owner:'ANU',provenance:{source:'AI-Native University Manifesto',version:'2026-09'},valid:true},
    {id:'KN-SBBS-001',title:'Bốn thành phần SBBS',text:'SBBS tổ chức phần mềm bằng Smart Boxes, Smart Wires, Assemblies và Components. Smart Box đóng gói năng lực; Smart Wire kết nối qua contract; Assembly điều phối; Component biểu diễn tương tác.',scope:'PUBLIC',classification:'PUBLIC',owner:'ANU',provenance:{source:'SBBS Manifesto',version:'2026-09'},valid:true},
    {id:'KN-AUTH-001',title:'Capability không đồng nghĩa Authority',text:'Agent có thể có capability nhưng không vì thế mà có thẩm quyền thực hiện mọi hành động. Authority, scope, delegation và policy phải được kiểm tra độc lập.',scope:'PUBLIC',classification:'PUBLIC',owner:'ANU',provenance:{source:'AI-Native University Manifesto',version:'2026-09'},valid:true}
  ],
  decisions: [], audit: [], traces: [], memory: [], failures: []
};
