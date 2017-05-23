/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');

var dir = path.join(__dirname);
config.requirejs.bower.packages.push({
  path: path.join(dir, 'components'),
  manifest: path.join(dir, 'bower.json')
});

var parentDir = path.join(__dirname, '..');
config.requirejs.bower.packages.push({
  path: path.join(parentDir),
  manifest: path.join(parentDir, 'bower.json')
});

// mongodb config
config.mongodb.name = 'bedrock_angular_messages_app';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'bedrock_angular_messages_app';

var permissions = config.permission.permissions;
var roles = config.permission.roles;
roles['bedrock-test.identity.registered'] = {
  id: 'bedrock-test.identity.registered',
  label: 'Identity Manager',
  comment: 'Role for identity managers.',
  sysPermission: [
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.PUBLIC_KEY_ACCESS.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_EDIT.id,
    permissions.PUBLIC_KEY_REMOVE.id,
    permissions.MESSAGE_ACCESS.id,
    permissions.MESSAGE_REMOVE.id
  ]
};

// views vars
config.views.vars.identity = {
  baseUri: config['identity-http'].basePath
};
