export class SBBSRuntime{
  constructor(){this.boxes=new Map();this.wires=new Map();this.assemblies=new Map()}
  registerBox(id,box){this.boxes.set(id,box);return this}
  registerWire(id,wire){this.wires.set(id,wire);return this}
  registerAssembly(id,assembly){this.assemblies.set(id,assembly);return this}
  snapshot(){return {boxes:[...this.boxes.keys()],wires:[...this.wires.keys()],assemblies:[...this.assemblies.keys()]}}
}
