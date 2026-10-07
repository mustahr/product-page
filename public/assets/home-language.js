(() => {
  const pairs = [
    ['La collection','المنتجات'],['Comment commander','طريقة الطلب'],['Découvrir','اكتشف المتجر'],
    ['VOTRE BOUTIQUE DU QUOTIDIEN','متجرك لكل يوم'],['Votre quotidien.','حياتك اليومية.'],['En mieux.','بشكل أفضل.'],
    ['Des trouvailles utiles, des idées pratiques et des essentiels à découvrir. Explorez notre sélection et trouvez ce qui vous simplifie la vie.','منتجات مفيدة وأفكار عملية واختيارات تستحق الاكتشاف. تصفّح مجموعتنا واختر ما يجعل يومك أسهل.'],
    ['Découvrir les produits','اكتشف المنتجات'],['Une sélection à découvrir','اختيارات تستحق الاكتشاف'],['À payer à réception','الدفع عند الاستلام'],
    ['À DÉCOUVRIR / MAROC','اكتشف / المغرب'],['À DÉCOUVRIR / LIBYE','اكتشف / ليبيا'],['En route, bien équipé.','كل ما تحتاجه في الطريق.'],
    ['Une préparation plus simple, chaque jour.','تحضير أسهل، كل يوم.'],['PAIEMENT À LA LIVRAISON','الدفع عند الاستلام'],['CONFIRMATION AVANT ENVOI','تأكيد الطلب قبل الإرسال'],['OFFRES MAROC & LIBYE','عروض المغرب وليبيا'],
    ['LA SÉLECTION','اختياراتنا'],['Bien choisis. Bien utiles.','منتجات مختارة. فوائد يومية.'],['Chaque offre possède sa propre page,','لكل منتج صفحته الخاصة،'],['son prix et sa zone de livraison.','وسعره ومنطقة التوصيل الخاصة به.'],
    ['MAROC','المغرب'],['LIBYE · ليبيا','ليبيا'],['ACCESSOIRES AUTO','إكسسوارات السيارة'],['Chargeur voiture 4-en-1','شاحن سيارة 4 في 1'],
    ['Deux câbles rétractables et des ports USB : vos essentiels de recharge réunis dans un seul chargeur.','كابلان قابلان للسحب ومنافذ USB: وصلات الشحن التي تحتاجها في شاحن واحد.'],
    ['DH','درهم'],['Livraison gratuite au Maroc','توصيل مجاني في المغرب'],['Voir le chargeur','اكتشف الشاحن'],['Paiement à la livraison','الدفع عند الاستلام'],
    ['CUISINE & MAISON','المطبخ والمنزل'],['Coupe-légumes 9-en-1','قطاعة خضروات 9 في 1'],
    ['Coupez, râpez et égouttez. Des lames interchangeables avec un récipient et un panier pour préparer vos légumes.','قطّعي، ابشري وصفّي. شفرات قابلة للتبديل مع وعاء وسلة تصفية لتحضير الخضروات.'],
    ['LYD','د.ل'],['Livraison gratuite dans les zones desservies en Libye','توصيل مجاني داخل مناطق التغطية بليبيا'],['Voir le coupe-légumes','اكتشف القطاعة'],
    ['VOTRE COMMANDE, EN 3 ÉTAPES','طلبك في 3 خطوات'],['Choisissez.','اختر.'],['Commandez.','اطلب.'],['Recevez.','استلم.'],
    ['Ouvrez la page du produit','افتح صفحة المنتج'],['Vérifiez les détails, le prix et le pays de livraison de l’offre.','راجع تفاصيل المنتج وسعره وبلد التوصيل.'],
    ['Remplissez le formulaire','املأ بيانات الطلب'],['Indiquez votre nom, téléphone, adresse et la quantité souhaitée.','أدخل اسمك ورقم هاتفك وعنوانك والكمية المطلوبة.'],
    ['Confirmez avec notre équipe','أكد الطلب مع فريقنا'],['Nous vous contactons pour confirmer les détails avant l’envoi. Vous payez à la réception.','نتواصل معك لتأكيد التفاصيل قبل الإرسال. تدفع عند الاستلام.'],
    ['Des essentiels pour votre quotidien.','منتجات عملية لحياتك اليومية.'],['Confidentialité','سياسة الخصوصية']
  ];
  const translations = new Map();
  for (const pair of pairs) for (const text of pair) translations.set(text, pair);
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script,style,.language-switch,.arabic')) continue;
    const source = node.textContent.trim();
    if (translations.has(source)) nodes.push({ node, pair: translations.get(source), before: node.textContent.match(/^\s*/)[0], after: node.textContent.match(/\s*$/)[0] });
  }
  const attributes = [
    [document.querySelector('.header nav'), 'aria-label', 'Navigation principale', 'التنقل الرئيسي'],
    [document.querySelector('.language-switch'), 'aria-label', 'Langue', 'اللغة'],
    [document.querySelector('.hero-images'), 'aria-label', 'Quelques produits de notre sélection', 'بعض المنتجات من مجموعتنا'],
    ...Array.from(document.querySelectorAll('.brand')).map(el => [el, 'aria-label', 'Mustahr Store, accueil', 'متجر مستهر، الصفحة الرئيسية']),
    ...Array.from(document.querySelectorAll('img[src*="charger-product-clean"]')).map(el => [el, 'alt', 'Chargeur voiture 4-en-1 avec câbles rétractables', 'شاحن سيارة 4 في 1 بكابلين قابلين للسحب']),
    ...Array.from(document.querySelectorAll('img[src*="cutter-reference"]')).map(el => [el, 'alt', 'Coupe-légumes 9-en-1 avec panier et accessoires', 'قطاعة خضروات 9 في 1 مع سلة وملحقات'])
  ];
  function setLanguage(language) {
    const isArabic = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    for (const item of nodes) item.node.textContent = item.before + item.pair[isArabic ? 1 : 0] + item.after;
    for (const [el, attr, fr, ar] of attributes) if (el) el.setAttribute(attr, isArabic ? ar : fr);
    document.querySelectorAll('main [lang="ar"],main [lang="fr"]').forEach(el => { if (el.classList.contains('arabic')) return; el.lang = language; if (el.hasAttribute('dir')) el.dir = isArabic ? 'rtl' : 'ltr'; });
    document.querySelector('.arabic').hidden = isArabic;
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.title = isArabic ? 'Mustahr Store | منتجات عملية لحياتك اليومية' : 'Mustahr Store | Des essentiels pour votre quotidien';
    document.querySelector('meta[name="description"]').content = isArabic ? 'اكتشف اختيارات متجر مستهر: منتجات عملية لحياتك اليومية. تصفّح العروض واطلب مع الدفع عند الاستلام.' : 'Découvrez la sélection Mustahr Store : des produits pratiques pour votre quotidien. Consultez les offres et commandez avec paiement à la livraison.';
    try { localStorage.setItem('autocharge-language', language); } catch (_) {}
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  let language = 'fr';
  try { if (localStorage.getItem('autocharge-language') === 'ar') language = 'ar'; } catch (_) {}
  setLanguage(language);
})();
