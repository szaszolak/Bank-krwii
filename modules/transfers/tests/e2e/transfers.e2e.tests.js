'use strict';

describe('Transfers E2E Tests:', function () {
  describe('Test Transfers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/transfers');
      expect(element.all(by.repeater('transfer in transfers')).count()).toEqual(0);
    });
  });
});
