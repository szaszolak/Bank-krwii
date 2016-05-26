'use strict';

describe('Blooddonations E2E Tests:', function () {
  describe('Test Blooddonations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/blooddonations');
      expect(element.all(by.repeater('blooddonation in blooddonations')).count()).toEqual(0);
    });
  });
});
