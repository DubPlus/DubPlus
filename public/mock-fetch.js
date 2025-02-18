(function () {
  const _fetch = window.fetch;

  const prop = Object.getOwnPropertyDescriptor(window, 'fetch');

  prop.value = function (url, ...rest) {
    // rewrite url to remove domain so we can use a proxy
    url = url.replace('https://api.queup.net', '/api');
    return _fetch.apply(window, [url, ...rest]);
  };

  Object.defineProperty(window, 'fetch', prop);
})();
