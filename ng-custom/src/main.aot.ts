import { enableProdMode } from '@angular/core';

import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';

import './styles/semantic/dist/semantic.min.css';

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

/*
 *  TODO: invest more time into understanding service workers and their caching strategies
 */
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }
