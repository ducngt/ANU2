function openAIParams(model,maxTokens=800){
  const m=String(model||'').toLowerCase();
  const reasoning=/^(o1|o3|o4)(-|$)/.test(m)||/^gpt-5(?:[.\-]|$)/.test(m);
  return {reasoning,tokenParameter:reasoning?'max_completion_tokens':'max_tokens',instructionRole:reasoning?'developer':'system',supportsTemperature:!reasoning,maxTokens:Number(maxTokens)||800};
}
function cleanBaseUrl(url, fallback){ return String(url||fallback||'').replace(/\/$/,''); }
export class ModelGatewayBox {
  constructor(){
    this.config={provider:'mock',model:'mock-analyzer',apiKey:'',maxTokens:800,baseUrl:'',health:'UNKNOWN',lastTest:null,lastError:null};
  }
  setConfig(c){
    this.config={...this.config,...c,apiKey:c.apiKey!==undefined?c.apiKey:this.config.apiKey,health:'UNKNOWN',lastTest:null,lastError:null};
  }
  publicConfig(){ const {apiKey,...rest}=this.config; return {...rest,hasKey:!!apiKey}; }
  requireKey(){ if(this.config.provider!=='mock'&&!this.config.apiKey) throw new Error('API key is required for the selected provider'); }
  async testConnection(){
    const c=this.config; let result;
    try{
      if(c.provider==='mock') result={ok:true,provider:'mock',message:'Mock runtime is ready'};
      else if(c.provider==='openai'){
        this.requireKey(); const url=`${cleanBaseUrl(c.baseUrl,'https://api.openai.com/v1')}/models`;
        const res=await fetch(url,{headers:{Authorization:`Bearer ${c.apiKey}`}}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`OpenAI ${res.status}`); result={ok:true,provider:'openai',message:'OpenAI connection successful'};
      } else if(c.provider==='openrouter'){
        this.requireKey(); const url=`${cleanBaseUrl(c.baseUrl,'https://openrouter.ai/api/v1')}/models`;
        const res=await fetch(url,{headers:{Authorization:`Bearer ${c.apiKey}`}}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`OpenRouter ${res.status}`); result={ok:true,provider:'openrouter',message:'OpenRouter connection successful'};
      } else if(c.provider==='gemini'){
        this.requireKey(); const model=encodeURIComponent(c.model||'gemini-2.0-flash'); const url=`${cleanBaseUrl(c.baseUrl,'https://generativelanguage.googleapis.com/v1beta')}/models/${model}?key=${encodeURIComponent(c.apiKey)}`;
        const res=await fetch(url); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`Gemini ${res.status}`); result={ok:true,provider:'gemini',message:'Gemini connection successful'};
      } else if(c.provider==='custom'){
        this.requireKey(); const url=cleanBaseUrl(c.baseUrl); if(!url) throw new Error('Custom base URL is required'); const res=await fetch(`${url}/models`,{headers:{Authorization:`Bearer ${c.apiKey}`}}); if(!res.ok) throw new Error(`Custom provider ${res.status}`); result={ok:true,provider:'custom',message:'Custom provider connection successful'};
      } else throw new Error(`Unsupported provider: ${c.provider}`);
      this.config.health='HEALTHY'; this.config.lastTest=new Date().toISOString(); this.config.lastError=null; return result;
    }catch(e){ this.config.health='FAILED'; this.config.lastTest=new Date().toISOString(); this.config.lastError=e.message; throw e; }
  }
  async testInference(){
    const started=Date.now();
    const r=await this.reason({system:'You are a connectivity test. Answer briefly and exactly.',user:'Reply with: ANU-AI-OK'});
    const text=String(r.text||'').trim();
    if(!text) throw new Error('Provider returned an empty inference response');
    this.config.health='HEALTHY'; this.config.lastTest=new Date().toISOString(); this.config.lastError=null;
    return {...r,latencyMs:Date.now()-started,text};
  }
  async reason({system,user}){
    const c=this.config;
    if(c.provider==='mock') return {text:this.mock(user),model:'mock-analyzer',provider:'mock'};
    this.requireKey();
    if(c.provider==='openai'||c.provider==='openrouter'||c.provider==='custom'){
      const base=c.provider==='openai'?'https://api.openai.com/v1':c.provider==='openrouter'?'https://openrouter.ai/api/v1':c.baseUrl;
      const p=openAIParams(c.model,c.maxTokens);
      const body={model:c.model,messages:[{role:p.instructionRole,content:system},{role:'user',content:user}]}; body[p.tokenParameter]=p.maxTokens; if(p.supportsTemperature) body.temperature=0.2;
      const headers={'Content-Type':'application/json','Authorization':`Bearer ${c.apiKey}`}; if(c.provider==='openrouter'){headers['HTTP-Referer']=location?.origin||'https://ducngt.github.io';headers['X-Title']='ANU2';}
      const res=await fetch(`${cleanBaseUrl(c.baseUrl,base)}/chat/completions`,{method:'POST',headers,body:JSON.stringify(body)}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`${c.provider} ${res.status}`);
      return {text:j.choices?.[0]?.message?.content||'',model:c.model,provider:c.provider};
    }
    if(c.provider==='gemini'){
      const model=encodeURIComponent(c.model||'gemini-2.0-flash'); const url=`${cleanBaseUrl(c.baseUrl,'https://generativelanguage.googleapis.com/v1beta')}/models/${model}:generateContent?key=${encodeURIComponent(c.apiKey)}`;
      const body={system_instruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:user}]}],generationConfig:{maxOutputTokens:Number(c.maxTokens)||800,temperature:0.2}};
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`Gemini ${res.status}`); const text=(j.candidates?.[0]?.content?.parts||[]).map(x=>x.text||'').join(''); return {text,model:c.model,provider:'gemini'};
    }
    throw new Error(`Unsupported provider: ${c.provider}`);
  }
  async analyzeFile({file,artifact,prompt}){
    const c=this.config; const mime=String(file?.type||artifact?.mimeType||'application/octet-stream');
    const name=artifact?.name||file?.name||'artifact'; const media=artifact?.mediaType||'DOCUMENT';
    if(c.provider==='mock') return {text:`[MÔ PHỎNG] Đã tiếp nhận ${name} (${media}, ${mime}). Runtime thật cần chọn provider hỗ trợ loại dữ liệu này.`,model:'mock-analyzer',provider:'mock',mode:'SIMULATED_MULTIMODAL'};
    this.requireKey();
    const bytes=new Uint8Array(await file.arrayBuffer());
    let binary=''; const chunk=0x8000; for(let i=0;i<bytes.length;i+=chunk) binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
    const b64=btoa(binary);
    if(c.provider==='gemini'){
      const model=encodeURIComponent(c.model||'gemini-2.0-flash'); const url=`${cleanBaseUrl(c.baseUrl,'https://generativelanguage.googleapis.com/v1beta')}/models/${model}:generateContent?key=${encodeURIComponent(c.apiKey)}`;
      const body={system_instruction:{parts:[{text:'Bạn là bộ xử lý dữ liệu đa phương tiện của ANU. Chỉ mô tả điều quan sát/trích xuất được; không bịa dữ liệu. Phân biệt dữ kiện và suy luận.'}]},contents:[{role:'user',parts:[{text:`${prompt}\nTên tệp: ${name}\nLoại: ${media}`},{inlineData:{mimeType:mime,data:b64}}]}],generationConfig:{maxOutputTokens:Number(c.maxTokens)||1200,temperature:0.1}};
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`Gemini ${res.status}`); const text=(j.candidates?.[0]?.content?.parts||[]).map(x=>x.text||'').join(''); return {text,model:c.model,provider:'gemini',mode:'INLINE_MULTIMODAL'};
    }
    if((c.provider==='openai'||c.provider==='openrouter'||c.provider==='custom') && media==='IMAGE'){
      const base=c.provider==='openai'?'https://api.openai.com/v1':c.provider==='openrouter'?'https://openrouter.ai/api/v1':c.baseUrl;
      const p=openAIParams(c.model,c.maxTokens); const body={model:c.model,messages:[{role:p.instructionRole,content:'Bạn là bộ xử lý ảnh của ANU. Chỉ nêu nội dung quan sát được và giới hạn.'},{role:'user',content:[{type:'text',text:`${prompt}\nTên tệp: ${name}`},{type:'image_url',image_url:{url:`data:${mime};base64,${b64}`}}]}]}; body[p.tokenParameter]=p.maxTokens;
      const headers={'Content-Type':'application/json','Authorization':`Bearer ${c.apiKey}`}; const res=await fetch(`${cleanBaseUrl(c.baseUrl,base)}/chat/completions`,{method:'POST',headers,body:JSON.stringify(body)}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`${c.provider} ${res.status}`); return {text:j.choices?.[0]?.message?.content||'',model:c.model,provider:c.provider,mode:'VISION'};
    }
    if(c.provider==='openai' && media==='AUDIO'){
      const form=new FormData(); form.append('file',file,name); form.append('model','gpt-4o-mini-transcribe');
      const res=await fetch(`${cleanBaseUrl(c.baseUrl,'https://api.openai.com/v1')}/audio/transcriptions`,{method:'POST',headers:{Authorization:`Bearer ${c.apiKey}`},body:form}); const j=await res.json().catch(()=>({})); if(!res.ok) throw new Error(j?.error?.message||`OpenAI transcription ${res.status}`); return {text:j.text||'',model:'gpt-4o-mini-transcribe',provider:'openai',mode:'TRANSCRIPTION'};
    }
    throw new Error(`Provider ${c.provider} chưa hỗ trợ ${media}/${mime} trong browser runtime V5.2. Với PDF/Office/audio/video hãy dùng Gemini; với ảnh có thể dùng OpenAI/OpenRouter/Gemini.`);
  }
  mock(user){ const q=String(user||'').toLowerCase(); if(q.includes('mu ')||q.includes('manchester united')) return 'Manchester United là một câu lạc bộ bóng đá của Anh, có trụ sở tại Manchester.'; if(q.includes('sống')||q.includes('sach')||q.includes('đúng')||q.includes('đủ')) return 'Trong ANU, dữ liệu quan trọng phải phản ánh thực tại và có thể kiểm chứng qua nguồn gốc, chủ sở hữu, phiên bản, ngữ cảnh, mức kiểm chứng và hiệu lực.'; if(q.includes('mở ngành')||q.includes('ngành ai')) return 'Có thể xây dựng phương án mở ngành AI theo các nhóm: nhu cầu xã hội, năng lực đội ngũ, chương trình, hạ tầng, tài chính, chất lượng và rủi ro. Đây là khuyến nghị chuẩn bị cho con người xem xét, không phải quyết định thể chế.'; return 'Kết quả mô phỏng: hệ thống đã phân loại tác vụ, lựa chọn capability phù hợp và tạo câu trả lời trong phạm vi Working Context hiện hành.'; }
}
export {openAIParams};
