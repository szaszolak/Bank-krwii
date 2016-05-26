'use strict';

describe('Donnors E2E Tests:', function () {
  describe('Test Donnors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/donnors');
      expect(element.all(by.repeater('donnor in donnors')).count()).toEqual(0);
    });
  });
});
