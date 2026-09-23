export class MultimodalProcessor {
  constructor({artifacts,model}){ this.artifacts=artifacts; this.model=model; }
  async process(artifactId,{prompt='Đọc/quan sát nội dung này, trích xuất các dữ kiện quan trọng, cấu trúc dữ liệu có thể sử dụng, và nêu giới hạn nếu có.'}={}){
    const artifact=this.artifacts.get(artifactId); if(!artifact) throw new Error('ARTIFACT_NOT_FOUND');
    if(artifact.processingStatus==='TEXT_EXTRACTED' || artifact.processingStatus==='AI_PROCESSED') return artifact;
    const file=this.artifacts.file(artifactId); if(!file) throw new Error('FILE_BYTES_NOT_IN_SESSION: Hãy chọn lại tệp sau khi tải lại trang. GitHub Pages chỉ giữ bytes tệp trong phiên hiện tại.');
    this.artifacts.updateProcessing(artifactId,{processingStatus:'PROCESSING',processingError:null});
    try{
      const r=await this.model.analyzeFile({file,artifact,prompt});
      return this.artifacts.updateProcessing(artifactId,{processingStatus:'AI_PROCESSED',extractedText:String(r.text||'').slice(0,200000),textPreview:String(r.text||'').slice(0,6000),processor:{provider:r.provider,model:r.model,mode:r.mode||'MULTIMODAL',processedAt:new Date().toISOString()},processingError:null});
    }catch(e){
      this.artifacts.updateProcessing(artifactId,{processingStatus:'PROCESSING_FAILED',processingError:e.message});
      throw e;
    }
  }
  async processMany(ids,opts={}){ const out=[]; for(const id of ids||[]) out.push(await this.process(id,opts)); return out; }
}
