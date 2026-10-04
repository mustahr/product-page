export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){
 const {key}=await params;if(!/^[a-f0-9-]{36}\.(jpg|png|webp|gif)$/.test(key))return new Response('Not found',{status:404});
 try{const response=await fetch('https://chargeur-voiture-4-en-1-maroc.simouaamer.chatgpt.site/api/media/'+key,{cache:'no-store'});return new Response(response.body,{status:response.status,headers:{'Content-Type':response.headers.get('Content-Type')||'application/octet-stream','Cache-Control':response.headers.get('Cache-Control')||'no-store','X-Content-Type-Options':'nosniff'}});}catch{return new Response('Image unavailable',{status:503});}
}
