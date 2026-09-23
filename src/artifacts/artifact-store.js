const EXT={image:['png','jpg','jpeg','webp','gif','bmp','svg'],video:['mp4','webm','mov','m4v','avi'],audio:['mp3','wav','m4a','ogg','webm'],document:['pdf','doc','docx','ppt','pptx','xls','xlsx','csv','json','txt','md']};
function ext(name=''){return String(name).split('.').pop().toLowerCase();}
export function mediaTypeOf(file){
  const mime=String(file?.type||'').toLowerCase();
  if(mime.startsWith('image/')) return 'IMAGE'; if(mime.startsWith('video/')) return 'VIDEO'; if(mime.startsWith('audio/')) return 'AUDIO';
  const e=ext(file?.name); if(EXT.image.includes(e))return'IMAGE'; if(EXT.video.includes(e))return'VIDEO'; if(EXT.audio.includes(e))return'AUDIO';
  return 'DOCUMENT';
}
async function sha256(file){
  try{const b=await file.arrayBuffer(); if(globalThis.crypto?.subtle){const h=await crypto.subtle.digest('SHA-256',b); return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('');}}catch{}
  return '';
}
export class ArtifactStore {
  constructor(store){this.store=store;this.sessionFiles=new Map();}
  list(){return this.store.get('artifacts',[]);}
  get(id){return this.list().find(x=>x.id===id)||null;}
  async ingest(file,{uploadedBy,workItemId=null,domain='OIS',classification='INTERNAL',source='USER_UPLOAD'}={}){
    if(!file) throw new Error('FILE_REQUIRED');
    const mediaType=mediaTypeOf(file); const id=`ART-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    let text=''; const e=ext(file.name); if(['txt','md','csv','json'].includes(e)&&Number(file.size||0)<=2_000_000){try{text=(await file.text()).slice(0,200000);}catch{}}
    const artifact={id,name:file.name||id,mimeType:file.type||'application/octet-stream',mediaType,size:Number(file.size||0),source,uploadedBy,uploadedAt:new Date().toISOString(),workItemId,domain,classification,checksum:await sha256(file),processingStatus:text?'TEXT_EXTRACTED':'STORED',textPreview:text.slice(0,4000)};
    const arr=this.list(); arr.unshift(artifact); this.store.set('artifacts',arr.slice(0,1000)); this.sessionFiles.set(id,file); return artifact;
  }

  ingestText(text,{uploadedBy,workItemId=null,domain='OIS',classification='INTERNAL',source='TEXT_INPUT',name='Yêu cầu bằng lời nói / văn bản'}={}){
    const value=String(text||'').trim(); if(!value) throw new Error('TEXT_REQUIRED');
    const id=`ART-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const artifact={id,name,mimeType:'text/plain',mediaType:'TEXT',size:new TextEncoder().encode(value).length,source,uploadedBy,uploadedAt:new Date().toISOString(),workItemId,domain,classification,checksum:'',processingStatus:'TEXT_EXTRACTED',textPreview:value.slice(0,4000)};
    const arr=this.list(); arr.unshift(artifact); this.store.set('artifacts',arr.slice(0,1000)); return artifact;
  }
  updateProcessing(artifactId,patch={}){const arr=this.list();const a=arr.find(x=>x.id===artifactId);if(!a)throw new Error('ARTIFACT_NOT_FOUND');Object.assign(a,patch);this.store.set('artifacts',arr);return a;}
  attachToWork(artifactId,workId){const arr=this.list();const a=arr.find(x=>x.id===artifactId);if(!a)throw new Error('ARTIFACT_NOT_FOUND');a.workItemId=workId;this.store.set('artifacts',arr);return a;}
  file(id){return this.sessionFiles.get(id)||null;}
}
