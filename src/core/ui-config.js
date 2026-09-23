export const roleMenuKeys={
 SYSTEM_ADMIN:[['dashboard','menu.dashboard_system'],['imports','menu.imports'],['master','menu.master'],['accounts','menu.accounts'],['domains','menu.domains'],['work','menu.work'],['settings','menu.settings'],['audit','menu.audit'],['advanced','menu.advanced']],
 RECTOR:[['dashboard','menu.dashboard_university'],['domains','menu.domains'],['work','menu.work_decision'],['research','menu.research'],['data','menu.data_metrics']],
 VICE_RECTOR:[['dashboard','menu.dashboard_university'],['domains','menu.domains'],['work','menu.work_decision'],['research','menu.research'],['data','menu.data_metrics']],
 DEPARTMENT_HEAD:[['dashboard','menu.dashboard_unit'],['domains','menu.domains'],['work','menu.work'],['people','menu.people'],['research','menu.research'],['data','menu.data']],
 LECTURER:[['dashboard','menu.dashboard_teaching'],['teaching','menu.teaching'],['research','menu.research'],['knowledge','menu.knowledge'],['work','menu.work']],
 RESEARCHER:[['dashboard','menu.dashboard_research'],['research','menu.research_analysis'],['knowledge','menu.knowledge_evidence'],['work','menu.work']],
 STUDENT:[['dashboard','menu.dashboard_student'],['learning','menu.learning'],['knowledge','menu.documents_knowledge'],['work','menu.work']],
 STAFF:[['dashboard','menu.dashboard_staff'],['work','menu.work'],['data','menu.business_data']]
};
export function menuForRole(role){return roleMenuKeys[role]||roleMenuKeys.STAFF;}
export function canConfigureAI(role){return role==='SYSTEM_ADMIN';}
