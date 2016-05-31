(function () {
  'use strict';

  angular
    .module('transfers')
    .controller('TransfersListController', TransfersListController);

  TransfersListController.$inject = ['TransfersService','Authentication'];

  function TransfersListController(TransfersService,Authentication) {
    var vm = this;

    vm.transfers = TransfersService.query({stationId: Authentication.user.station._id,state: 'pending'});
  }
})();
