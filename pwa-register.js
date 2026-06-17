(function () {
  if (!('serviceWorker' in navigator)) return;
  if (!/^https?:$/.test(window.location.protocol)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
      window._monitorServiceWorkerRegistration = registration;

      registration.addEventListener('updatefound', function () {
        var worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', function () {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            window.showSyncToast && window.showSyncToast('Nova versao offline disponivel. Recarregue para aplicar.');
          }
        });
      });
    }).catch(function (err) {
      console.warn('Service Worker:', err);
    });
  });
})();
