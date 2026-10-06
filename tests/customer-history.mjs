import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import ts from 'typescript';
function load(file,dependencies={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,require:name=>{if(!(name in dependencies))throw Error(name);return dependencies[name];}});return exports;}
const contact=load('lib/customer-contact.ts'),history=load('lib/customer-history.ts',{'./customer-contact':contact});
const {customerKey,customerGroups,customerSignals,possibleDuplicates}=history;
for(const phone of ['0612345678','06 12 34 56 78','+212 612345678','00212612345678','612345678'])assert.equal(customerKey(phone,'MAD'),'212612345678');
for(const phone of ['0912345678','912345678','+218912345678','00218912345678'])assert.equal(customerKey(phone,'LYD'),'218912345678');
assert.notEqual(customerKey('0612345678','MAD'),customerKey('0612345678','LYD'));assert.equal(customerKey('abc','MAD'),null);
const order={id:'anchor',created_at:'2026-10-06T12:00:00.000Z',phone:'0612345678',currency:'MAD',status:'Nouveau',product_id:'charger',product_name:'Charger',variant:'Black',quantity:2,total_cents:33820};
const duplicate={...order,id:'duplicate',phone:'+212612345678',created_at:'2026-10-04T12:00:00.000Z'};
assert.equal(possibleDuplicates(order,[order,duplicate]).length,1);
for(const patch of [{status:'Annulé'},{status:'Livré'},{quantity:1},{total_cents:1},{variant:'White'},{product_id:'other'},{currency:'LYD'},{phone:'0612345679'},{created_at:'2026-10-04T11:59:59.999Z'},{created_at:'invalid'}])assert.equal(possibleDuplicates(order,[{...duplicate,...patch}]).length,0,JSON.stringify(patch));
assert.equal(possibleDuplicates({...order,status:'Livré'},[duplicate]).length,0);
assert.equal(possibleDuplicates({...order,variant:'',product_name:'New name'},[{...duplicate,variant:'',product_name:'Old name'}]).length,1);
const old=Array.from({length:600},(_,i)=>({...order,id:'old-'+i,created_at:'2025-01-01T00:00:00Z',status:i%2?'Livré':'Annulé'}));
const rows=[order,duplicate,...old,{...order,id:'unrelated',phone:'0612345679'}],groups=customerGroups(rows),signals=customerSignals(order,groups.get(customerKey(order.phone,order.currency)));
assert.equal(signals.otherOrders,601);assert.equal(signals.delivered,300);assert.equal(signals.cancelled,300);assert.equal(signals.duplicateIds.join(','),'duplicate');
assert.equal(customerSignals({...order,phone:'bad'},rows).otherOrders,0);
console.log('Customer history: Morocco/Libya formats, all-history counts beyond 500 orders, matching options/totals, 48-hour boundary and active-status duplicate checks passed.');
