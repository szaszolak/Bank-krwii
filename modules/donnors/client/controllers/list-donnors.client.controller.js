(function () {
  'use strict';

  angular
    .module('donnors')
    .controller('DonnorsListController', DonnorsListController);

  DonnorsListController.$inject = ['DonnorsService'];

  function DonnorsListController(DonnorsService) {
    var vm = this;

    vm.donnors = DonnorsService.query();
  }
})();
