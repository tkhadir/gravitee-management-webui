/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// tslint:disable-next-line:no-var-requires
require('@gravitee/ui-components/wc/gv-option');

class NewApiController {

  definitionVersion: any;
  options: any[];
  isImport: boolean;
  private definitionVersions: string[];

  constructor(
    private policies,
    private Constants: any
  ) {
    'ngInject';
    this.definitionVersions = Constants.definitionVersions;
    this.definitionVersion = '2.0.0';
    this.isImport = false;
  }

  versionLabel() {
    return this.definitionVersion === '1.0.0' ? 'With Paths based' : 'With Design Studio';
  }

  cancelImport() {
    this.isImport = false;
  }

}

export default NewApiController;
