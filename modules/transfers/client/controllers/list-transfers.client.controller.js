(function () {
  'use strict';

  angular
    .module('transfers')
    .controller('TransfersListController', TransfersListController);

  TransfersListController.$inject = ['$state','TransfersService','BlodTypeResolverService','Authentication'];

  function TransfersListController($state,TransfersService,BlodTypeResolverService,Authentication) {
    var vm = this;
    vm.view = function(transferId){
    	$state.go('transfers.view',{transferId: transferId});
    };
    vm.getBloodTypeName = function(type){return BlodTypeResolverService.resolve_name(type);};
    vm.inbox = $state.$current.name=="transfers.incoming"; 
    vm.transfers = TransfersService.query(
    									{
    										stationId: Authentication.user.station._id,
    										state: 'PENDING',
    										incoming: vm.inbox
    									});

  
  }
})();
