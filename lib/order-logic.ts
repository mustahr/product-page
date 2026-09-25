export const PRODUCT = {
  id: "charger-voiture-4-en-1",
  name: "Chargeur voiture 4-en-1 avec câbles rétractables",
  currency: "MAD",
  unitPriceCents: 17800,
  extraUnitDiscountCents: 1780,
} as const;

export type OrderInput = {
  name: string;
  phone: string;
  normalizedPhone: string;
  city: string;
  address: string;
  quantity: number;
  language: "fr" | "ar";
  idempotencyKey: string;
};
export type FieldErrors = Record<string, string>;

function clean(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f-\u009f<>]/g, " ").trim().replace(/\s+/g, " ").slice(0, max)
    : "";
}

export function normalizeMoroccanPhone(raw: string): string | null {
  const compact = raw.replace(/[\s().-]/g, "");
  if (/^0[67]\d{8}$/.test(compact)) return `+212${compact.slice(1)}`;
  if (/^\+212[67]\d{8}$/.test(compact)) return compact;
  if (/^212[67]\d{8}$/.test(compact)) return `+${compact}`;
  return null;
}

export function validateOrder(form: FormData): { input?: OrderInput; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};
  const name = clean(form.get("name"), 100);
  const phone = clean(form.get("phone"), 25);
  const city = clean(form.get("city"), 80);
  const address = clean(form.get("address"), 250);
  const quantityRaw = clean(form.get("quantity"), 3);
  const quantity = Number(quantityRaw);
  const normalizedPhone = normalizeMoroccanPhone(phone);
  const idempotencyKey = clean(form.get("orderId"), 80) || crypto.randomUUID();
  if (!name) fieldErrors.name = "required";
  if (!normalizedPhone) fieldErrors.phone = "invalid";
  if (!city) fieldErrors.city = "required";
  if (!address) fieldErrors.address = "required";
  if (!/^\d{1,2}$/.test(quantityRaw) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) fieldErrors.quantity = "invalid";
  if (form.get("productId") !== PRODUCT.id || clean(form.get("variant"), 100)) fieldErrors.product = "invalid";
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(idempotencyKey)) fieldErrors.orderId = "invalid";
  if (Object.keys(fieldErrors).length || !normalizedPhone) return { fieldErrors };
  return { fieldErrors, input: { name, phone, normalizedPhone, city, address, quantity, language: form.get("language") === "ar" ? "ar" : "fr", idempotencyKey } };
}

export function priceFor(quantity: number) {
  const subtotalCents = PRODUCT.unitPriceCents * quantity;
  const discountCents = PRODUCT.extraUnitDiscountCents * (quantity - 1);
  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents };
}
