(function () {
  'use strict';

  angular
    .module('blooddonations')
    .controller('BlooddonationsListController', BlooddonationsListController);

  BlooddonationsListController.$inject = ['BlooddonationsService'];

  function BlooddonationsListController(BlooddonationsService) {
    var vm = this;

    vm.blooddonations = BlooddonationsService.query();
  }
})();
