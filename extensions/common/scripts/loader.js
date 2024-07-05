const scriptTag = document.createElement('script');
scriptTag.type = 'text/javascript';
scriptTag.async = true;
scriptTag.onerror = function (e) {
  console.error('Dub+ failed to load', e);
};
scriptTag.src =
  'https://cdn.jsdelivr.net/gh/DubPlus/DubPlus/dubplus.js?version=0.3.4';

document.head.appendChild(scriptTag);
