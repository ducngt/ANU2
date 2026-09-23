import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {menuForRole,canConfigureAI} from '../src/core/ui-config.js';

const load=lang=>JSON.parse(fs.readFileSync(new URL(`../public/i18n/${lang}.json`,import.meta.url),'utf8'));
const flatten=(o,p='',out={})=>{for(const [k,v] of Object.entries(o)){const n=p?`${p}.${k}`:k;if(v&&typeof v==='object')flatten(v,n,out);else out[n]=v;}return out;};

test('AI/model configuration is admin-only in navigation and policy',()=>{
  assert.equal(canConfigureAI('SYSTEM_ADMIN'),true);
  for(const role of ['RECTOR','VICE_RECTOR','DEPARTMENT_HEAD','LECTURER','RESEARCHER','STUDENT','STAFF']){
    assert.equal(canConfigureAI(role),false);
    assert.equal(menuForRole(role).some(([view])=>view==='settings'),false);
  }
  assert.equal(menuForRole('SYSTEM_ADMIN').some(([view])=>view==='settings'),true);
});

test('VI EN ZH-CN translation catalogs have identical keys',()=>{
  const vi=flatten(load('vi')), en=flatten(load('en')), zh=flatten(load('zh-CN'));
  assert.deepEqual(Object.keys(en).sort(),Object.keys(vi).sort());
  assert.deepEqual(Object.keys(zh).sort(),Object.keys(vi).sort());
});

test('role labels exist in all languages',()=>{
  for(const lang of ['vi','en','zh-CN']){
    const d=load(lang);
    for(const role of ['SYSTEM_ADMIN','RECTOR','VICE_RECTOR','DEPARTMENT_HEAD','LECTURER','RESEARCHER','STUDENT','STAFF']) assert.ok(d.roles[role]);
  }
});
