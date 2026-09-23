export class MultimodalProcessor {
  constructor({artifacts,model}){ this.artifacts=artifacts; this.model=model; }
  async process(artifactId,{prompt='Đọc/quan sát nội dung này, trích xuất các dữ kiện quan trọng, cấu trúc dữ liệu có thể sử dụng, và nêu giới hạn nếu có.'}={}){
    const artifact=this.artifacts.get(artifactId); if(!artifact) throw new Error('ARTIFACT_NOT_FOUND');
    if(artifact.processingStatus==='TEXT_EXTRACTED' || artifact.processingStatus==='AI_PROCESSED') return artifact;
    const file=await this.artifacts.file(artifactId); if(!file){ this.artifacts.updateProcessing(artifactId,{bytesState:'MISSING',processingError:'FILE_BYTES_MISSING'}); throw new Error('FILE_BYTES_MISSING: Tệp này được tạo ở phiên V5.2 cũ hoặc dữ liệu trình duyệt đã bị xóa. Hãy chọn lại đúng tệp một lần; V5.2.1 sẽ lưu bytes trong IndexedDB để dùng lại sau khi tải lại trang.'); }
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
