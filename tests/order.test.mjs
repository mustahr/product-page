import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT, normalizeMoroccanPhone, priceFor, validateOrder } from '../lib/order-logic.ts';
import { notifyOwner } from '../lib/whatsapp.ts';

const valid = { productId: PRODUCT.id, orderId: 'a7f9e744-43e5-45e4-9d08-c99d845c7082', name: 'Ahmed Benali', phone: '0612345678', city: 'Marrakech', address: 'Guéliz, Marrakech', quantity: '1' };
function form(changes = {}) { const data = new FormData(); for (const [key, value] of Object.entries({ ...valid, ...changes })) data.set(key, value); return data; }

test('valid Moroccan order, phone normalization, and server-side discount', () => {
  const result = validateOrder(form());
  assert.deepEqual(result.fieldErrors, {});
  assert.equal(result.input.normalizedPhone, '+212612345678');
  assert.equal(normalizeMoroccanPhone('07 12 34 56 78'), '+212712345678');
  assert.equal(normalizeMoroccanPhone('+212 6 12 34 56 78'), '+212612345678');
  assert.equal(priceFor(1).totalCents, 17800);
  assert.equal(priceFor(2).totalCents, 33820);
  assert.equal(priceFor(3).totalCents, 49840);
});
for (const [label, changes, field] of [
  ['missing name', { name: ' ' }, 'name'], ['invalid phone', { phone: '0512345678' }, 'phone'],
  ['missing city', { city: '' }, 'city'], ['missing address', { address: '' }, 'address'],
  ['zero quantity', { quantity: '0' }, 'quantity'], ['fractional quantity', { quantity: '1.5' }, 'quantity'],
  ['unknown product', { productId: 'other' }, 'product'], ['unsupported variant', { variant: 'black' }, 'product'],
]) test(label, () => assert.equal(validateOrder(form(changes)).fieldErrors[field], field === 'name' || field === 'city' || field === 'address' ? 'required' : 'invalid'));

test('input sanitization removes markup control characters', () => {
  const result = validateOrder(form({ name: '<Ahmed>\nBenali' }));
  assert.equal(result.input.name, 'Ahmed Benali');
});

test('WhatsApp template payload uses server order values and handles API rejection', async () => {
  const old = Object.fromEntries(['WHATSAPP_ACCESS_TOKEN','WHATSAPP_PHONE_NUMBER_ID','WHATSAPP_RECIPIENT_NUMBER'].map(key => [key, process.env[key]]));
  Object.assign(process.env, { WHATSAPP_ACCESS_TOKEN: 'test-secret', WHATSAPP_PHONE_NUMBER_ID: '123456', WHATSAPP_RECIPIENT_NUMBER: '212612345678' });
  const order = { reference: 'ORD-A7F9E74443E5', productName: PRODUCT.name, quantity: 2, unitPriceCents: 17800, discountCents: 1780, totalCents: 33820, name: 'Ahmed Benali', normalizedPhone: '+212612345678', city: 'Marrakech', address: 'Guéliz, Marrakech', createdAt: '2026-09-25T12:00:00.000Z' };
  try {
    const id = await notifyOwner(order, async (url, options) => {
      assert.match(url, /graph\.facebook\.com\/v\d+\.0\/123456\/messages/);
      const body = JSON.parse(options.body);
      assert.equal(body.to, '212612345678');
      assert.equal(body.type, 'template');
      assert.equal(body.template.components[0].parameters.length, 11);
      assert.equal(body.template.components[0].parameters[5].text, '338.20 DH');
      return new Response(JSON.stringify({ messages: [{ id: 'wamid.test' }] }), { status: 200 });
    });
    assert.equal(id, 'wamid.test');
    const originalError = console.error; console.error = () => {};
    try { await assert.rejects(notifyOwner(order, async () => new Response(JSON.stringify({ error: { code: 132000 } }), { status: 400 })), /rejected/); }
    finally { console.error = originalError; }
  } finally { for (const [key, value] of Object.entries(old)) value === undefined ? delete process.env[key] : process.env[key] = value; }
});
