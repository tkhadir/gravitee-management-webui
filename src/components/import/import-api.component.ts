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
import { StateService } from '@uirouter/core';
import { IScope } from 'angular';
import NotificationService from '../../services/notification.service';
import ApiService from '../../services/api.service';
import _ = require('lodash');


const ImportComponent: ng.IComponentOptions = {
  template: require('./import-api.html'),
  bindings: {
    apiId: '<',
    cancelAction: '&',
    policies: '<'
  },
  controller: function(
    $state: StateService,
    $scope: IScope,
    $mdDialog: angular.material.IDialogService,
    NotificationService: NotificationService,
    ApiService: ApiService,
    $attrs,
  ) {

    'ngInject';

    this.$onInit = () => {
      var that = this;
      this.importFileMode = true;
      this.importURLMode = false;
      this.enableFileImport = false;
      this.importFileMode = true;
      this.importURLMode = false;
      this.importURLTypes = [
        {id: 'SWAGGER', name: 'Swagger / OpenAPI'},
        {id: 'GRAVITEE', name: 'API Definition'},
        {id: 'WSDL', name: 'WSDL'}
      ];
      this.importURLType = 'SWAGGER';
      this.apiDescriptorURL = null;
      this.importAPIFile = null;
      this.importCreateDocumentation = true;
      this.importCreatePolicyPaths = false;
      this.importCreatePathMapping = true;
      this.importCreateMocks = false;
      $scope.$watch('$ctrl.importAPIFile.content', function(data) {
        if (data) {
          that.enableFileImport = true;
        }
      });
    };

    this.placeholder = () => {
      if (this.importURLType === 'SWAGGER') {
        return 'Enter Swagger descriptor URL';
      } else if (this.importURLType === 'GRAVITEE') {
        return 'Enter API definition URL';
      } else if (this.importURLType === 'WSDL') {
        return 'Enter WSDL definition URL';
      }
    };

    this.cancel = () => {
      this.cancelAction();
    };

    this.isSwaggerImport = () => {
      if (this.importURLMode && this.importURLType !== 'GRAVITEE') {
        return true;
      }

      if (this.importFileMode && this.importAPIFile) {
        var extension = this.importAPIFile.name.split('.').pop().toLowerCase();
        switch (extension) {
          case 'yml' :
          case 'yaml' :
            return true;
          case 'json' :
            if (this.isSwaggerDescriptor()) {
              return true;
            }
            break;
          case 'wsdl' :
          case 'xml' :
            return true;
          default:
            return false;
        }
      }
      return false;
    };

    this.isForUpdate = () => {
      return this.apiId != null;
    };

    this.hasCancel = () => {
      return $attrs.cancelAction || this.isForUpdate();
    };

    this.isSwaggerDescriptor = () => {
      try {
        if (this.enableFileImport) {
          var fileContent = JSON.parse(this.importAPIFile.content);
          return fileContent.hasOwnProperty('swagger')
            || fileContent.hasOwnProperty('swaggerVersion')
            || fileContent.hasOwnProperty('openapi');
        }
      } catch (e) {
        NotificationService.showError('Invalid json file.');
        this.enableFileImport = false;
      }
    };

    this.enableImport = () => {
      if (this.importFileMode) {
        return this.enableFileImport;
      } else {
        return (this.apiDescriptorURL && this.apiDescriptorURL.length);
      }
    };

    this.isWsdl = () => {
      if (this.importFileMode) {
        var extension = this.importAPIFile.name.split('.').pop().toLowerCase();
        switch (extension) {
          case 'wsdl' :
          case 'xml' :
            return true;
          default:
            return false;
        }
      } else if (this.importURLType === 'WSDL') {
        return true;
      } else {
        return false;
      }
    };

    this.importAPI = () => {
      if (this.importFileMode) {
        var extension = this.importAPIFile.name.split('.').pop().toLowerCase();
        switch (extension) {
          case 'yml' :
          case 'yaml' :
            this.importSwagger();
            break;
          case 'json' :
            let isSwagger = this.isSwaggerDescriptor();
            if (isSwagger !== null) {
              if (isSwagger) {
                this.importSwagger();
              } else {
                this.importGraviteeIODefinition();
              }
            }
            break;
          case 'wsdl' :
          case 'xml' :
            this.importWSDL();
            break;
          default:
            this.enableFileImport = false;
            NotificationService.showError('Input file must be a valid API definition file.');
        }
      } else if (this.importURLType === 'SWAGGER') {
        this.importSwagger();
      } else if (this.importURLType === 'GRAVITEE') {
        this.importGraviteeIODefinition();
      } else if (this.importURLType === 'WSDL') {
        this.importWSDL();
      }
      if (this.isForUpdate()) {
        this.cancel();
      }
    };

    this.importGraviteeIODefinition = () => {
      var id = (this.isForUpdate() ? this.apiId : null);
      var apiDefinition = (this.importFileMode ? this.importAPIFile.content : this.apiDescriptorURL);
      var isUpdate = this.isForUpdate();
      ApiService.import(id, apiDefinition).then(function(api) {
        if (isUpdate) {
          NotificationService.show('API updated');
          $state.reload();
        } else {
          NotificationService.show('API created');
          $state.go('management.apis.detail.portal.general', {apiId: api.data.id});
        }
      });
    };

    this.importSwagger = () => {
      this.importApiSpecification('API');
    };

    this.importWSDL = () => {
      this.importApiSpecification('WSDL');
    };

    this.importApiSpecification = (format) => {
      let swagger: any = {
        with_documentation: this.importCreateDocumentation,
        with_path_mapping: this.importCreatePathMapping,
        with_policy_paths: this.importCreatePolicyPaths,
        with_policies: _.map(_.filter(this.policies, 'enable'), 'id')
      };

      if (this.importFileMode) {
        swagger.type = 'INLINE';
        swagger.payload = this.importAPIFile.content;
      } else {
        swagger.type = 'URL';
        swagger.payload = this.apiDescriptorURL;
      }

      swagger.format = format;

      if (this.isForUpdate()) {
        // @ts-ignore
        ApiService.importSwagger(this.apiId, swagger).then((api) => {
          NotificationService.show('API successfully imported');
          $state.reload();
        });
      } else {
        // @ts-ignore
        ApiService.importSwagger(null, swagger).then((api) => {
          NotificationService.show('API successfully updated');
          $state.go('management.apis.detail.portal.general', {apiId: api.data.id});
        });
      }
    };
  }
};

export default ImportComponent;
