/* Meta Pixel: B&C Touch product page only. */
(function (window, document) {
  'use strict';
  var pixelId = '2173980446821690';
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', pixelId);
  window.fbq('trackSingle', pixelId, 'PageView');
  if (document.body.dataset.bcProduct === 'coffret') window.fbq('trackSingle', pixelId, 'ViewContent', {
    content_ids: ['bc-touch-coffret'], content_type: 'product',
    content_name: 'Coffret B&C Touch'
  });
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a.quote-link');
    if (!link || !link.href.startsWith('https://wa.me/212646852347')) return;
    window.fbq('trackSingle', pixelId, 'Contact', {
      content_name: document.body.dataset.bcProduct === 'coffret' ? 'Coffret B&C Touch' : 'B&C Touch', contact_method: 'WhatsApp'
    });
  });
})(window, document);

