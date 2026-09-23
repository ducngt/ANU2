const assignment=(id,role,tier,type,scope,authority=[],dataScopes=[scope])=>({id,role,tier,scope:{type,id:scope},authority,dataScopes,validFrom:'2026-09-01',validUntil:null,status:'ACTIVE'});
export const seed = {
  users: [
    {id:'USR-ADMIN',username:'admin',password:'Admin123!',displayName:'System Administrator',email:'admin@anu.edu.vn',phone:'+84900000001',status:'ACTIVE',assignments:[assignment('RA-ADMIN','SYSTEM_ADMIN',0,'SYSTEM','ANU2',['SYSTEM_ADMIN'],['SYSTEM'])]},
    {id:'USR-RECTOR',username:'rector',password:'Rector123!',displayName:'Rector Demo',email:'rector@anu.edu.vn',phone:'+84900000002',status:'ACTIVE',assignments:[assignment('RA-RECTOR','RECTOR',1,'UNIVERSITY','ANU',['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],['*'])]},
    {id:'USR-EXEC',username:'executive',password:'Executive123!',displayName:'Executive Demo',email:'vice.rector@anu.edu.vn',phone:'+84900000003',status:'ACTIVE',assignments:[assignment('RA-EXEC','VICE_RECTOR',1,'UNIVERSITY','ANU',['INSTITUTIONAL_RECOMMEND','INSTITUTIONAL_APPROVE'],['*'])]},
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
    {id:'model.reason',name:'Suy luận',authority:'REASON',status:'ACTIVE',agents:['research-agent','knowledge-agent','data-agent','management-agent','executive-agent','learning-agent','data-quality-agent','access-governance-agent','system-governance-agent']},
    {id:'research.synthesize',name:'Tổng hợp nghiên cứu',authority:'RECOMMEND',status:'ACTIVE',agents:['research-agent']},
    {id:'data.analyze',name:'Phân tích dữ liệu',authority:'ANALYZE',status:'ACTIVE',agents:['data-agent','management-agent','executive-agent']},
    {id:'scenario.compare',name:'So sánh kịch bản',authority:'RECOMMEND',status:'ACTIVE',agents:['management-agent','executive-agent']},
    {id:'risk.assess',name:'Đánh giá rủi ro',authority:'RECOMMEND',status:'ACTIVE',agents:['management-agent','executive-agent']},
    {id:'decision.prepare',name:'Chuẩn bị hồ sơ quyết định',authority:'RECOMMEND',status:'ACTIVE',agents:['management-agent','executive-agent']},
    {id:'data.intake',name:'Nhập dữ liệu',authority:'WRITE_STAGING',status:'ACTIVE',agents:['data-intake-agent']},
    {id:'data.quality',name:'Kiểm tra chất lượng dữ liệu',authority:'ANALYZE',status:'ACTIVE',agents:['data-quality-agent']},
    {id:'identity.provision',name:'Đề xuất tài khoản và quyền',authority:'RECOMMEND',status:'ACTIVE',agents:['identity-provisioning-agent']},
    {id:'asset.analyze',name:'Phân tích tài sản',authority:'ANALYZE',status:'ACTIVE',agents:['asset-data-agent']},
    {id:'access.review',name:'Rà soát người dùng và quyền',authority:'RECOMMEND',status:'ACTIVE',agents:['access-governance-agent']},
    {id:'system.governance',name:'Phân tích vận hành hệ thống',authority:'RECOMMEND',status:'ACTIVE',agents:['system-governance-agent']}
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
    {id:'data-quality-agent',name:'AI Chất lượng dữ liệu',owner:'Data Office',accountableRole:'DATA_OWNER',capabilities:['data.quality','model.reason'],defaultActions:['READ','ANALYZE','FLAG_ISSUE'],status:'ACTIVE'},
    {id:'identity-provisioning-agent',name:'AI Cấp danh tính',owner:'System Administration',accountableRole:'SYSTEM_ADMIN',capabilities:['identity.provision'],defaultActions:['READ','RECOMMEND_ROLE','CREATE_DRAFT'],status:'ACTIVE'},
    {id:'asset-data-agent',name:'AI Tài sản',owner:'Facilities Office',accountableRole:'ASSET_OWNER',capabilities:['asset.analyze'],defaultActions:['READ','ANALYZE','FLAG_ISSUE'],status:'ACTIVE'},
    {id:'access-governance-agent',name:'AI Quản trị truy cập',owner:'System Administration',accountableRole:'SYSTEM_ADMIN',capabilities:['access.review','data.quality','model.reason'],defaultActions:['READ','ANALYZE','FLAG_ISSUE','RECOMMEND'],status:'ACTIVE'},
    {id:'system-governance-agent',name:'AI Quản trị hệ thống',owner:'System Administration',accountableRole:'SYSTEM_ADMIN',capabilities:['system.governance','data.quality','model.reason'],defaultActions:['READ','ANALYZE','CREATE_DRAFT','RECOMMEND'],status:'ACTIVE'}
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
    ],outputs:[],createdAt:'2026-09-24T00:00:00Z'},
    {id:'WORK-SYS-GOV',title:'Rà soát dữ liệu, tài khoản và quyền hệ thống',purpose:'Quản trị hệ thống phối hợp AI để phát hiện dữ liệu thiếu, tài khoản bất thường và quyền cần rà soát',humanOwner:'USR-ADMIN',scope:{type:'SYSTEM',id:'ANU2'},domain:'OIS',priority:'HIGH',status:'IN_PROGRESS',deadline:'2026-10-01',expectedOutcome:'Danh sách vấn đề và khuyến nghị để quản trị viên xác nhận',artifactIds:[],assignments:[
      {id:'ASG-SYS-1',agentId:'data-quality-agent',task:'Rà soát chất lượng dữ liệu nền tảng',domain:'OIS',resourceScope:'UNIVERSITY_DATA',dataScope:'*',validUntil:null,humanCheckpoint:'BEFORE_CHANGE',delegatedBy:'USR-ADMIN',capabilities:['data.quality','model.reason'],actions:['READ','ANALYZE','FLAG_ISSUE'],status:'READY'},
      {id:'ASG-SYS-2',agentId:'access-governance-agent',task:'Rà soát tài khoản, vai trò và phạm vi quyền',domain:'PIS',resourceScope:'IDENTITY_AND_ACCESS',dataScope:'users,roles,assignments',validUntil:null,humanCheckpoint:'BEFORE_CHANGE',delegatedBy:'USR-ADMIN',capabilities:['access.review','data.quality','model.reason'],actions:['READ','ANALYZE','FLAG_ISSUE','RECOMMEND'],status:'READY'}
    ],outputs:[],createdAt:'2026-09-24T02:30:00Z'}
  ],
  organizations:[
    {id:'ANU',code:'ANU',name:'Trường Đại học',type:'UNIVERSITY',parentId:'',mission:'Quản trị và phát triển toàn trường',functions:['Định hướng chiến lược','Đào tạo','Nghiên cứu','Phục vụ xã hội'],responsibilities:['Xác lập mục tiêu và chính sách','Phân bổ nguồn lực','Giám sát kết quả'],managerRole:'RECTOR',status:'ACTIVE'},
    {id:'BOARD',code:'BOARD',name:'Ban Giám hiệu',type:'EXECUTIVE_BOARD',parentId:'ANU',mission:'Điều hành toàn trường',functions:['Điều hành chiến lược','Ra quyết định theo thẩm quyền','Điều phối liên đơn vị'],responsibilities:['Theo dõi toàn bộ công việc và dữ liệu','Phê duyệt trong phạm vi thẩm quyền','Chịu trách nhiệm kết quả toàn trường'],managerRole:'RECTOR',status:'ACTIVE'},
    {id:'FACULTY-ENG',code:'FACULTY-ENG',name:'Khoa Kỹ thuật',type:'FACULTY',parentId:'ANU',mission:'Đào tạo và nghiên cứu lĩnh vực kỹ thuật',functions:['Đào tạo','Nghiên cứu','Quản lý người học'],responsibilities:['Tổ chức chương trình đào tạo','Quản lý giảng viên','Triển khai nghiên cứu'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'},
    {id:'OFFICE-ACADEMIC',code:'OFFICE-ACADEMIC',name:'Phòng Đào tạo',type:'OFFICE',parentId:'ANU',mission:'Quản lý hoạt động đào tạo',functions:['Kế hoạch đào tạo','Quản lý chương trình','Quản lý dữ liệu đào tạo'],responsibilities:['Bảo đảm lịch học và chương trình','Theo dõi dữ liệu học vụ'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'},
    {id:'OFFICE-HR',code:'OFFICE-HR',name:'Phòng Tổ chức - Nhân sự',type:'OFFICE',parentId:'ANU',mission:'Quản trị nguồn nhân lực',functions:['Tổ chức bộ máy','Nhân sự','Phát triển đội ngũ'],responsibilities:['Quản lý hồ sơ nhân sự','Tham mưu cơ cấu tổ chức','Theo dõi vị trí việc làm'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'},
    {id:'OFFICE-FINANCE',code:'OFFICE-FINANCE',name:'Phòng Tài chính',type:'OFFICE',parentId:'ANU',mission:'Quản trị tài chính',functions:['Ngân sách','Kế toán','Phân tích tài chính'],responsibilities:['Lập và theo dõi ngân sách','Báo cáo tài chính','Kiểm soát chi'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'},
    {id:'OFFICE-FACILITIES',code:'OFFICE-FACILITIES',name:'Phòng Cơ sở vật chất',type:'OFFICE',parentId:'ANU',mission:'Quản trị hạ tầng và tài sản',functions:['Cơ sở vật chất','Tài sản','Bảo trì'],responsibilities:['Quản lý không gian','Quản lý tài sản','Lập kế hoạch bảo trì'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'},
    {id:'OFFICE-RESEARCH',code:'OFFICE-RESEARCH',name:'Phòng Khoa học và Công nghệ',type:'OFFICE',parentId:'ANU',mission:'Quản lý nghiên cứu và đổi mới',functions:['Nghiên cứu','Đổi mới sáng tạo','Chuyển giao'],responsibilities:['Quản lý đề tài','Theo dõi kết quả nghiên cứu','Hỗ trợ chuyển giao'],managerRole:'DEPARTMENT_HEAD',status:'ACTIVE'}
  ],
  personnel:[
    {id:'PER-001',employeeCode:'CB001',fullName:'Nguyễn Văn A',email:'nva@anu.edu.vn',unit:'BOARD',position:'Phó Hiệu trưởng',status:'ACTIVE',source:'seed-demo'},
    {id:'PER-002',employeeCode:'CB002',fullName:'Trần Minh B',email:'tmb@anu.edu.vn',unit:'FACULTY-ENG',position:'Trưởng khoa',status:'ACTIVE',source:'seed-demo'},
    {id:'PER-003',employeeCode:'CB003',fullName:'Lê Thu C',email:'ltc@anu.edu.vn',unit:'FACULTY-ENG',position:'Giảng viên',status:'ACTIVE',source:'seed-demo'},
    {id:'PER-004',employeeCode:'CB004',fullName:'Phạm D',email:'pd@anu.edu.vn',unit:'OFFICE-ACADEMIC',position:'Chuyên viên',status:'ACTIVE',source:'seed-demo'}
  ],
  students:[
    {id:'STU-001',studentCode:'SV20260001',fullName:'Lê Minh',email:'minh@anu.edu.vn',program:'PROGRAM-AI',faculty:'FACULTY-ENG',cohort:'2026',status:'ACTIVE',source:'seed-demo'},
    {id:'STU-002',studentCode:'SV20260002',fullName:'Ngô Lan',email:'lan@anu.edu.vn',program:'PROGRAM-AI',faculty:'FACULTY-ENG',cohort:'2026',status:'ACTIVE',source:'seed-demo'},
    {id:'STU-003',studentCode:'SV20250011',fullName:'Đỗ Nam',email:'nam@anu.edu.vn',program:'PROGRAM-IT',faculty:'FACULTY-ENG',cohort:'2025',status:'ACTIVE',source:'seed-demo'}
  ],
  facilities:[
    {id:'BLD-A1',type:'BUILDING',name:'Tòa nhà A1',campus:'CAMPUS-A',grossArea:5200,usableArea:4100,floors:5,status:'ACTIVE'},
    {id:'ROOM-A101',type:'ROOM',name:'Phòng A101',buildingId:'BLD-A1',floor:1,area:72,capacity:60,function:'CLASSROOM',status:'ACTIVE'}
  ],
  assets:[{id:'AST-001',assetCode:'GPU-001',name:'GPU Server',category:'COMPUTE',location:'ROOM-A101',ownerUnit:'FACULTY-ENG',condition:'GOOD',status:'ACTIVE'}],
  inventory:[{id:'INV-001',itemCode:'VT-001',name:'Cáp mạng Cat6',category:'NETWORK',unit:'cuộn',quantityOnHand:25,minimumLevel:10,warehouse:'WH-A',status:'ACTIVE'}],
  programs:[
    {id:'PROGRAM-AI',code:'AI',name:'Trí tuệ nhân tạo',level:'UNDERGRADUATE',ownerUnit:'FACULTY-ENG',status:'ACTIVE',source:'seed-demo'},
    {id:'PROGRAM-IT',code:'IT',name:'Công nghệ thông tin',level:'UNDERGRADUATE',ownerUnit:'FACULTY-ENG',status:'ACTIVE',source:'seed-demo'}
  ],
  courses:[
    {id:'COURSE-AI101',code:'AI101',name:'Nhập môn Trí tuệ nhân tạo',programId:'PROGRAM-AI',credits:3,ownerUnit:'FACULTY-ENG',status:'ACTIVE',source:'seed-demo'},
    {id:'COURSE-ML201',code:'ML201',name:'Học máy',programId:'PROGRAM-AI',credits:3,ownerUnit:'FACULTY-ENG',status:'ACTIVE',source:'seed-demo'}
  ],
  researchProjects:[
    {id:'PROJECT-AI-2026',code:'PROJECT-AI-2026',name:'AI trong giáo dục kỹ thuật',ownerUnit:'FACULTY-ENG',principalInvestigator:'USR-RESEARCH',status:'ACTIVE',source:'seed-demo'}
  ],
  financeRecords:[
    {id:'FIN-2026-01',year:2026,type:'BUDGET',ownerUnit:'ANU',amount:1000000000,currency:'VND',status:'PLANNED',source:'seed-demo'}
  ],
  artifacts:[],
  importBatches:[], provisioningQueue:[], audit:[], traces:[], memory:[], failures:[], passwordResetRequests:[]
};
