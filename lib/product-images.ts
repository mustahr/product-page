/** Render optimized built-in photos without changing saved product URLs. */
export function productImage(src:string){
 if(src==='/assets/charger-product-clean.png'||src==='assets/charger-product-clean.png')return {src:'/assets/charger-product-clean-960.webp',srcSet:[320,640,960,1254].map(w=>`/assets/charger-product-clean-${w}.webp ${w}w`).join(', '),sizes:'(max-width: 700px) 100vw, 600px',width:1254,height:1254};
 if(src==='/assets/cutter-reference.png'||src==='assets/cutter-reference.png')return {src:'/assets/cutter-reference-1857.webp',width:1857,height:769};
 return {src};
}
