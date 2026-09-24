"use client";
import { useCallback, useEffect, useRef, useState } from "react";
export type Order={id:string;created_at:string;name:string;phone:string;city:string;address:string;quantity:number;total_cents:number;status:string};
const statuses=["Nouveau","À confirmer","Confirmé","En préparation","Expédié","Livré","Annulé"];
const filters=["Toutes","Nouveau","En cours","Expédié","Livré","Annulé"];
export default function OrdersClient({initialOrders,unavailable}:{initialOrders:Order[];unavailable:boolean}){
 const [orders,setOrders]=useState(initialOrders),[filter,setFilter]=useState("Toutes"),[connection,setConnection]=useState(unavailable?"Erreur de connexion":""),[fresh,setFresh]=useState(0),[saving,setSaving]=useState<Record<string,string>>({});
 const known=useRef(new Set(initialOrders.map(o=>o.id))),busy=useRef(false),savingIds=useRef(new Set<string>());
 const refresh=useCallback(async()=>{
  if(busy.current||document.hidden)return;busy.current=true;
  try{const response=await fetch("/api/orders",{cache:"no-store",headers:{Accept:"application/json"}});if(!response.ok)throw new Error("refresh");
   const data=await response.json() as {orders:Order[]};
   const added=data.orders.filter(o=>!known.current.has(o.id));
   if(added.length)setFresh(n=>n+added.length);
   data.orders.forEach(o=>known.current.add(o.id));
   setOrders(previous=>data.orders.map(o=>savingIds.current.has(o.id)?previous.find(p=>p.id===o.id)||o:o));
   setConnection("");
  }catch{setConnection("Connexion interrompue. Nouvelle tentative automatique.")}finally{busy.current=false;}
 },[]);
 useEffect(()=>{const timer=setInterval(refresh,8000);const onVisible=()=>{if(!document.hidden)void refresh()};document.addEventListener("visibilitychange",onVisible);return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",onVisible)}},[refresh]);
 async function changeStatus(order:Order,status:string){if(status===order.status||savingIds.current.has(order.id))return;
  savingIds.current.add(order.id);setSaving(s=>({...s,[order.id]:"Enregistrement…"}));setOrders(list=>list.map(o=>o.id===order.id?{...o,status}:o));
  try{const body=new FormData();body.set("id",order.id);body.set("status",status);
   const response=await fetch("/api/orders/status",{method:"POST",body,headers:{Accept:"application/json"}});if(!response.ok)throw new Error("save");
   setSaving(s=>({...s,[order.id]:"Enregistré"}));setTimeout(()=>setSaving(s=>({...s,[order.id]:""})),2400);
  }catch{setOrders(list=>list.map(o=>o.id===order.id?{...o,status:order.status}:o));setSaving(s=>({...s,[order.id]:"Échec. Réessayez."}));}
  finally{savingIds.current.delete(order.id)}
 }
 const count=(status:string)=>orders.filter(o=>o.status===status).length;
 const visible=orders.filter(o=>filter==="Toutes"||o.status===filter||(filter==="En cours"&&["À confirmer","Confirmé","En préparation"].includes(o.status)));
 return <><div className="live-line"><span className="live-badge"><span className="live-dot"/>Mise à jour automatique</span>{connection&&<span role="status" className="connection-error">{connection}</span>}{fresh>0&&<button className="fresh" onClick={()=>{setFilter("Toutes");setFresh(0)}}>{fresh} nouvelle{fresh>1?"s":""} commande{fresh>1?"s":""}</button>}</div>
 <section className="stats"><div><strong>{orders.length}</strong><span>Total des commandes</span></div><div><strong>{count("Nouveau")}</strong><span>Nouvelles</span></div><div><strong>{count("Expédié")}</strong><span>Expédiées</span></div><div><strong>{count("Livré")}</strong><span>Livrées</span></div></section>
 <section className="orders"><div className="orders-title"><div><h2>Commandes</h2><span>{visible.length} affichée{visible.length>1?"s":""}</span></div><button className="refresh-button" onClick={()=>void refresh()}>Actualiser</button></div>
 <div className="filters" role="group" aria-label="Filtrer par statut">{filters.map(f=><button key={f} className={filter===f?"active":""} onClick={()=>{setFilter(f);setFresh(0)}} aria-pressed={filter===f}>{f}</button>)}</div>
 {visible.length===0?<div className="empty"><h2>{orders.length?"Aucune commande dans ce statut":"Aucune commande pour le moment"}</h2><p>{orders.length?"Essayez un autre filtre.":"Les commandes passées sur la boutique apparaîtront ici automatiquement."}</p></div>:<div className="table-wrap"><table><thead><tr><th>Date</th><th>Client</th><th>Livraison</th><th>Qté</th><th>Total</th><th>Statut</th></tr></thead><tbody>{visible.map(o=><tr key={o.id}><td data-label="Date">{new Date(o.created_at).toLocaleString("fr-MA",{timeZone:"Africa/Casablanca",dateStyle:"medium",timeStyle:"short"})}<small>#{o.id.slice(0,8)}</small></td><td data-label="Client"><strong>{o.name}</strong><a href={`tel:${o.phone}`}>{o.phone}</a></td><td data-label="Livraison"><strong>{o.city}</strong><span>{o.address}</span></td><td data-label="Qté">{o.quantity}</td><td data-label="Total"><strong>{(o.total_cents/100).toFixed(2)} DH</strong></td><td data-label="Statut"><div className="status-cell"><span className={`status-pill ${o.status==="Annulé"?"cancelled":o.status==="Livré"?"delivered":o.status==="Nouveau"?"new":"progress"}`}>{o.status}</span><label className="status-action"><span className="sr-only">Modifier le statut de {o.name}</span><select value={o.status} disabled={!!saving[o.id]&&saving[o.id]==="Enregistrement…"} onChange={e=>void changeStatus(o,e.target.value)} aria-label={`Changer le statut de la commande de ${o.name}`}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></label><small className={saving[o.id]?.startsWith("Échec")?"save-failed":"save-message"} role="status">{saving[o.id]}</small></div></td></tr>)}</tbody></table></div>}
 </section></>
}
