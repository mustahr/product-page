/** Keep animated GIFs and fall back to the original on unsupported browsers. */
export async function optimizeUpload(file:File):Promise<File>{
 if(file.type==='image/gif'||file.size<200_000||!['image/jpeg','image/png','image/webp'].includes(file.type)||typeof createImageBitmap!=='function')return file;
 let bitmap:ImageBitmap|undefined;
 try{
  bitmap=await createImageBitmap(file);
  const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const context=canvas.getContext('2d');if(!context)return file;
  context.drawImage(bitmap,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/webp',0.86));
  if(!blob||blob.type!=='image/webp'||blob.size>=file.size)return file;
  return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp',lastModified:file.lastModified});
 }catch{return file;}finally{bitmap?.close();}
}
