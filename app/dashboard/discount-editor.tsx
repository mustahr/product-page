'use client';
import {discountSettings} from '@/lib/product-pricing';
export default function DiscountEditor({id,details,onChange}:{id:string;details:Record<string,string>;onChange:(details:Record<string,string>)=>void}){
 const settings=discountSettings({id,price_cents:0,details:JSON.stringify(details)});
 return <fieldset className="pm-detail-group pm-discount"><legend>Remise sur les articles supplémentaires</legend><label className="pm-discount-toggle"><input type="checkbox" checked={settings.enabled} onChange={e=>onChange({...details,discountEnabled:String(e.target.checked),discountPercent:details.discountPercent??'10'})}/>Activer la remise après le premier article</label><label>Pourcentage de remise (%)<input type="number" min="0" max="100" step=".01" required disabled={!settings.enabled} value={details.discountPercent??'10'} onChange={e=>onChange({...details,discountPercent:e.target.value})}/></label><p>Le premier article reste au prix normal. Chaque article supplémentaire bénéficie de ce pourcentage. Les frais de livraison ne sont pas remisés et sont ajoutés une seule fois.</p></fieldset>;
}
