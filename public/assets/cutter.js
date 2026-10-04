const form=document.getElementById('orderForm'),quantity=document.getElementById('quantity'),result=document.getElementById('result'),submit=form.querySelector('[type=submit]');
const keys=['name','phone','city','address','quantity'];
function update(){document.getElementById('total').textContent=(159*Number(quantity.value||1))+' دينار ليبي';}
document.getElementById('minus').onclick=()=>{quantity.value=Math.max(1,Number(quantity.value)-1);update();};
document.getElementById('plus').onclick=()=>{quantity.value=Math.min(11,Number(quantity.value)+1);update();};
quantity.oninput=update;
function error(key,message){document.getElementById(key+'-error').textContent=message||'';form.elements[key].setAttribute('aria-invalid',message?'true':'false');form.elements[key].setAttribute('aria-describedby',key+'-error');}
keys.forEach(key=>form.elements[key].addEventListener('input',()=>error(key,'')));
form.onsubmit=async(event)=>{event.preventDefault();result.textContent='';let invalid=false;
 keys.forEach(key=>{let message='';const value=form.elements[key].value.trim();if(!value)message='هذا الحقل مطلوب.';else if(key==='phone'&&!/^(09\d{8}|9\d{8}|2189\d{8})$/.test(value.replace(/\D/g,'')))message='أدخل رقم هاتف ليبي صحيحاً، مثل 09XXXXXXXX.';else if(key==='quantity'&&(!Number.isInteger(Number(value))||Number(value)<1||Number(value)>11))message='اختر كمية من 1 إلى 11.';error(key,message);if(message)invalid=true;});
 if(invalid){form.querySelector('[aria-invalid=true]').focus();return;}if(!form.elements.orderId.value)form.elements.orderId.value=crypto.randomUUID();submit.disabled=true;submit.textContent='جارٍ تسجيل الطلب…';
 try{const response=await fetch('/api/orders',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});const data=await response.json();if(!response.ok||!data.ok){if(data.fieldErrors){Object.keys(data.fieldErrors).forEach(key=>error(key,data.fieldErrors[key]==='stock'?'المخزون غير كافٍ لهذه الكمية.':'يرجى التحقق من هذا الحقل.'));throw new Error('validation');}throw new Error('storage');}result.className='success';result.textContent='تم استلام طلبك لقطاعة الخضروات. سيتواصل معك الفريق لتأكيد العنوان والتوصيل. الدفع عند الاستلام.';submit.textContent='تم تسجيل الطلب';}
 catch{result.className='error';result.textContent='لم يتم تسجيل الطلب. تحقق من البيانات وحاول مرة أخرى.';submit.disabled=false;submit.textContent='تأكيد الطلب — الدفع عند الاستلام';}
};

// Keep the fixed order bar out of the way while the checkout is on screen.
const mobileOrderBar=document.querySelector('.mobile-order');
if(mobileOrderBar){
 const syncOrderBar=()=>{
  const bounds=form.getBoundingClientRect();
  const viewportHeight=window.visualViewport?.height||window.innerHeight;
  mobileOrderBar.hidden=bounds.top<viewportHeight&&bounds.bottom>0;
 };
 if('IntersectionObserver' in window){
  const formObserver=new IntersectionObserver(entries=>{
   mobileOrderBar.hidden=entries[0].isIntersecting;
  },{threshold:0});
  formObserver.observe(form);
 }else{
  window.addEventListener('scroll',syncOrderBar,{passive:true});
 }
 window.addEventListener('resize',syncOrderBar,{passive:true});
 window.visualViewport?.addEventListener('resize',syncOrderBar,{passive:true});
 syncOrderBar();
}
