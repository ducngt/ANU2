const SUPPORTED=['vi','en','zh-CN'];
export class I18nService {
  constructor({defaultLang='vi',storageKey='anu2-language'}={}){this.defaultLang=defaultLang;this.storageKey=storageKey;this.lang=defaultLang;this.dict={};}
  async init(){
    const saved=globalThis.localStorage?.getItem?.(this.storageKey);
    const browser=globalThis.navigator?.language||'';
    const candidate=saved||SUPPORTED.find(x=>browser.toLowerCase().startsWith(x.toLowerCase().split('-')[0]))||this.defaultLang;
    await this.setLanguage(SUPPORTED.includes(candidate)?candidate:this.defaultLang,false); return this;
  }
  async setLanguage(lang,persist=true){
    if(!SUPPORTED.includes(lang)) lang=this.defaultLang;
    const res=await fetch(`./public/i18n/${lang}.json`); if(!res.ok) throw new Error(`i18n ${lang}: ${res.status}`);
    this.dict=await res.json(); this.lang=lang; if(persist) globalThis.localStorage?.setItem?.(this.storageKey,lang); return lang;
  }
  t(key,vars={}){ let v=key.split('.').reduce((o,k)=>o?.[k],this.dict); if(typeof v!=='string') return `[${key}]`; return v.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??`{${k}}`); }
  languages(){return [...SUPPORTED];}
}
export {SUPPORTED};
