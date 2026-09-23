export class SmartWire{
  constructor({id,from,to,contract,transform=(x)=>x}){Object.assign(this,{id,from,to,contract,transform})}
  transmit(payload){return this.transform(structuredClone(payload))}
}
