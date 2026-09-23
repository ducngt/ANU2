export class RegistryBox {
  constructor(key, seed = []) { this.key = key; this.seed = seed; }
  _load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) { localStorage.setItem(this.key, JSON.stringify(this.seed)); return structuredClone(this.seed); }
    try { return JSON.parse(raw); } catch { return structuredClone(this.seed); }
  }
  list() { return this._load(); }
  get(id) { return this._load().find(x => x.id === id); }
  upsert(item) {
    const all = this._load(); const i = all.findIndex(x => x.id === item.id);
    const next = {...item, updatedAt:new Date().toISOString()};
    if (i >= 0) all[i] = {...all[i], ...next}; else all.push({...next, createdAt:next.updatedAt});
    localStorage.setItem(this.key, JSON.stringify(all)); return next;
  }
  remove(id) { localStorage.setItem(this.key, JSON.stringify(this._load().filter(x => x.id !== id))); }
  reset() { localStorage.setItem(this.key, JSON.stringify(this.seed)); }
}
