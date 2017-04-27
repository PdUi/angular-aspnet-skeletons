import { enableProdMode } from '@angular/core';

import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';

import './styles/semantic/dist/semantic.min.css';

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
