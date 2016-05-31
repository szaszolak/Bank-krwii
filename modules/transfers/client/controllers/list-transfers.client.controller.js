(function () {
  'use strict';

  angular
    .module('transfers')
    .controller('TransfersListController', TransfersListController);

  TransfersListController.$inject = ['$state','TransfersService','BlodTypeResolverService','Authentication'];

  function TransfersListController($state,TransfersService,BlodTypeResolverService,Authentication) {
    var vm = this;
    vm.getBloodTypeName = function(type){return BlodTypeResolverService.resolve_name(type);};

    vm.transfers = TransfersService.query(
    									{
    										stationId: Authentication.user.station._id,
    										state: 'PENDING',
    										incomig: $state.$current.name=="transfers.list.incoming" 
    									});

  
  }
})();
