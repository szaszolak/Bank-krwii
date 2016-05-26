(function () {
  'use strict';

  angular
    .module('stations')
    .controller('StationsListController', StationsListController);

  StationsListController.$inject = ['StationsService'];

  function StationsListController(StationsService) {
    var vm = this;
    vm.blood_types = ["0+","0-","A+","A-","B+","B-","AB+","AB-"];
    vm.stations = StationsService.query();
    vm.isManager = user.roles.includes("manager");
    vm.user_station = user.station;
  }
})();
