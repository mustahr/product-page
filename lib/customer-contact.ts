export function customerContact(phone:string,currency:string){
 const cleaned=phone.trim(),digits=cleaned.replace(/\D/g,'');let international='';
 if(cleaned.startsWith('+'))international=digits;else if(digits.startsWith('00'))international=digits.slice(2);
 else if(/^(212\d{9}|218\d{9})$/.test(digits))international=digits;
 else if(currency==='LYD'&&/^09\d{8}$/.test(digits))international='218'+digits.slice(1);
 else if(currency==='LYD'&&/^9\d{8}$/.test(digits))international='218'+digits;
 else if(currency!=='LYD'&&/^0[5-7]\d{8}$/.test(digits))international='212'+digits.slice(1);
 else if(currency!=='LYD'&&/^[5-7]\d{8}$/.test(digits))international='212'+digits;
 const valid=/^[1-9]\d{7,14}$/.test(international);
 return {call:valid?'tel:+'+international:digits?'tel:'+digits:null,whatsapp:valid?'https://wa.me/'+international:null};
}
