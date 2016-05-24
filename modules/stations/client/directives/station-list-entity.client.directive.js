(function () {
  'use strict';

  angular
    .module('stations')
    .directive('stationListEntity', stationListEntity);

  stationListEntity.$inject = [/*Example: '$state', '$window' */];

  function stationListEntity(/*Example: $state, $window */) {
    return {
      templateUrl: 'views/station-list-entity.client.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  }
})();
