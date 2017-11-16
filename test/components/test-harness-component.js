/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-messages-test/test-harness-component.html'
};

/* @ngInject */
function Ctrl($http, $location, brAuthnService) {
  const self = this;
  self.showLogin = false;
  self.testData = null;
  self.authenticated = false;

  self.authentication = {
    displayOrder: brAuthnService.displayOrder,
    methods: brAuthnService.methods
  };

  self.onLogin = () => {
    self.authenticated = true;
  };

  self.addIdentity = (userName, password) =>
    $http.post('/createidentity', createIdentity(userName, password))
      .then(response => {
        self.testData = response.data.identity;
      });

  function createIdentity(userName, password) {
    const newIdentity = {
      sysSlug: userName,
      email: userName,
      sysPassword: password,
      sysResourceRole: [{
        sysRole: 'bedrock-test.identity.registered',
        generateResource: 'id'
      }]
    };
    return newIdentity;
  }
}
