(function () {
  'use strict';
  angular
    .module('stations')
    .directive('manageEmployees', manageEmployees);


  /* @ngInject */
  function manageEmployees() {
    var manageEmployees = {
          templateUrl: '/modules/stations/client/views/manage-employees.client.view.html',
          restrict: 'E',replace     : true,
          bindToController: true,
          controller: Controller,
          controllerAs: 'vm',
          link: link,
          scope: {
          }
    }

    return manageEmployees;

    function link(scope, element, attrs) {

        }
      }

          /* @ngInject */
    Controller.$inject = ['$scope','$http', '$state','$resource', 'Authentication','Users', 'Stations'];
    function Controller ($scope,$http, $state,$resource, Authentication,Users, Stations) {

    }

   
})();