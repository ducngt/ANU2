export class EvidenceBox {
  evaluate(records=[]){ return records.map(r=>({recordId:r.id,strength:r.provenance?.source?'SUPPORTED':'WEAK',source:r.provenance?.source||'UNKNOWN',valid:r.valid!==false})); }
}
