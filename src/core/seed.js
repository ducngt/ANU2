const assignment=(id,role,tier,type,scope,authority=[],dataScopes=[scope])=>({id,role,tier,scope:{type,id:scope},authority,dataScopes,validFrom:'2026-09-01',validUntil:null,status:'ACTIVE'});
export const seed = {
  users: [
    {id:'USR-ADMIN',username:'admin',password:'Admin123!',displayName:'System Administrator',status:'ACTIVE',assignments:[assignment('RA-ADMIN','SYSTEM_ADMIN',0,'SYSTEM','ANU2',['SYSTEM_ADMIN'],['SYSTEM'])]},
    {id:'USR-RECTOR',username:'rector',password:'Rector123!',displayName:'Rector Demo',status:'ACTIVE',assignments:[assignment('RA-RECTOR','RECTOR',1,'UNIVERSITY','ANU',['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],['*'])]},
    {id:'USR-EXEC',username:'executive',password:'Executive123!',displayName:'Executive Demo',status:'ACTIVE',assignments:[assignment('RA-EXEC','VICE_RECTOR',1,'UNIVERSITY','ANU',['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],['*'])]},
    {id:'USR-MANAGER',username:'manager',password:'Manager123!',displayName:'Manager Demo',status:'ACTIVE',assignments:[assignment('RA-MGR','DEPARTMENT_HEAD',2,'UNIT','FACULTY-ENG',['UNIT_RECOMMEND','UNIT_APPROVE'],['FACULTY-ENG'])]},
    {id:'USR-LECTURER',username:'lecturer',password:'Lecturer123!',displayName:'Lecturer Demo',status:'ACTIVE',assignments:[assignment('RA-LECT','LECTURER',3,'UNIT','FACULTY-ENG',['TEACHING'],['FACULTY-ENG','PUBLIC'])]},
    {id:'USR-RESEARCH',username:'researcher',password:'Research123!',displayName:'Researcher Demo',status:'ACTIVE',assignments:[assignment('RA-RES','RESEARCHER',3,'PROJECT','PROJECT-AI-2026',['RESEARCH'],['PROJECT-AI-2026','PUBLIC'])]},
    {id:'USR-STUDENT',username:'student',password:'Student123!',displayName:'Student Demo',status:'ACTIVE',assignments:[assignment('RA-STU','STUDENT',3,'PROGRAM','PROGRAM-AI',['LEARNING'],['PROGRAM-AI','PUBLIC'])]},
    {id:'USR-STAFF',username:'staff',password:'Staff123!',displayName:'Staff Demo',status:'ACTIVE',assignments:[assignment('RA-STAFF','STAFF',3,'UNIT','OFFICE-ACADEMIC',['OPERATIONS'],['OFFICE-ACADEMIC','PUBLIC'])]},
    {id:'USR-MULTI',username:'multirole',password:'MultiRole123!',displayName:'Multi-role Demo',status:'ACTIVE',assignments:[
      assignment('RA-MULTI-1','VICE_RECTOR',1,'UNIVERSITY','ANU',['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],['*']),
      assignment('RA-MULTI-2','LECTURER',3,'UNIT','FACULTY-ENG',['TEACHING'],['FACULTY-ENG','PUBLIC']),
      assignment('RA-MULTI-3','RESEARCHER',3,'PROJECT','PROJECT-AI-2026',['RESEARCH'],['PROJECT-AI-2026','PUBLIC'])
    ]}
  ],
  roles:[
    {id:'SYSTEM_ADMIN',tier:0,label:{vi:'Quản trị hệ thống',en:'System Administrator','zh-CN':'系统管理员'}},
    {id:'RECTOR',tier:1,label:{vi:'Hiệu trưởng',en:'Rector','zh-CN':'校长'}},{id:'VICE_RECTOR',tier:1,label:{vi:'Phó Hiệu trưởng',en:'Vice Rector','zh-CN':'副校长'}},
    {id:'DEPARTMENT_HEAD',tier:2,label:{vi:'Trưởng đơn vị',en:'Department Head','zh-CN':'部门负责人'}},{id:'LECTURER',tier:3,label:{vi:'Giảng viên',en:'Lecturer','zh-CN':'教师'}},
    {id:'RESEARCHER',tier:3,label:{vi:'Nhà nghiên cứu',en:'Researcher','zh-CN':'研究人员'}},{id:'STUDENT',tier:3,label:{vi:'Sinh viên',en:'Student','zh-CN':'学生'}},{id:'STAFF',tier:3,label:{vi:'Cán bộ',en:'Staff','zh-CN':'职员'}}
  ],
  capabilities:[
    {id:'knowledge.retrieve',name:'Tra cứu tri thức',authority:'READ',status:'ACTIVE',agents:['knowledge-agent','research-agent','management-agent','executive-agent']},
    {id:'evidence.evaluate',name:'Đánh giá bằng chứng',authority:'ANALYZE',status:'ACTIVE',agents:['evidence-agent','research-agent','management-agent']},
    {id:'model.reason',name:'Suy luận',authority:'REASON',status:'ACTIVE',agents:['research-agent','knowledge-agent','data-agent','management-agent','executive-agent','learning-agent']},
    {id:'research.synthesize',name:'Tổng hợp nghiên cứu',authority:'RECOMMEND',status:'ACTIVE',agents:['research-agent']},
    {id:'data.analyze',name:'Phân tích dữ liệu',authority:'ANALYZE',status:'ACTIVE',agents:['data-agent','management-agent','executive-agent']},
    {id:'scenario.compare',name:'So sánh kịch bản',authority:'RECOMMEND',status:'ACTIVE',agents:['management-agent','executive-agent']},
    {id:'risk.assess',name:'Đánh giá rủi ro',authority:'RECOMMEND',status:'ACTIVE',agents:['management-agent','executive-agent']},
    {id:'decision.prepare',name:'Chuẩn bị hồ sơ quyết định',authority:'RECOMMEND',status:'ACTIVE',agents:['management-agent','executive-agent']},
    {id:'data.intake',name:'Nhập dữ liệu',authority:'WRITE_STAGING',status:'ACTIVE',agents:['data-intake-agent']},
    {id:'data.quality',name:'Kiểm tra chất lượng dữ liệu',authority:'ANALYZE',status:'ACTIVE',agents:['data-quality-agent']},
    {id:'identity.provision',name:'Đề xuất tài khoản và quyền',authority:'RECOMMEND',status:'ACTIVE',agents:['identity-provisioning-agent']},
    {id:'asset.analyze',name:'Phân tích tài sản',authority:'ANALYZE',status:'ACTIVE',agents:['asset-data-agent']}
  ],
  agents:[
    {id:'research-agent',name:'AI Nghiên cứu',owner:'Research Office',accountableRole:'HEAD_OF_RESEARCH',capabilities:['knowledge.retrieve','evidence.evaluate','model.reason','research.synthesize'],defaultActions:['READ','ANALYZE','CREATE_DRAFT','RECOMMEND'],status:'ACTIVE'},
    {id:'knowledge-agent',name:'AI Tri thức',owner:'Library & Knowledge',accountableRole:'KNOWLEDGE_OWNER',capabilities:['knowledge.retrieve','model.reason'],defaultActions:['READ','EXPLAIN'],status:'ACTIVE'},
    {id:'evidence-agent',name:'AI Bằng chứng',owner:'Quality Office',accountableRole:'QUALITY_OWNER',capabilities:['evidence.evaluate'],defaultActions:['READ','ANALYZE'],status:'ACTIVE'},
    {id:'data-agent',name:'AI Dữ liệu',owner:'Data Office',accountableRole:'DATA_OWNER',capabilities:['data.analyze','model.reason'],defaultActions:['READ','ANALYZE','CREATE_DRAFT'],status:'ACTIVE'},
    {id:'management-agent',name:'AI Quản lý',owner:'Administration',accountableRole:'UNIT_MANAGER',capabilities:['knowledge.retrieve','evidence.evaluate','data.analyze','scenario.compare','risk.assess','decision.prepare','model.reason'],defaultActions:['READ','ANALYZE','CREATE_DRAFT','RECOMMEND'],status:'ACTIVE'},
    {id:'executive-agent',name:'AI Điều hành',owner:'Executive Office',accountableRole:'EXECUTIVE',capabilities:['knowledge.retrieve','data.analyze','scenario.compare','risk.assess','decision.prepare','model.reason'],defaultActions:['READ','ANALYZE','CREATE_DRAFT','RECOMMEND'],status:'ACTIVE'},
    {id:'learning-agent',name:'AI Đồng hành học tập',owner:'Academic Affairs',accountableRole:'ACADEMIC_OWNER',capabilities:['knowledge.retrieve','model.reason'],defaultActions:['READ','EXPLAIN','CREATE_DRAFT'],status:'ACTIVE'},
    {id:'data-intake-agent',name:'AI Nhập dữ liệu',owner:'System Administration',accountableRole:'SYSTEM_ADMIN',capabilities:['data.intake'],defaultActions:['READ_FILE','MAP_FIELDS','WRITE_STAGING'],status:'ACTIVE'},
    {id:'data-quality-agent',name:'AI Chất lượng dữ liệu',owner:'Data Office',accountableRole:'DATA_OWNER',capabilities:['data.quality'],defaultActions:['READ','ANALYZE','FLAG_ISSUE'],status:'ACTIVE'},
    {id:'identity-provisioning-agent',name:'AI Cấp danh tính',owner:'System Administration',accountableRole:'SYSTEM_ADMIN',capabilities:['identity.provision'],defaultActions:['READ','RECOMMEND_ROLE','CREATE_DRAFT'],status:'ACTIVE'},
    {id:'asset-data-agent',name:'AI Tài sản',owner:'Facilities Office',accountableRole:'ASSET_OWNER',capabilities:['asset.analyze'],defaultActions:['READ','ANALYZE','FLAG_ISSUE'],status:'ACTIVE'}
  ],
  knowledge:[
    {id:'KN-ANU-001',title:'Dữ liệu Sống-Sạch-Đúng-Đủ',text:'Dữ liệu quan trọng phải phản ánh thực tại, có nguồn gốc, chủ sở hữu, phiên bản, ngữ cảnh, mức kiểm chứng và hiệu lực.',scope:'PUBLIC',owner:'ANU',valid:true},
    {id:'KN-AUTH-001',title:'Năng lực và thẩm quyền',text:'AI có thể có năng lực nhưng chỉ được hành động trong phạm vi được ủy quyền, đúng scope và policy.',scope:'PUBLIC',owner:'ANU',valid:true}
  ],
  workItems:[
    {id:'WORK-AI-PROGRAM',title:'Đánh giá khả năng mở ngành Trí tuệ nhân tạo',purpose:'Chuẩn bị hồ sơ phân tích để lãnh đạo xem xét',humanOwner:'USR-EXEC',scope:{type:'UNIVERSITY',id:'ANU'},priority:'HIGH',status:'IN_PROGRESS',deadline:'2026-10-15',expectedOutcome:'Hồ sơ phân tích gồm nhu cầu, dữ liệu, kịch bản, rủi ro và khuyến nghị',assignments:[
      {id:'ASG-1',agentId:'research-agent',task:'Khảo sát xu hướng và nhu cầu xã hội',capabilities:['knowledge.retrieve','evidence.evaluate','research.synthesize','model.reason'],actions:['READ','ANALYZE','CREATE_DRAFT','RECOMMEND'],status:'READY'},
      {id:'ASG-2',agentId:'data-agent',task:'Phân tích dữ liệu tuyển sinh và nguồn lực',capabilities:['data.analyze','model.reason'],actions:['READ','ANALYZE','CREATE_DRAFT'],status:'READY'},
      {id:'ASG-3',agentId:'management-agent',task:'So sánh kịch bản và đánh giá rủi ro',capabilities:['scenario.compare','risk.assess','decision.prepare','model.reason'],actions:['READ','ANALYZE','CREATE_DRAFT','RECOMMEND'],status:'WAITING'}
    ],outputs:[],createdAt:'2026-09-24T00:00:00Z'}
  ],
  organizations:[
    {id:'ANU',code:'ANU',name:'Trường Đại học',type:'UNIVERSITY',parentId:'',mission:'Quản trị và phát triển toàn trường',functions:['Định hướng chiến lược','Đào tạo','Nghiên cứu','Phục vụ xã hội'],responsibilities:['Xác lập mục tiêu và chính sách','Phân bổ nguồn lực','Giám sát kết quả'],managerRole:'RECTOR',status:'ACTIVE'},
    {id:'BOARD',code:'BOARD',name:'Ban Giám hiệu',type:'EXECUTIVE_BOARD',parentId:'ANU',mission:'Điều hành toàn trường',functions:['Điều hành chiến lược','Ra quyết định theo thẩm quyền','Điều phối liên đơn vị'],responsibilities:['Theo dõi toàn bộ công việc và dữ liệu','Phê duyệt trong phạm vi thẩm quyền','Chịu trách nhiệm kết quả toàn trường'],managerRole:'RECTOR',status:'ACTIVE'},
    {id:'FACULTY-ENG',code:'FACULTY-ENG',name:'Khoa Kỹ thuật',type:'FACULTY',parentId:'ANU',mission:'Đào tạo và nghiên cứu lĩnh vực kỹ thuật',functions:['Đào tạo','Nghiên cứu','Quản lý người học'],responsibilities:['Tổ chức chương trình đào tạo','Quản lý giảng viên','Triển khai nghiên cứu'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'},
    {id:'OFFICE-ACADEMIC',code:'OFFICE-ACADEMIC',name:'Phòng Đào tạo',type:'OFFICE',parentId:'ANU',mission:'Quản lý hoạt động đào tạo',functions:['Kế hoạch đào tạo','Quản lý chương trình','Quản lý dữ liệu đào tạo'],responsibilities:['Bảo đảm lịch học và chương trình','Theo dõi dữ liệu học vụ'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'}
  ],
  personnel:[
    {id:'PER-001',employeeCode:'CB001',fullName:'Nguyễn Văn A',email:'nva@anu.edu.vn',unit:'BOARD',position:'Phó Hiệu trưởng',status:'ACTIVE',source:'seed'}
  ],
  students:[
    {id:'STU-001',studentCode:'SV20260001',fullName:'Lê Minh',email:'minh@anu.edu.vn',program:'PROGRAM-AI',faculty:'FACULTY-ENG',cohort:'2026',status:'ACTIVE',source:'seed'}
  ],
  facilities:[
    {id:'BLD-A1',type:'BUILDING',name:'Tòa nhà A1',campus:'CAMPUS-A',grossArea:5200,usableArea:4100,floors:5,status:'ACTIVE'},
    {id:'ROOM-A101',type:'ROOM',name:'Phòng A101',buildingId:'BLD-A1',floor:1,area:72,capacity:60,function:'CLASSROOM',status:'ACTIVE'}
  ],
  assets:[{id:'AST-001',assetCode:'GPU-001',name:'GPU Server',category:'COMPUTE',location:'ROOM-A101',ownerUnit:'FACULTY-ENG',condition:'GOOD',status:'ACTIVE'}],
  inventory:[{id:'INV-001',itemCode:'VT-001',name:'Cáp mạng Cat6',category:'NETWORK',unit:'cuộn',quantityOnHand:25,minimumLevel:10,warehouse:'WH-A',status:'ACTIVE'}],
  importBatches:[], provisioningQueue:[], audit:[], traces:[], memory:[], failures:[]
};
