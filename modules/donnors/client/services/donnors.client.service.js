//Donnors service used to communicate Donnors REST endpoints
(function () {
  'use strict';

  angular
    .module('donnors')
    .factory('DonnorsService', DonnorsService);

  DonnorsService.$inject = ['$resource'];

  function DonnorsService($resource) {
    return $resource('api/donnors/:donnorId', {
      donnorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
