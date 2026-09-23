function openAIParams(model,maxTokens=800){ const m=String(model||'').toLowerCase(); const reasoning=/^(o1|o3|o4)(-|$)/.test(m)||/^gpt-5(?:[.\-]|$)/.test(m); return {reasoning,tokenParameter:reasoning?'max_completion_tokens':'max_tokens',instructionRole:reasoning?'developer':'system',supportsTemperature:!reasoning,maxTokens:Number(maxTokens)||800}; }
export class ModelGatewayBox {
  constructor(){ this.config={provider:'mock',model:'mock-analyzer',apiKey:'',maxTokens:800}; }
  setConfig(c){ this.config={...this.config,...c,apiKey:c.apiKey??this.config.apiKey}; }
  publicConfig(){ const {apiKey,...rest}=this.config; return {...rest,hasKey:!!apiKey}; }
  async reason({system,user}){
    const c=this.config;
    if(c.provider==='openai'&&c.apiKey){
      const p=openAIParams(c.model,c.maxTokens); const body={model:c.model,messages:[{role:p.instructionRole,content:system},{role:'user',content:user}]}; body[p.tokenParameter]=p.maxTokens; if(p.supportsTemperature) body.temperature=0.2;
      const res=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${c.apiKey}`},body:JSON.stringify(body)}); const j=await res.json(); if(!res.ok) throw new Error(j?.error?.message||`OpenAI ${res.status}`); return {text:j.choices?.[0]?.message?.content||'',model:c.model,provider:'openai'};
    }
    return {text:this.mock(user),model:'mock-analyzer',provider:'mock'};
  }
  mock(user){ const q=String(user||'').toLowerCase(); if(q.includes('mu ')||q.includes('manchester united')) return 'Manchester United là một câu lạc bộ bóng đá của Anh, có trụ sở tại Manchester.'; if(q.includes('sống')||q.includes('sach')||q.includes('đúng')||q.includes('đủ')) return 'Trong ANU, dữ liệu quan trọng phải phản ánh thực tại và có thể kiểm chứng qua nguồn gốc, chủ sở hữu, phiên bản, ngữ cảnh, mức kiểm chứng và hiệu lực.'; if(q.includes('mở ngành')||q.includes('ngành ai')) return 'Có thể xây dựng phương án mở ngành AI theo các nhóm: nhu cầu xã hội, năng lực đội ngũ, chương trình, hạ tầng, tài chính, chất lượng và rủi ro. Đây là khuyến nghị chuẩn bị cho con người xem xét, không phải quyết định thể chế.'; return 'Kết quả mô phỏng: hệ thống đã phân loại tác vụ, lựa chọn capability phù hợp và tạo câu trả lời trong phạm vi Working Context hiện hành.'; }
}
export {openAIParams};
