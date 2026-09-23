export function speechRecognitionCtor(scope=globalThis){
  return scope?.SpeechRecognition || scope?.webkitSpeechRecognition || null;
}

export function speechSupported(scope=globalThis){
  return !!speechRecognitionCtor(scope);
}

export class SpeechInputService {
  constructor({scope=globalThis,lang='vi-VN'}={}){
    this.scope=scope;
    this.lang=lang;
    this.recognition=null;
    this.listening=false;
  }
  setLanguage(lang){ this.lang=lang||'vi-VN'; if(this.recognition) this.recognition.lang=this.lang; }
  start({onInterim=()=>{},onFinal=()=>{},onStatus=()=>{},onError=()=>{}}={}){
    const Ctor=speechRecognitionCtor(this.scope);
    if(!Ctor) throw new Error('SPEECH_RECOGNITION_UNSUPPORTED');
    if(this.listening) return;
    const r=new Ctor();
    r.lang=this.lang;
    r.continuous=true;
    r.interimResults=true;
    r.maxAlternatives=1;
    r.onstart=()=>{this.listening=true;onStatus('LISTENING');};
    r.onend=()=>{this.listening=false;onStatus('STOPPED');};
    r.onerror=e=>{this.listening=false;onError(e?.error||'SPEECH_ERROR');};
    r.onresult=e=>{
      let interim=''; let final='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const text=e.results[i]?.[0]?.transcript||'';
        if(e.results[i].isFinal) final+=text; else interim+=text;
      }
      if(interim) onInterim(interim.trim());
      if(final) onFinal(final.trim());
    };
    this.recognition=r;
    r.start();
  }
  stop(){ if(this.recognition&&this.listening){ try{this.recognition.stop();}catch{} } }
}
