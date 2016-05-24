(function () {
  'use strict';

  angular
    .module('stations')
    .directive('station', station);

  station.$inject = [/*Example: '$state', '$window' */];

  function station(/*Example: $state, $window */) {
    return {
      templateUrl: '/modules/stations/client/views/station-list-entity.client.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  }
})();
