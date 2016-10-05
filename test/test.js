/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var brIdentity = require('bedrock-identity');
var brMessages = require('bedrock-messages');
var util = require('util');
// NOTE: it is critical that bedrock-protractor be required first so that
// it can register a bedrock.cli event listener
require('bedrock-protractor');
require('bedrock-authn-password');
require('bedrock-identity-http');
require('bedrock-views');

require('./app.config');

bedrock.events.on('bedrock-express.configure.routes', app => {
  app.post('/createidentity', (req, res) => {
    var identity = {};
    identity['@context'] = bedrock.config.constants.IDENTITY_CONTEXT_V1_URL;
    identity.id = createIdentityId(req.body.sysSlug);
    identity.type = 'Identity';
    identity.sysSlug = req.body.sysSlug;
    identity.sysResourceRole = req.body.sysResourceRole;
    identity.sysPassword = req.body.sysPassword;
    identity.sysStatus = 'active';
    brIdentity.insert(null, identity, (err, result) => {
      res.status(201).json(result);
    });
  });
});

// create mock messages
bedrock.events.on('bedrock-identity.postInsert', (e, callback) => {
  let newMessages = [];
  for(var i = 1; i < 9; ++i) {
    newMessages.push({
      '@context': 'https://example.com/someContext',
      date: new Date().toJSON(),
      recipient: e.identity.id,
      sender: 'did:9806452c-7190-4f05-b090-99fec665d6d2',
      subject: '(' + i + ') ' + 'An important message for you.',
      type: 'SomeMessageType',
      content: {
        body: 'Here is an important message.'
      }
    });
  }
  brMessages.store(newMessages, callback);
});

function createIdentityId(name) {
  return util.format('%s%s/%s',
    bedrock.config.server.baseUri,
    bedrock.config['identity-http'].basePath,
    encodeURIComponent(name));
}

require('bedrock-test');
bedrock.start();
