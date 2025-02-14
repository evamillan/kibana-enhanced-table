/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// inner angular imports
// these are necessary to bootstrap the local angular.
// They can stay even after NP cutover
import angular from 'angular';
// required for `ngSanitize` angular module
import 'angular-sanitize';
import 'angular-recursion';
import { i18nDirective, i18nFilter, I18nProvider } from '@osd/i18n/angular';
import { CoreStart, IUiSettingsClient, PluginInitializerContext } from 'opensearch-dashboards/public';
import {
  initAngularBootstrap,
  PaginateDirectiveProvider,
  PaginateControlsDirectiveProvider,
  PrivateProvider,
  watchMultiDecorator,
  OsdAccessibleClickProvider,
} from '../../../src/plugins/opensearch_dashboards_legacy/public';

initAngularBootstrap();

const thirdPartyAngularDependencies = ['ngSanitize', 'ui.bootstrap', 'RecursionHelper'];

export function getAngularModule(name: string, core: CoreStart, context: PluginInitializerContext) {
  const uiModule = getInnerAngular(name, core);
  return uiModule;
}

let initialized = false;

export function getInnerAngular(name = 'opensearch_dashboards/enhanced_table_vis', core: CoreStart) {
  if (!initialized) {
    createLocalPrivateModule();
    createLocalI18nModule();
    createLocalConfigModule(core.uiSettings);
    createLocalPaginateModule();
    initialized = true;
  }
  return angular
    .module(name, [
      ...thirdPartyAngularDependencies,
      'tableVisPaginate',
      'tableVisConfig',
      'tableVisPrivate',
      'tableVisI18n',
    ])
    .config(watchMultiDecorator)
    .directive('osdAccessibleClick', OsdAccessibleClickProvider);
}

function createLocalPrivateModule() {
  angular.module('tableVisPrivate', []).provider('Private', PrivateProvider);
}

function createLocalConfigModule(uiSettings: IUiSettingsClient) {
  angular.module('tableVisConfig', []).provider('config', function () {
    return {
      $get: () => ({
        get: (value: string) => {
          return uiSettings ? uiSettings.get(value) : undefined;
        },
        // set method is used in agg_table mocha test
        set: (key: string, value: string) => {
          return uiSettings ? uiSettings.set(key, value) : undefined;
        },
      }),
    };
  });
}

function createLocalI18nModule() {
  angular
    .module('tableVisI18n', [])
    .provider('i18n', I18nProvider)
    .filter('i18n', i18nFilter)
    .directive('i18nId', i18nDirective);
}

function createLocalPaginateModule() {
  angular
    .module('tableVisPaginate', [])
    .directive('paginate', PaginateDirectiveProvider)
    .directive('paginateControls', PaginateControlsDirectiveProvider);
}
