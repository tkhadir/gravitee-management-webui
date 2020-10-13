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

const ApiValidatedInput: ng.IComponentOptions = {
  bindings: {
    formReference: '<',
    label: '<',
    success: '<',
    failure: '<',
    onChange: '<',
    minLength: '<',
    minLengthLabel: '<',
    maxLength: '<',
    maxLengthLabel: '<',
    regex: '<',
    regexLabel: '<'
  },
  template: require('./apiValidatedInput.html'),
  controller: function () {
    'ngInject';

    this.value = '';


    this.$onInit = () => {
      this.minLength = this.minLength || 8;
      this.minLengthLabel = this.minLengthLabel || `Should be empty or at least ${this.minLength} characters`;
      this.maxLength = this.maxLength || 64;
      this.maxLengthLabel = this.maxLengthLabel || `Should be ${this.maxLength} characters maximum`;
      this.regex = this.regex = /^[^#%@/;=?|^~, \\]*$/;
      this.regexLabel = this.regexLabel || `Should respect the pattern ${this.regex}`;
    }

    this.valueChange = function() {
      this.onChange(this.value);
    };
  }
};

export default ApiValidatedInput;
