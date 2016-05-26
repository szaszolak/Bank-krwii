//Transfers service used to communicate Transfers REST endpoints
(function () {
  'use strict';

  angular
    .module('transfers')
    .factory('TransfersService', TransfersService);

  TransfersService.$inject = ['$resource'];

  function TransfersService($resource) {
    return $resource('api/transfers/:transferId', {
      transferId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
