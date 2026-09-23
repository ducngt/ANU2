export function routeTask(text){
  const q=String(text||'').trim().toLowerCase();
  if(!q) return {type:'INVALID',confidence:0,reason:'EMPTY_TASK'};
  if(/trợ giúp|help|hướng dẫn/.test(q)) return {type:'HELP',confidence:.95};
  if(/anu|sbbs|sống|sạch|đúng|đủ|tuyên ngôn|nội bộ|quy định/.test(q)) return {type:'INTERNAL_KNOWLEDGE',confidence:.9};
  if(/mở ngành|chiến lược|quản trị|kịch bản|rủi ro|lãnh đạo|đề xuất/.test(q)) return {type:'MANAGEMENT_ANALYSIS',confidence:.86};
  if(/nghiên cứu|tổng quan|bằng chứng|literature|research/.test(q)) return {type:'RESEARCH',confidence:.84};
  if(/dữ liệu|phân tích số liệu|dataset|thống kê/.test(q)) return {type:'DATA_ANALYSIS',confidence:.82};
  if(/phê duyệt|quyết định|approve|decision/.test(q)) return {type:'DECISION_SUPPORT',confidence:.82};
  return {type:'GENERAL_FACT',confidence:.78};
}
