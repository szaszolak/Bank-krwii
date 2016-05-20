(function () {
  'use strict';

  angular
    .module('stations')
    .controller('StationsListController', StationsListController);

  StationsListController.$inject = ['StationsService'];

  function StationsListController(StationsService) {
    var vm = this;

    vm.stations = StationsService.query();
  }
})();
