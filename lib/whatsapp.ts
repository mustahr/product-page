import type { Order } from "./order-store";

export async function notifyOwner(order: Order, send: typeof fetch = fetch): Promise<string> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const senderId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = (process.env.WHATSAPP_RECIPIENT_NUMBER || "").replace(/\D/g, "");
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "autocharge_new_order";
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "fr";
  const version = process.env.WHATSAPP_GRAPH_VERSION || "v24.0";
  if (!token || !/^\d+$/.test(senderId || "") || !/^\d{8,15}$/.test(recipient) || !/^v\d+\.0$/.test(version)) {
    throw new Error("WhatsApp configuration incomplete");
  }
  const date = new Intl.DateTimeFormat("fr-MA", { dateStyle: "long", timeZone: "Africa/Casablanca" }).format(new Date(order.createdAt));
  const values = [order.reference, order.productName, String(order.quantity), `${(order.unitPriceCents / 100).toFixed(2)} DH`, `${(order.discountCents / 100).toFixed(2)} DH`, `${(order.totalCents / 100).toFixed(2)} DH`, order.name, order.normalizedPhone, order.city, order.address, date];
  const response = await send(`https://graph.facebook.com/${version}/${senderId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp", to: recipient, type: "template",
      template: { name: templateName, language: { code: language }, components: [{ type: "body", parameters: values.map(text => ({ type: "text", text })) }] },
    }),
    signal: AbortSignal.timeout(12000), cache: "no-store",
  });
  const data = await response.json() as { messages?: { id: string }[]; error?: { code?: number } };
  if (!response.ok || !data.messages?.[0]?.id) {
    console.error("WhatsApp notification rejected", { status: response.status, code: data.error?.code });
    throw new Error("WhatsApp notification rejected");
  }
  return data.messages[0].id;
}
