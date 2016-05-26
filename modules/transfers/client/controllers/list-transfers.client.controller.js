(function () {
  'use strict';

  angular
    .module('transfers')
    .controller('TransfersListController', TransfersListController);

  TransfersListController.$inject = ['TransfersService'];

  function TransfersListController(TransfersService) {
    var vm = this;

    vm.transfers = TransfersService.query();
  }
})();
