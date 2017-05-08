import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'jest-zone-patch';
import { AngularSnapshotSerializer } from './AngularSnapshotSerializer';
import { HTMLCommentSerializer } from './HTMLCommentSerializer';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

expect.addSnapshotSerializer(HTMLCommentSerializer);
expect.addSnapshotSerializer(AngularSnapshotSerializer);
import './jestGlobalMocks';
