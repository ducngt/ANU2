export class SBBSRuntime {
  constructor(){ this.boxes=new Map(); this.assemblies=new Map(); }
  registerBox(id,box){ this.boxes.set(id,box); return this; }
  registerAssembly(id,a){ this.assemblies.set(id,a); return this; }
  snapshot(){ return {boxes:[...this.boxes.keys()],assemblies:[...this.assemblies.keys()]}; }
}
