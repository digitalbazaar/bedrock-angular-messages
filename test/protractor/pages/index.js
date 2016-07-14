var pages = global.bedrock.pages || {};

pages.messageList = require('./messageList');
pages.message = require('./message');

module.exports = global.bedrock.pages = pages;
