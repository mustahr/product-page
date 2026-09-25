const ORDER_URL = '/api/orders';
const UNIT_PRICE = 178;
const UNIT_CENTS = UNIT_PRICE * 100;
const ar = {
  'Livraison': 'توصيل', 'GRATUITE': 'مجاني', 'partout au Maroc · Paiement à la livraison': 'في جميع أنحاء المغرب · الدفع عند الاستلام',
  'Voir les détails': 'شاهد التفاصيل', 'Langue': 'اللغة', 'Navigation principale': 'التنقل الرئيسي',
  '✓ Pratique pour tous vos trajets': '✓ عملي في كل رحلاتك',
  'Un seul chargeur.': 'شاحن واحد.', 'Quatre solutions.': 'أربع مزايا.',
  'Rechargez plusieurs appareils dans la voiture sans câbles emmêlés grâce aux deux câbles rétractables et aux ports USB-A et USB-C intégrés.': 'اشحن عدة أجهزة في السيارة دون تشابك الأسلاك، بفضل الكابلين القابلين للسحب ومنفذي USB-A وUSB-C.',
  'Câbles rétractables Type-C et compatible iPhone': 'كابلان قابلان للسحب: Type-C وموصل متوافق مع iPhone',
  'Ports USB-A et USB-C pour plus de flexibilité': 'منفذا USB-A وUSB-C لمزيد من المرونة',
  'Éclairage décoratif effet ciel étoilé': 'إضاءة زخرفية بتأثير السماء المرصعة بالنجوم',
  'Commander maintenant': 'اطلب الآن', 'Livraison gratuite': 'توصيل مجاني', 'Paiement à la livraison': 'الدفع عند الاستلام',
  '−10 % sur chaque chargeur supplémentaire': 'خصم 10٪ على كل شاحن إضافي',
  '🚚 Livraison gratuite': '🚚 توصيل مجاني', '💵 Paiement à la livraison': '💵 الدفع عند الاستلام',
  'Plus de câbles dispersés': 'وداعاً لفوضى الأسلاك', 'Livraison incluse': 'التوصيل مشمول',
  'Avantages de commande': 'مزايا الطلب', 'Partout au Maroc': 'في جميع أنحاء المغرب', 'Payez à la réception': 'ادفع عند الاستلام',
  'Confirmation de commande': 'تأكيد الطلب', 'Coordonnées vérifiées': 'التحقق من بيانات الاتصال',
  'Démonstration réelle': 'عرض عملي', 'Voyez le chargeur en action': 'شاهد الشاحن أثناء الاستعمال',
  'Découvrez son format compact, ses connexions intégrées et l’effet lumineux directement dans une voiture.': 'اكتشف حجمه الصغير ووصلاته المدمجة وإضاءته داخل السيارة.',
  'Deux câbles rétractables toujours disponibles': 'كابلان قابلان للسحب في متناول اليد',
  'Recharge de plusieurs appareils': 'شحن عدة أجهزة', 'Éclairage décoratif pour l’habitacle': 'إضاءة زخرفية لمقصورة السيارة',
  'Je le veux à 178 DH': 'أريده بـ178 درهم', '▶ Démonstration en 17 secondes': '▶ عرض في 17 ثانية',
  'Pensé pour la route': 'مصمم للسيارة', 'Moins de désordre, plus de charge': 'أسلاك أقل، شحن أكثر',
  'Une solution compacte pour les conducteurs et passagers qui utilisent plusieurs appareils.': 'حل صغير الحجم للسائقين والركاب الذين يستخدمون عدة أجهزة.',
  'Câbles toujours à portée': 'الكابلات في متناول اليد',
  'Tirez uniquement la longueur nécessaire, puis rangez le câble dans le chargeur.': 'اسحب الطول الذي تحتاجه فقط، ثم أعد الكابل إلى الشاحن.',
  'Plusieurs connexions': 'وصلات متعددة', 'Utilisez les câbles intégrés ou branchez votre propre câble sur les ports USB-A et USB-C.': 'استخدم الكابلين المدمجين أو صِل كابلك بمنفذي USB-A وUSB-C.',
  'Ambiance ciel étoilé': 'أجواء السماء المرصعة بالنجوم', 'L’éclairage décoratif apporte une touche moderne à l’intérieur de votre voiture.': 'تضيف الإضاءة الزخرفية لمسة عصرية إلى داخل سيارتك.',
  'Tout intégré': 'كل شيء مدمج', 'Une station de charge compacte dans votre voiture': 'محطة شحن صغيرة داخل سيارتك',
  'Deux câbles rétractables': 'كابلان قابلان للسحب', 'Type-C et connecteur compatible iPhone pour les appareils les plus courants.': 'Type-C وموصل متوافق مع iPhone للأجهزة الشائعة.',
  'Deux ports supplémentaires permettent d’utiliser vos propres câbles.': 'منفذان إضافيان لاستخدام الكابلات الخاصة بك.',
  'Format adapté à l’allume-cigare': 'تصميم مناسب لمقبس ولاعة السيارة', 'Une installation directe et un ensemble plus ordonné pendant les déplacements.': 'تركيب مباشر وتنظيم أفضل أثناء التنقل.',
  'Tête orientable à 180°': 'رأس قابل للتعديل بزاوية 180°',
  'Orientez la tête du chargeur d’un côté à l’autre pour accéder plus facilement aux connexions, selon la position des appareils dans la voiture.': 'وجّه رأس الشاحن من جانب إلى آخر لتسهيل الوصول إلى الوصلات حسب موضع الأجهزة في السيارة.',
  'En situation': 'أثناء الاستعمال', 'Conçu pour accompagner vos trajets': 'صُمم ليرافق رحلاتك',
  'Recharge, rangement des câbles et éclairage décoratif réunis dans un seul accessoire.': 'شحن وتنظيم للكابلات وإضاءة زخرفية في ملحق واحد.',
  'Offre actuelle': 'العرض الحالي', 'Chargeur voiture 4-en-1': 'شاحن سيارة 4 في 1',
  'Câbles rétractables, USB-A, USB-C et éclairage décoratif.': 'كابلات قابلة للسحب ومنفذا USB-A وUSB-C وإضاءة زخرفية.',
  'l’unité': 'للقطعة', 'Quantité sélectionnée : 1': 'الكمية المختارة: 1',
  'Informations de livraison': 'معلومات التوصيل', 'Nom complet': 'الاسم الكامل', 'Téléphone': 'رقم الهاتف', 'Ville': 'المدينة', 'Adresse': 'العنوان', 'Quantité': 'الكمية',
  'Votre nom complet': 'اسمك الكامل', 'Votre ville': 'مدينتك', 'Quartier, rue, résidence...': 'الحي، الشارع، الإقامة...',
  'Diminuer la quantité': 'تقليل الكمية', 'Augmenter la quantité': 'زيادة الكمية',
  'Le premier à 178 DH, puis −10 % sur chaque chargeur supplémentaire.': 'الشاحن الأول بـ178 درهماً، ثم خصم 10٪ على كل شاحن إضافي.',
  'Total : 178 DH': 'المجموع: 178 درهم', 'Confirmer ma commande': 'تأكيد طلبي',
  'Après l’enregistrement, vous verrez une confirmation. Notre équipe vous contactera bientôt.': 'بعد تسجيل طلبك ستظهر رسالة تأكيد. سيتواصل معك فريقنا قريباً.',
  'Questions fréquentes': 'الأسئلة الشائعة', 'Avant de commander': 'قبل الطلب',
  'Quels connecteurs sont inclus ?': 'ما الوصلات المتوفرة؟',
  'Le chargeur comprend deux câbles rétractables : un Type-C et un connecteur compatible iPhone, ainsi que des ports USB-A et USB-C.': 'يضم الشاحن كابلين قابلين للسحب: Type-C وموصلاً متوافقاً مع iPhone، إضافة إلى منفذي USB-A وUSB-C.',
  'Puis-je charger plusieurs appareils ?': 'هل يمكن شحن عدة أجهزة؟',
  'Le produit est conçu avec plusieurs connexions afin de permettre la recharge de plusieurs appareils compatibles.': 'صُمم المنتج بوصلات متعددة لشحن عدة أجهزة متوافقة.',
  'Comment se fait le paiement ?': 'كيف يتم الدفع؟', 'Le paiement est effectué à la livraison.': 'يتم الدفع عند الاستلام.',
  'La livraison est-elle payante ?': 'هل التوصيل مدفوع؟', 'Non, l’offre affichée inclut la livraison gratuite au Maroc.': 'لا، يشمل هذا العرض التوصيل المجاني داخل المغرب.',
  'Chargeur voiture 4-en-1 · Livraison au Maroc': 'شاحن سيارة 4 في 1 · توصيل داخل المغرب', 'Commander': 'اطلب الآن',
  'Démonstration du chargeur voiture 4-en-1': 'عرض شاحن السيارة 4 في 1',
  'Chargeur de voiture 4-en-1 avec câbles rétractables': 'شاحن سيارة 4 في 1 بكابلات قابلة للسحب',
  'Chargeur 4-en-1 installé dans une voiture': 'شاحن 4 في 1 داخل سيارة',
  'Chargeur voiture 4-en-1 avec deux câbles rétractables et ports USB-C et USB-A': 'شاحن سيارة 4 في 1 بكابلين قابلين للسحب ومنفذي USB-C وUSB-A',
  'Ports et câbles du chargeur': 'منافذ وكابلات الشاحن', 'Détail du chargeur de voiture': 'تفاصيل شاحن السيارة',
  'Éclairage effet ciel étoilé dans la voiture': 'إضاءة بتأثير السماء المرصعة بالنجوم داخل السيارة'
};
const sourceTexts = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  const original = node.nodeValue.trim();
  if (Object.hasOwn(ar, original)) sourceTexts.push({ node, original, leading: node.nodeValue.match(/^\s*/)[0], trailing: node.nodeValue.match(/\s*$/)[0] });
}
const sourceAttrs = [];
for (const el of document.querySelectorAll('[alt], [aria-label], [placeholder]')) {
  for (const attr of ['alt', 'aria-label', 'placeholder']) {
    const original = el.getAttribute(attr);
    if (original && Object.hasOwn(ar, original)) sourceAttrs.push({ el, attr, original });
  }
}
const quantityInput = document.getElementById('quantity');
const decreaseQuantity = document.getElementById('decreaseQuantity');
let currentLanguage = 'fr';
function words(fr, arabic) { return currentLanguage === 'ar' ? arabic : fr; }
function money(cents) { return (cents / 100).toFixed(cents % 100 ? 2 : 0).replace('.', ',') + words(' DH', ' درهم'); }
function prices(quantity) {
  const subtotal = quantity * UNIT_CENTS;
  const discount = Math.max(0, quantity - 1) * Math.round(UNIT_CENTS * 0.1);
  return { subtotal, discount, total: subtotal - discount };
}
function updateQuantity() {
  if (!quantityInput.validity.valid) return;
  const quantity = Number(quantityInput.value);
  decreaseQuantity.disabled = quantity <= 1;
  document.getElementById('selectedQuantity').textContent = words('Quantité sélectionnée : ', 'الكمية المختارة: ') + quantity;
  const { discount, total } = prices(quantity);
  const discountLine = document.getElementById('discountLine');
  discountLine.hidden = discount === 0;
  discountLine.textContent = words('Réduction sur les articles supplémentaires : −', 'خصم الشواحن الإضافية: −') + money(discount);
  document.getElementById('orderTotal').textContent = words('Total : ', 'المجموع: ') + money(total);
}
function setLanguage(lang) {
  currentLanguage = lang === 'ar' ? 'ar' : 'fr';
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  for (const { node, original, leading, trailing } of sourceTexts) node.nodeValue = leading + (currentLanguage === 'ar' ? ar[original] : original) + trailing;
  for (const { el, attr, original } of sourceAttrs) el.setAttribute(attr, currentLanguage === 'ar' ? ar[original] : original);
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === currentLanguage)));
  document.querySelector('title').textContent = words('Chargeur Voiture 4-en-1 | Livraison Gratuite au Maroc', 'شاحن سيارة 4 في 1 | توصيل مجاني في المغرب');
  document.querySelector('meta[name="description"]').content = words('Chargeur voiture 4-en-1 avec câbles rétractables Type-C et compatible iPhone, ports USB-A et USB-C, à 178 DH avec livraison gratuite au Maroc.', 'شاحن سيارة 4 في 1 بكابلين قابلين للسحب ومنفذي USB-A وUSB-C بسعر 178 درهماً مع توصيل مجاني داخل المغرب.');
  updateQuantity();
  try { localStorage.setItem('autocharge-language', currentLanguage); } catch (_) {}
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
quantityInput.addEventListener('input', updateQuantity);
function changeQuantity(amount) {
  const current = quantityInput.validity.valid ? Number(quantityInput.value) : 1;
  quantityInput.value = Math.max(1, current + amount);
  quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
}
decreaseQuantity.addEventListener('click', () => changeQuantity(-1));
document.getElementById('increaseQuantity').addEventListener('click', () => changeQuantity(1));
const orderForm = document.getElementById('orderForm');
const orderStatus = document.getElementById('success');
const submitButton = orderForm.querySelector('button[type="submit"]');
const orderFields = ['name', 'phone', 'city', 'address', 'quantity'];
function fieldMessage(key, issue) {
  if (issue === 'required') return words('Ce champ est obligatoire.', 'هذا الحقل مطلوب.');
  if (key === 'phone') return words('Saisissez un numéro marocain commençant par 06 ou 07, ou +2126 / +2127.', 'أدخل رقماً مغربياً يبدأ بـ 06 أو 07 أو ‎+2126 / ‎+2127.');
  return words('Choisissez une quantité entre 1 et 99.', 'اختر كمية بين 1 و99.');
}
function setFieldError(key, issue) {
  const input = document.getElementById(key);
  const error = document.getElementById(key + '-error');
  error.textContent = issue ? fieldMessage(key, issue) : '';
  input.setAttribute('aria-invalid', issue ? 'true' : 'false');
}
for (const key of orderFields) {
  const input = document.getElementById(key);
  const error = document.createElement('p');
  error.id = key + '-error';
  error.className = 'field-error';
  error.setAttribute('aria-live', 'polite');
  input.closest('.field').appendChild(error);
  input.setAttribute('aria-describedby', error.id);
  input.addEventListener('input', () => setFieldError(key, null));
}
function validateOrder() {
  const errors = {};
  for (const key of ['name', 'city', 'address']) if (!document.getElementById(key).value.trim()) errors[key] = 'required';
  const phone = document.getElementById('phone').value.replace(/[\s().-]/g, '');
  if (!/^(?:0[67]\d{8}|\+212[67]\d{8}|212[67]\d{8})$/.test(phone)) errors.phone = 'invalid';
  const quantity = Number(quantityInput.value);
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) errors.quantity = 'invalid';
  for (const key of orderFields) setFieldError(key, errors[key]);
  if (Object.keys(errors).length) document.getElementById(Object.keys(errors)[0]).focus();
  return Object.keys(errors).length === 0;
}
orderForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  orderStatus.style.display = 'none';
  if (!validateOrder()) return;
  document.getElementById('orderLanguage').value = currentLanguage;
  const idField = document.getElementById('orderId');
  if (!idField.value && window.crypto && crypto.randomUUID) idField.value = crypto.randomUUID();
  submitButton.disabled = true;
  submitButton.firstChild.nodeValue = words('Envoi de la commande... ', 'جارٍ إرسال الطلب... ');
  try {
    const response = await fetch(ORDER_URL, {method: 'POST', body: new FormData(orderForm), headers: {Accept: 'application/json'}});
    const result = await response.json();
    if (response.ok && result.ok) {
      orderStatus.classList.remove('is-error');
      orderStatus.textContent = words(`Commande confirmée ! Votre commande #${result.reference} a bien été reçue. Nous allons vous contacter pour la confirmer.`, `تم تأكيد الطلب! توصلنا بطلبك رقم #${result.reference}. سنتواصل معك لتأكيده.`);
      orderForm.classList.add('is-complete');
      orderStatus.style.display = 'block';
      orderStatus.scrollIntoView({behavior: 'smooth', block: 'center'});
      return;
    }
    if (result.fieldErrors) {
      for (const key of orderFields) setFieldError(key, result.fieldErrors[key]);
      const first = Object.keys(result.fieldErrors)[0];
      if (first) document.getElementById(first).focus();
    } else throw new Error('storage');
  } catch (_) {
    orderStatus.classList.add('is-error');
    orderStatus.textContent = words('La commande n’a pas pu être transmise. Réessayez dans un instant.', 'تعذر إرسال الطلب. يرجى المحاولة بعد قليل.');
    orderStatus.style.display = 'block';
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.nodeValue = words('Confirmer ma commande ', 'تأكيد طلبي ');
  }
});
let savedLanguage = 'fr';
try { savedLanguage = localStorage.getItem('autocharge-language') || 'fr'; } catch (_) {}
setLanguage(savedLanguage);
