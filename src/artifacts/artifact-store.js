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
function idbAvailable(){return typeof indexedDB!=='undefined';}
function openArtifactDb(){
  return new Promise((resolve,reject)=>{
    if(!idbAvailable()) return resolve(null);
    const req=indexedDB.open('anu2-artifact-bytes',1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('files'))db.createObjectStore('files',{keyPath:'id'});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('INDEXEDDB_OPEN_FAILED'));
  });
}
async function idbPut(id,file){
  const db=await openArtifactDb(); if(!db)return false;
  return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put({id,file,savedAt:new Date().toISOString()});tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error||new Error('INDEXEDDB_WRITE_FAILED'))};});
}
async function idbGet(id){
  const db=await openArtifactDb(); if(!db)return null;
  return new Promise((resolve,reject)=>{const tx=db.transaction('files','readonly');const req=tx.objectStore('files').get(id);req.onsuccess=()=>{const v=req.result?.file||null;db.close();resolve(v)};req.onerror=()=>{db.close();reject(req.error||new Error('INDEXEDDB_READ_FAILED'))};});
}
export class ArtifactStore {
  constructor(store){this.store=store;this.sessionFiles=new Map();}
  list(){return this.store.get('artifacts',[]);}
  get(id){return this.list().find(x=>x.id===id)||null;}
  async ingest(file,{uploadedBy,workItemId=null,domain='OIS',classification='INTERNAL',source='USER_UPLOAD'}={}){
    if(!file) throw new Error('FILE_REQUIRED');
    const mediaType=mediaTypeOf(file); const checksum=await sha256(file); const now=new Date().toISOString();
    const existing=this.list().find(x=>x.checksum&&checksum&&x.checksum===checksum&&x.size===Number(file.size||0));
    if(existing){
      this.sessionFiles.set(existing.id,file);
      let persisted=false; try{persisted=await idbPut(existing.id,file);}catch{}
      this.updateProcessing(existing.id,{bytesState:persisted?'PERSISTED':'SESSION_ONLY',bytesLastSeenAt:now,processingError:null});
      return this.get(existing.id);
    }
    const id=`ART-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    let text=''; const e=ext(file.name); if(['txt','md','csv','json'].includes(e)&&Number(file.size||0)<=2_000_000){try{text=(await file.text()).slice(0,200000);}catch{}}
    this.sessionFiles.set(id,file);
    let persisted=false; try{persisted=await idbPut(id,file);}catch{}
    const artifact={id,name:file.name||id,mimeType:file.type||'application/octet-stream',mediaType,size:Number(file.size||0),source,uploadedBy,uploadedAt:now,workItemId,domain,classification,checksum,processingStatus:text?'TEXT_EXTRACTED':'STORED',textPreview:text.slice(0,4000),bytesState:persisted?'PERSISTED':'SESSION_ONLY',bytesLastSeenAt:now};
    const arr=this.list(); arr.unshift(artifact); this.store.set('artifacts',arr.slice(0,1000)); return artifact;
  }

  ingestText(text,{uploadedBy,workItemId=null,domain='OIS',classification='INTERNAL',source='TEXT_INPUT',name='Yêu cầu bằng lời nói / văn bản'}={}){
    const value=String(text||'').trim(); if(!value) throw new Error('TEXT_REQUIRED');
    const id=`ART-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const artifact={id,name,mimeType:'text/plain',mediaType:'TEXT',size:new TextEncoder().encode(value).length,source,uploadedBy,uploadedAt:new Date().toISOString(),workItemId,domain,classification,checksum:'',processingStatus:'TEXT_EXTRACTED',textPreview:value.slice(0,4000),bytesState:'INLINE_TEXT'};
    const arr=this.list(); arr.unshift(artifact); this.store.set('artifacts',arr.slice(0,1000)); return artifact;
  }
  updateProcessing(artifactId,patch={}){const arr=this.list();const a=arr.find(x=>x.id===artifactId);if(!a)throw new Error('ARTIFACT_NOT_FOUND');Object.assign(a,patch);this.store.set('artifacts',arr);return a;}
  attachToWork(artifactId,workId){const arr=this.list();const a=arr.find(x=>x.id===artifactId);if(!a)throw new Error('ARTIFACT_NOT_FOUND');a.workItemId=workId;this.store.set('artifacts',arr);return a;}
  async file(id){
    if(this.sessionFiles.has(id)) return this.sessionFiles.get(id);
    try{const f=await idbGet(id);if(f){this.sessionFiles.set(id,f);this.updateProcessing(id,{bytesState:'PERSISTED',bytesLastSeenAt:new Date().toISOString()});return f;}}catch{}
    return null;
  }
}
