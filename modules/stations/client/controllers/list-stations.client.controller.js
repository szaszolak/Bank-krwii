(function () {
  'use strict';

  angular
    .module('stations')
    .controller('StationsListController', StationsListController);

  StationsListController.$inject = ['StationsService','Authentication'];

  function StationsListController(StationsService,Authentication) {
    var vm = this;
    vm.blood_types = ["0-","0+","A-","A+","B-","B+","AB-","AB+"];
    vm.stations = StationsService.query();
    vm.isManager = Authentication.user.roles.includes("manager");
    vm.user_station = Authentication.user.station;
  }
})();
