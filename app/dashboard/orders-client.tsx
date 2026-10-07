"use client";
import {customerContact} from "@/lib/customer-contact";
import { useCallback, useEffect, useRef, useState } from "react";
import DeliveryTools from "./delivery-tools";
import {safeTrackingUrl,type Delivery} from "@/lib/order-delivery";
import ConfirmationTools from "./confirmation-tools";
import {followUpDue,moroccoDate,type Confirmation} from "@/lib/order-confirmation";
import CustomerHistory,{type HistoryResponse} from "./customer-history";
import {type CustomerOrder} from "@/lib/customer-history";
export type Order=CustomerOrder;
const statuses=["Nouveau","À confirmer","Confirmé","En préparation","Expédié","Livré","Annulé"];
const filters=["Toutes","Nouveau","En cours","Expédié","Livré","Annulé","À relancer","Sans réponse","Refusés / retours"];
export default function OrdersClient({initialOrders,unavailable}:{initialOrders:Order[];unavailable:boolean}){
 const [orders,setOrders]=useState(initialOrders),[filter,setFilter]=useState("Toutes"),[connection,setConnection]=useState(unavailable?"Erreur de connexion":""),[fresh,setFresh]=useState(0),[saving,setSaving]=useState<Record<string,string>>({});
 const [expanded,setExpanded]=useState<Record<string,boolean>>({}),[historyRevision,setHistoryRevision]=useState(0);
 const [confirmationExpanded,setConfirmationExpanded]=useState<Record<string,boolean>>({}),[today,setToday]=useState(()=>moroccoDate());
 const [deliveryExpanded,setDeliveryExpanded]=useState<Record<string,boolean>>({});
 const dirtyDeliveries=useRef(new Set<string>());
 function toggleDelivery(id:string){if(deliveryExpanded[id]&&dirtyDeliveries.current.has(id)&&!window.confirm("Fermer le suivi livraison sans enregistrer vos modifications ?"))return;dirtyDeliveries.current.delete(id);setDeliveryExpanded(s=>({...s,[id]:!s[id]}));}
 function deliverySaved(id:string,delivery:Delivery){setOrders(list=>list.map(order=>order.id===id?{...order,delivery}:order));}
 const dirtyFollowups=useRef(new Set<string>());
 function toggleConfirmation(id:string){if(confirmationExpanded[id]&&dirtyFollowups.current.has(id)&&!window.confirm("Fermer ce suivi sans enregistrer vos modifications ?"))return;dirtyFollowups.current.delete(id);setConfirmationExpanded(s=>({...s,[id]:!s[id]}));}
 function selectFilter(value:string){if(savingIds.current.size)return;if((dirtyFollowups.current.size||dirtyDeliveries.current.size)&&!window.confirm("Des modifications ne sont pas enregistrées. Changer de filtre et abandonner ces modifications ?"))return;dirtyFollowups.current.clear();dirtyDeliveries.current.clear();setConfirmationExpanded({});setDeliveryExpanded({});setFilter(value);setFresh(0);}
 function confirmationSaved(id:string,confirmation:Confirmation){setOrders(list=>list.map(order=>order.id===id?{...order,confirmation}:order));}
 const snapshot=useRef(JSON.stringify(initialOrders));
 const known=useRef(new Set(initialOrders.map(o=>o.id))),busy=useRef(false),savingIds=useRef(new Set<string>());
 const refresh=useCallback(async()=>{
  setToday(moroccoDate());if(busy.current||document.hidden||savingIds.current.size)return;busy.current=true;
  try{const response=await fetch("/api/orders",{cache:"no-store",headers:{Accept:"application/json"}});if(!response.ok)throw new Error("refresh");
   const data=await response.json() as {orders:Order[]};
   if(savingIds.current.size)return;
   const added=data.orders.filter(o=>!known.current.has(o.id));
   if(added.length)setFresh(n=>n+added.length);
   data.orders.forEach(o=>known.current.add(o.id));
   setOrders(previous=>data.orders.map(o=>savingIds.current.has(o.id)?previous.find(p=>p.id===o.id)||o:o));
   setConnection("");const next=JSON.stringify(data.orders);if(next!==snapshot.current){snapshot.current=next;setHistoryRevision(n=>n+1);}
  }catch{setConnection("Connexion interrompue. Nouvelle tentative automatique.")}finally{busy.current=false;}
 },[]);
 useEffect(()=>{const timer=setInterval(refresh,8000);const onVisible=()=>{if(!document.hidden)void refresh()};document.addEventListener("visibilitychange",onVisible);return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",onVisible)}},[refresh]);
 async function changeStatus(order:Order,status:string){if(status===order.status||savingIds.current.has(order.id))return;
  savingIds.current.add(order.id);setSaving(s=>({...s,[order.id]:"Enregistrement…"}));
  try{
   if(['Confirmé','En préparation','Expédié'].includes(status)){
    const response=await fetch('/api/orders/customer?'+new URLSearchParams({orderId:order.id,targetStatus:'Expédié'}),{cache:'no-store'});
    if(!response.ok)throw Error('Échec de vérification des doublons. Réessayez.');
    const history=await response.json() as HistoryResponse;
    if(history.duplicates.length&&!window.confirm(`Doublon possible avec ${history.duplicates.map(o=>'#'+o.id.slice(0,8)).join(', ')} : même numéro, produit, option, quantité et total dans les 48 heures. Passer cette commande au statut « ${status} » malgré cet avertissement ?`)){setExpanded(s=>({...s,[order.id]:true}));setSaving(s=>({...s,[order.id]:''}));return;}
   }
   setOrders(list=>list.map(o=>o.id===order.id?{...o,status}:o));
   const body=new FormData();body.set("id",order.id);body.set("status",status);
   const response=await fetch("/api/orders/status",{method:"POST",body,headers:{Accept:"application/json"}});if(!response.ok){const data=await response.json() as {error?:string};throw new Error(data.error||"Échec. Réessayez.");}
   setHistoryRevision(n=>n+1);setSaving(s=>({...s,[order.id]:"Enregistré"}));setTimeout(()=>setSaving(s=>({...s,[order.id]:""})),2400);
  }catch(error){setOrders(list=>list.map(o=>o.id===order.id?{...o,status:order.status}:o));setSaving(s=>({...s,[order.id]:error instanceof Error?error.message:"Échec. Réessayez."}));}
  finally{savingIds.current.delete(order.id);void refresh();}
 }
 async function deleteOrder(order:Order){
  if(savingIds.current.has(order.id)||!window.confirm(`Supprimer définitivement la commande #${order.id.slice(0,8)} de ${order.name} ? Cette action est irréversible.`))return;
  savingIds.current.add(order.id);setSaving(s=>({...s,[order.id]:"Suppression…"}));
  try{
   const response=await fetch("/api/orders",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:order.id})});
   if(!response.ok)throw new Error("delete");
   setOrders(list=>list.filter(o=>o.id!==order.id));setHistoryRevision(n=>n+1);
  }catch{setSaving(s=>({...s,[order.id]:"Échec de suppression. Réessayez."}));}
  finally{savingIds.current.delete(order.id);void refresh();}
 }
 const count=(status:string)=>orders.filter(o=>o.status===status).length;
 const visible=orders.filter(o=>filter==="Toutes"||o.status===filter||(filter==="Refusés / retours"&&!!o.delivery?.incident)||(filter==="À relancer"&&followUpDue(o,today))||(filter==="Sans réponse"&&o.confirmation?.outcome==="Sans réponse"&&["Nouveau","À confirmer","Confirmé","En préparation"].includes(o.status))||(filter==="En cours"&&["À confirmer","Confirmé","En préparation"].includes(o.status)));
 return <><div className="live-line"><span className="live-badge"><span className="live-dot"/>Mise à jour automatique</span>{connection&&<span role="status" className="connection-error">{connection}</span>}{fresh>0&&<button className="fresh" onClick={()=>selectFilter("Toutes")}>{fresh} nouvelle{fresh>1?"s":""} commande{fresh>1?"s":""}</button>}</div>
 <section className="stats"><div><strong>{orders.length}</strong><span>Total des commandes</span></div><div><strong>{count("Nouveau")}</strong><span>Nouvelles</span></div><div><strong>{count("Expédié")}</strong><span>Expédiées</span></div><div><strong>{count("Livré")}</strong><span>Livrées</span></div></section>
 <section className="orders"><div className="orders-title"><div><h2>Commandes</h2><span>{visible.length} affichée{visible.length>1?"s":""}</span></div><div className="order-tools"><a className="manual-add-link" href="/dashboard/orders/new">+ Ajouter une commande</a><button className="refresh-button" onClick={()=>void refresh()}>Actualiser</button></div></div>
 <div className="filters" role="group" aria-label="Filtrer par statut">{filters.map(f=><button key={f} className={filter===f?"active":""} onClick={()=>selectFilter(f)} aria-pressed={filter===f}>{f}</button>)}</div>
 {visible.length===0?<div className="empty"><h2>{orders.length?"Aucune commande dans ce statut":"Aucune commande pour le moment"}</h2><p>{orders.length?"Essayez un autre filtre.":"Les commandes passées sur la boutique apparaîtront ici automatiquement."}</p></div>:<div className="order-list">{visible.map(o=>{const contact=customerContact(o.phone,o.currency);return <article className="order-card" key={o.id} aria-label={`Commande ${o.id.slice(0,8)} de ${o.name}`}><header className="order-card-header"><div><strong>#{o.id.slice(0,8)}</strong><time dateTime={o.created_at}>{new Date(o.created_at).toLocaleString("fr-MA",{timeZone:"Africa/Casablanca",dateStyle:"medium",timeStyle:"short"})}</time></div><span className={`status-pill ${o.status==="Annulé"?"cancelled":o.status==="Livré"?"delivered":o.status==="Nouveau"?"new":"progress"}`}>{o.status}</span></header><div className="order-card-body"><section className="order-card-customer"><h3>Client</h3><strong>{o.name}</strong><span dir="ltr">{o.phone}</span><div className="customer-contact">{contact.call&&<a className="contact-call" href={contact.call} aria-label={`Appeler ${o.name}`}>Appeler</a>}{contact.whatsapp&&<button type="button" className="contact-whatsapp" onClick={()=>setConfirmationExpanded(s=>({...s,[o.id]:true}))} aria-expanded={!!confirmationExpanded[o.id]} aria-controls={"confirmation-"+o.id} aria-label={`Préparer un message WhatsApp pour ${o.name}`}>WhatsApp</button>}</div></section><section><h3>Livraison</h3><strong dir="auto">{o.city}</strong><p dir="auto">{o.address}</p>{o.delivery&&<div className="delivery-card-details">{o.delivery.courier&&<span>Transporteur : {o.delivery.courier}</span>}{o.delivery.tracking_number&&<span dir="ltr">Suivi : {o.delivery.tracking_number}</span>}{safeTrackingUrl(o.delivery.tracking_url)&&<a href={safeTrackingUrl(o.delivery.tracking_url)!} target="_blank" rel="noopener noreferrer">Suivre le colis</a>}{o.delivery.incident&&<span className="delivery-incident">{o.delivery.incident}</span>}{o.delivery.reason&&<p dir="auto">{o.delivery.reason}</p>}</div>}</section><section className="order-card-product"><h3>Produit</h3><strong>{o.product_name}</strong><span>{o.currency==="LYD"?"Libye":"Maroc"}</span><div className="order-card-summary"><div><small>Quantité</small><strong>{o.quantity}</strong></div><div><small>Total</small><strong>{(o.total_cents/100).toFixed(2)} {o.currency==="LYD"?"LYD":"DH"}</strong></div></div></section><section className="order-card-actions"><h3>Gestion</h3><label className="status-action"><span>Statut de la commande</span><select value={o.status} disabled={saving[o.id]==="Enregistrement…"||saving[o.id]==="Suppression…"} onChange={e=>void changeStatus(o,e.target.value)} aria-label={`Changer le statut de la commande de ${o.name}`}>{statuses.map(status=><option key={status} value={status}>{status}</option>)}</select></label><small className={saving[o.id]?.startsWith("Échec")?"save-failed":"save-message"} role="status">{saving[o.id]}</small><button className="delete-button" disabled={savingIds.current.has(o.id)} onClick={()=>void deleteOrder(o)} aria-label={`Supprimer la commande de ${o.name}`}>{saving[o.id]==="Suppression…"?"Suppression…":"Supprimer"}</button></section></div><div className="customer-review">{!!o.customer?.duplicateIds.length&&<p className="duplicate-warning">Doublon possible avec {o.customer.duplicateIds.map(id=>'#'+id.slice(0,8)).join(', ')} · Même produit, option, quantité et total dans les 48 h. Vérifiez avant d’expédier.</p>}<div className="customer-review-top"><button type="button" className="confirmation-toggle" disabled={savingIds.current.has(o.id)} aria-expanded={!!deliveryExpanded[o.id]} aria-controls={"delivery-"+o.id} onClick={()=>toggleDelivery(o.id)}>{deliveryExpanded[o.id]?"Masquer la livraison":"Suivi livraison"}</button><button type="button" className="confirmation-toggle" disabled={savingIds.current.has(o.id)} aria-expanded={!!confirmationExpanded[o.id]} aria-controls={"confirmation-"+o.id} onClick={()=>toggleConfirmation(o.id)}>{confirmationExpanded[o.id]?"Masquer le suivi":"Confirmation et suivi"}</button>{o.confirmation?.outcome&&<span className="followup-badge">{o.confirmation.outcome}</span>}{o.confirmation?.follow_up_date&&<span className={`followup-badge ${followUpDue(o,today)?"due":""}`}>{followUpDue(o,today)?"À relancer · ":"Relance · "}{o.confirmation.follow_up_date.split("-").reverse().join("/")}</span>}<button type="button" className="history-toggle" aria-expanded={!!expanded[o.id]} aria-controls={'history-'+o.id} onClick={()=>setExpanded(s=>({...s,[o.id]:!s[o.id]}))}>{expanded[o.id]?'Masquer l’historique':'Historique du client'}{o.customer?` (${o.customer.otherOrders})`:''}</button>{!!o.customer?.otherOrders&&<span>{o.customer.delivered} livrée(s) · {o.customer.cancelled} annulée(s)</span>}</div>{deliveryExpanded[o.id]&&<div id={"delivery-"+o.id}><DeliveryTools order={o} locked={savingIds.current.has(o.id)} onBusy={working=>{if(working){savingIds.current.add(o.id);setSaving(s=>({...s,[o.id]:"Enregistrement…"}));}else{savingIds.current.delete(o.id);setSaving(s=>({...s,[o.id]:""}));void refresh();}}} onSaved={delivery=>deliverySaved(o.id,delivery)} onDirty={dirty=>{if(dirty)dirtyDeliveries.current.add(o.id);else dirtyDeliveries.current.delete(o.id);}}/></div>}{confirmationExpanded[o.id]&&<div id={"confirmation-"+o.id}><ConfirmationTools order={o} locked={savingIds.current.has(o.id)} onBusy={working=>{if(working){savingIds.current.add(o.id);setSaving(s=>({...s,[o.id]:"Enregistrement…"}));}else{savingIds.current.delete(o.id);setSaving(s=>({...s,[o.id]:""}));void refresh();}}} onSaved={confirmation=>confirmationSaved(o.id,confirmation)} onDirty={dirty=>{if(dirty)dirtyFollowups.current.add(o.id);else dirtyFollowups.current.delete(o.id);}}/></div>}{expanded[o.id]&&<div id={'history-'+o.id}><CustomerHistory orderId={o.id} revision={historyRevision}/></div>}</div></article>;})}</div>}

 </section></>
}
