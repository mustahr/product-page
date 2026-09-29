const origin="https://chargeur-voiture-4-en-1-maroc.simouaamer.chatgpt.site";
export async function forwardOrders(request:Request,path:string){
 if(request.method!=="GET"&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Requête non autorisée"},{status:403});
 const headers=new Headers();headers.set("Accept","application/json");headers.set("Origin",origin);
 const type=request.headers.get("content-type");if(type)headers.set("Content-Type",type);
 try{
  const response=await fetch(origin+path,{method:request.method,headers,body:request.method==="GET"?undefined:await request.arrayBuffer(),cache:"no-store",redirect:"manual"});
  return new Response(await response.arrayBuffer(),{status:response.status,headers:{"Content-Type":response.headers.get("content-type")||"application/json","Cache-Control":"no-store"}});
 }catch{return Response.json({error:"Service de commandes indisponible"},{status:503});}
}
export async function loadOrders(){const response=await fetch(origin+"/api/orders",{cache:"no-store"});if(!response.ok)throw new Error("Orders unavailable");return response.json();}
