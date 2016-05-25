(function () {
  'use strict';

  angular
    .module('stations')
    .directive('bloodSuplies', bloodSuplies);

  bloodSuplies.$inject = [/*Example: '$state', '$window' */];

  function bloodSuplies(/*Example: $state, $window */) {
    return {
      templateUrl: '/modules/stations/client/views/blood-suplies.client.partial.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  }
})();
