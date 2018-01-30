/*!
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const protractor = global.protractor;
const EC = protractor.ExpectedConditions;
const uuid = require('uuid').v4;

const app = bedrock.pages['bedrock-angular-messages'].app;
const messagePage = bedrock.pages['bedrock-angular-messages'].message;
const messageList = bedrock.pages['bedrock-angular-messages'].messageList;

describe('bedrock-angular-messages', () => {
  const testIdentity = {
    sysIdentifier: `${uuid().substr(0, 23)}@bedrock.local`,
    password: 'password'
  };

  before(() => {
    bedrock.get('/');
    app.createIdentity(testIdentity);
    app.login(testIdentity);
  });

  describe('br-messages-notification', () => {
    it('should indicate 8 messages', () => {
      browser.sleep(10000);
      app.messageNotification().getText().should.eventually.equal('Messages 8');
    });
  });

  describe('Messages List', () => {
    it('should navigate to messages page', () => {
      app.messageNotification().click();
      messageList.waitForLoad();
    });

    it('should have 8 messages', () => {
      const messages = messageList.messages();
      messages.count().should.eventually.equal(8);
    });

    it('should archive 5 messages', () => {
      var messages = messageList.messages();
      for(var i = 0; i < 5; ++i) {
        messageList.selectMessage(messages.get(i));
      }
      messageList.archiveSelected();
      messages = messageList.messages();
      messages.count().should.eventually.equal(3);
    });

    it('should navigate newer and older messages', () => {
      const messages = messageList.messages();
      messageList.clickMessage(messages.first());
      messagePage.waitForLoad();
      $('br-message-viewer').getText()
        .should.eventually.contain('(6) An important message for you.');
      messagePage.older().isPresent().should.eventually.be.true;
      messagePage.newer().isPresent().should.eventually.be.false;
      messagePage.older().click();
      messagePage.waitForLoad();
      $('br-message-viewer').getText()
        .should.eventually.contain('(7) An important message for you.');
      messagePage.older().isPresent().should.eventually.be.true;
      messagePage.newer().isPresent().should.eventually.be.true;
      messagePage.older().click();
      messagePage.waitForLoad();
      $('br-message-viewer').getText()
        .should.eventually.contain('(8) An important message for you.');
      messagePage.older().isPresent().should.eventually.be.false;
      messagePage.newer().isPresent().should.eventually.be.true;
      messagePage.newer().click();
      messagePage.waitForLoad();
      $('br-message-viewer').getText()
        .should.eventually.contain('(7) An important message for you.');
      messagePage.older().isPresent().should.eventually.be.true;
      messagePage.newer().isPresent().should.eventually.be.true;
      messagePage.newer().click();
      messagePage.waitForLoad();
      $('br-message-viewer').getText()
        .should.eventually.contain('(6) An important message for you.');
      messagePage.older().isPresent().should.eventually.be.true;
      messagePage.newer().isPresent().should.eventually.be.false;
      messagePage.returnButton().click();
    });

    it('archive tab should have 5 messages', () => {
      messageList.archiveTab(true);
      const messages = messageList.messages();
      messages.count().should.eventually.equal(5);
    });

    it('should click on first archived message', () => {
      const messages = messageList.messages();
      messageList.clickMessage(messages.first());
      messagePage.waitForLoad();
    });

    it('should delete the message', () => {
      browser.wait(
        EC.elementToBeClickable(element(by.buttonText('Delete'))), 3000);
      messagePage.delete();
      messageList.waitForLoad();
    });

    it('archive tab should be displayed, with 4 messages', () => {
      messageList.archiveTab().getAttribute('aria-selected')
        .should.eventually.equal('true');
      const messages = messageList.messages();
      messages.count().should.eventually.equal(4);
    });

    it('should navigate to inbox tab, with 3 messages', () => {
      messageList.inboxTab(true);
      const messages = messageList.messages();
      messages.count().should.eventually.equal(3);
    });

    it('should click on last message', () => {
      const messages = messageList.messages();
      messageList.clickMessage(messages.last());
      messagePage.waitForLoad();
    });

    it('should archive message', () => {
      messagePage.archive();
      messageList.waitForLoad();
    });

    it('inbox page should have 2 messages', () => {
      const messages = messageList.messages();
      messages.count().should.eventually.equal(2);
    });

    it('archive tab should have 5 messages', () => {
      messageList.archiveTab(true);
      const messages = messageList.messages();
      messages.count().should.eventually.equal(5);
    });

    it('refresh', () => {
      protractor.browser.refresh();
      messageList.waitForLoad();
      messageList.inboxTab().getAttribute('aria-selected')
        .should.eventually.equal('true');
    });

    it('inbox page should have 2 messages', () => {
      const messages = messageList.messages();
      messages.count().should.eventually.equal(2);
    });

    it('archive tab should have 5 messages', () => {
      messageList.archiveTab(true);
      const messages = messageList.messages();
      messages.count().should.eventually.equal(5);
    });

    it('should archive all inboxed messages', () => {
      messageList.inboxTab(true);
      var messages = messageList.messages();
      messages.each(function(m) {
        messageList.selectMessage(m);
      });
      messageList.archiveSelected();
      messages = messageList.messages();
      messages.count().should.eventually.equal(0);
    });

    it('should delete all archived messages', () => {
      messageList.archiveTab(true);
      var messages = messageList.messages();
      messages.count().should.eventually.equal(7);
      messages.each(function(m) {
        messageList.selectMessage(m);
      });
      messageList.deleteSelected();
      messages = messageList.messages();
      messages.count().should.eventually.equal(0);
    });

    it('refresh', () => {
      protractor.browser.refresh();
      messageList.waitForLoad();
      messageList.inboxTab().getAttribute('aria-selected')
        .should.eventually.equal('tue');
    });

    it('inbox page should have 0 messages', () => {
      const messages = messageList.messages();
      messages.count().should.eventually.equal(0);
    });

    it('archive tab should have 0 messages', () => {
      messageList.archiveTab(true);
      const messages = messageList.messages();
      messages.count().should.eventually.equal(0);
    });
  }); // end message list
});
