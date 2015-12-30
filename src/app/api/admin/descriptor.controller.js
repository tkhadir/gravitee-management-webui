/**
 * Created by david on 27/11/2015.
 */
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
class ApiDescriptorController {
  constructor (ApiService, resolvedApi, $state, NotificationService, $scope) {
    'ngInject';
    this.ApiService = ApiService;
    this.NotificationService = NotificationService;
    this.$scope = $scope;
    this.$state = $state;
    this.api = _.cloneDeep(resolvedApi.data);

    delete this.api.description;
    delete this.api.created_at;
    delete this.api.updated_at;
    delete this.api.visibility;
    delete this.api.state;
    delete this.api.permission;
    delete this.api.owner;
  }
}

export default ApiDescriptorController;
