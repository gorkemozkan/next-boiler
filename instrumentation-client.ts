console.log('Analytics initialized');

window.addEventListener('error', (event) => {
  reportError(event.error);
});
