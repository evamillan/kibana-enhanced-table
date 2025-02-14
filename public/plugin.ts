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
import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';

import { enhancedTableVisTypeDefinition } from './enhanced-table-vis';
import { documentTableVisTypeDefinition } from './document-table-vis';

import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { setFormatService, setOpenSearchDashboardsLegacy, setNotifications, setQueryService, setSearchService } from './services';
import { OpenSearchDashboardsLegacyStart } from '../../../src/plugins/opensearch_dashboards_legacy/public';


/** @internal */
export interface TablePluginSetupDependencies {
  visualizations: VisualizationsSetup;
}

/** @internal */
export interface TablePluginStartDependencies {
  data: DataPublicPluginStart;
  opensearchDashboardsLegacy: OpenSearchDashboardsLegacyStart;
}

/** @internal */
export class EnhancedTablePlugin implements Plugin<Promise<void>, void> {
  initializerContext: PluginInitializerContext;
  createBaseVisualization: any;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(
    core: CoreSetup,
    { visualizations }: TablePluginSetupDependencies
  ) {
    visualizations.createBaseVisualization(
      enhancedTableVisTypeDefinition(core, this.initializerContext)
    );

    visualizations.createBaseVisualization(
      documentTableVisTypeDefinition(core, this.initializerContext)
      );
  }

  public start(core: CoreStart, { data, opensearchDashboardsLegacy }: TablePluginStartDependencies) {
    setFormatService(data.fieldFormats);
    setOpenSearchDashboardsLegacy(opensearchDashboardsLegacy);
    setNotifications(core.notifications);
    setQueryService(data.query);
    setSearchService(data.search);
  }
}
