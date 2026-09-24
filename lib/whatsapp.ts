type OrderPayload = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  total_cents: number;
  language: string;
  status: string;
};

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return value.trim();
  return `whatsapp:+${digits}`;
}

export async function sendOrderToWhatsApp(order: OrderPayload): Promise<boolean> {
  const to = process.env.WHATSAPP_TO;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!to || !accountSid || !authToken || !from) {
    console.warn("WhatsApp order notification is not configured.");
    return false;
  }

  const { default: twilio } = await import("twilio");
  const client = twilio(accountSid, authToken);

  const message = [
    "Nouvelle commande",
    `ID: ${order.id}`,
    `Client: ${order.name}`,
    `Téléphone: ${order.phone}`,
    `Ville: ${order.city}`,
    `Adresse: ${order.address}`,
    `Quantité: ${order.quantity}`,
    `Total: ${(order.total_cents / 100).toFixed(2)} DH`,
    `Langue: ${order.language === "ar" ? "AR" : "FR"}`,
    `Statut: ${order.status}`,
  ].join("\n");

  try {
    const result = await client.messages.create({
      from: normalizeWhatsAppNumber(from),
      to: normalizeWhatsAppNumber(to),
      body: message,
    });
    return Boolean(result.sid);
  } catch (error) {
    console.error("Failed to send WhatsApp notification", error);
    return false;
  }
}
