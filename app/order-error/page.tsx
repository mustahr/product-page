export default async function ErrorPage({searchParams}:{searchParams:Promise<{lang?:string;reason?:string}>}) {
 const {lang,reason}=await searchParams; const ar=lang==="ar";
 const messages:Record<string,[string,string]>={
  phone:["Vérifiez le numéro de téléphone : il doit contenir entre 8 et 15 chiffres.","يرجى التحقق من رقم الهاتف: يجب أن يتكون من 8 إلى 15 رقماً."],
  details:["Complétez votre nom, votre ville et votre adresse de livraison.","يرجى إدخال الاسم والمدينة وعنوان التوصيل."],
  quantity:["Choisissez une quantité entre 1 et 99.","يرجى اختيار كمية بين 1 و99."],
  storage:["Un problème technique a empêché la transmission de votre commande. Aucun achat n’a été confirmé. Veuillez réessayer dans quelques instants.","حدث عطل تقني ولم يتم إرسال الطلب. يرجى إعادة المحاولة بعد قليل."],
 };
 const message=messages[reason||""]||messages.storage;
 return <main dir={ar?"rtl":"ltr"} style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20}}><div style={{background:"white",borderRadius:22,padding:40,maxWidth:560,boxShadow:"0 16px 48px #15233b1a"}}><h1>{ar?"لم يتم تسجيل الطلب":"Commande non enregistrée"}</h1><p style={{fontSize:18,lineHeight:1.6}}>{ar?message[1]:message[0]}</p><a href="/store.html#commande" style={{display:"inline-block",background:"#ffc329",color:"#172136",padding:"14px 20px",borderRadius:12,fontWeight:700,textDecoration:"none"}}>{ar?"العودة إلى الطلب":"Réessayer"}</a></div></main>
}
