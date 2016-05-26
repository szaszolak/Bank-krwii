//Blooddonations service used to communicate Blooddonations REST endpoints
(function () {
  'use strict';

  angular
    .module('blooddonations')
    .factory('BlooddonationsService', BlooddonationsService);

  BlooddonationsService.$inject = ['$resource'];

  function BlooddonationsService($resource) {
    return $resource('api/blooddonations/:blooddonationId', {
      blooddonationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
