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
import ApiService, { CustomApiKeyInputState } from "../../../../services/api.service";

function DialogSubscriptionRenewController(
  $scope,
  $mdDialog,
  locals,
  ApiService: ApiService
) {
  'ngInject';

  $scope.title = locals.title;
  $scope.msg = locals.msg;
  $scope.customMessage = locals.customMessage;
  $scope.confirmButton = locals.confirmButton || 'OK';
  $scope.cancelButton = locals.cancelButton || 'Cancel';
  $scope.apiId = locals.apiId;
  this.selectedPlanCustomApiKey = null;
  this.customApiKeyInputState = CustomApiKeyInputState.EMPTY;
  this.customValue = '';

  this.cancel = function() {
    $mdDialog.hide({confirmed: false});
  };

  this.confirm = () => {
    this.customValue ?
      $mdDialog.hide({confirmed: true, customValue: this.customValue})
      : $mdDialog.hide({confirmed: true});
  };

  this.checkApiKeyUnicity = (customApiKey) => {
    this.customValue = customApiKey;
    ApiService.checkApiKeyUnicity($scope.apiId, customApiKey)
      .then(customApiKeyInputState => this.customApiKeyInputState = customApiKeyInputState);
  };
}

export default DialogSubscriptionRenewController;
