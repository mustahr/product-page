(function(){
 'use strict';
 if(/^\/(dashboard|api)(\/|$)/.test(location.pathname))return;
 var keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','campaign_id','adset_id','ad_id'],storageKey='mustahr_campaign_v1',ttl=30*60*1000,entry=null;
 try{entry=JSON.parse(sessionStorage.getItem(storageKey)||'null');}catch(e){}
 if(!entry||typeof entry.time!=='number'||Date.now()-entry.time>ttl||!entry.data)entry=null;
 var params=new URLSearchParams(location.search),data={};
 keys.forEach(function(key){var value=params.get(key);if(value){value=value.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,160);if(value)data[key]=value;}});
 if(Object.keys(data).length){entry={time:Date.now(),data:data};try{sessionStorage.setItem(storageKey,JSON.stringify(entry));}catch(e){}}
 document.addEventListener('submit',function(event){var form=event.target;if(!(form instanceof HTMLFormElement)||!form.querySelector('[name="productId"]'))return;var field=form.querySelector('input[name="attribution"]');if(!field){field=document.createElement('input');field.type='hidden';field.name='attribution';form.appendChild(field);}field.value=JSON.stringify(entry&&Date.now()-entry.time<=ttl?entry.data:{});},true);
})();
