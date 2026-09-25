import type { OrderInput } from "./order-logic";
import { createOrder, makeOrder, readOrder, updateOrder, type Order } from "./order-store";
import { notifyOwner } from "./whatsapp";

async function deliver(order: Order): Promise<Order> {
  const current = await readOrder(order.id);
  if (!current || current.order.notificationStatus !== "sending") throw new Error("Order notification state unavailable");
  try {
    const messageId = await notifyOwner(current.order);
    const sent: Order = { ...current.order, notificationStatus: "sent", whatsappMessageId: messageId };
    try { await updateOrder(sent, current.etag); }
    catch (error) { console.error("WhatsApp accepted order, status update failed", error); }
    return sent;
  } catch (error) {
    try { await updateOrder({ ...current.order, notificationStatus: "failed" }, current.etag); }
    catch (updateError) { console.error("Order notification failure status update failed", updateError); }
    throw error;
  }
}

export async function submitOrder(input: OrderInput): Promise<Order> {
  const candidate = makeOrder(input);
  const created = await createOrder(candidate);
  if (created) return deliver(candidate);
  const existing = await readOrder(candidate.id);
  if (!existing) throw new Error("Order cannot be read");
  if (existing.order.notificationStatus === "sent") return existing.order;
  if (existing.order.notificationStatus === "sending") throw new Error("Order notification is processing");
  await updateOrder({ ...existing.order, notificationStatus: "sending" }, existing.etag);
  return deliver(existing.order);
}

export async function retryOrder(id: string): Promise<Order> {
  const existing = await readOrder(id);
  if (!existing) throw new Error("Order not found");
  if (existing.order.notificationStatus === "sent") return existing.order;
  if (existing.order.notificationStatus !== "failed") throw new Error("Order notification is processing");
  await updateOrder({ ...existing.order, notificationStatus: "sending" }, existing.etag);
  return deliver(existing.order);
}
