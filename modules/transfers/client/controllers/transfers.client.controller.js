(function () {
  'use strict';

  // Transfers controller
  angular
    .module('transfers')
    .controller('TransfersController', TransfersController);

  TransfersController.$inject = ['$scope', '$state','$stateParams', 'Authentication', 'transferResolve'];

  function TransfersController ($scope, $state,$stateParams, Authentication, transfer) {
    var vm = this;
    vm.authentication = Authentication;
    vm.transfer = transfer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.source = $stateParams.source;
    vm.acceptTransfer = acceptTransfer;
    vm.rejectTransfer = rejectTransfer;
    vm.outbox = vm.transfer.destination == user.station;

    vm.types = [{name:"0-",value:"zero_minus"},
    {name:"0+",value:'zero_plus'},
    {name:"A+",value:'A_plus'},
    {name:"A-",value: 'A_minus'},
    {name:"B+",value:"B_plus"},
    {name:"B-",value:"B_minus"},
    {name:"AB+",value:"AB_plus"},
    {name:"AB-",value:"AB_minus"}];

    // Remove existing Transfer
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.transfer.$remove($state.go('transfers.list'));
      }
    }

  

    // Save Transfer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.transferForm');
        return false;
      }

      // TODO: move create/update logic to service
      vm.transfer.destination = user.station;
      vm.transfer.source = vm.source;
      vm.transfer.state = 'PENDING';

      if (vm.transfer._id) {
        vm.transfer.$update(successCallback, errorCallback);
      } else {
        vm.transfer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('stations.view', {
          stationId:  $stateParams.source
        });
      }

   
    }

    function acceptTransfer(){
      vm.transfer.state = 'ACCEPTED';
      if (vm.transfer._id) {
        vm.transfer.$update(succesTransferCallback, errorCallback);
      }else{
      }
    }
    function rejectTransfer(){
      vm.transfer.state = 'REJECTED';
      if (vm.transfer._id) {
        vm.transfer.$update(succesTransferCallback, errorCallback);
      }else{
      }
    }

    function succesTransferCallback(){
       $state.go($state.previous.state.name,{});
    }
    
    function errorCallback(res) {
     vm.error = res.data.message;
    }
  }
})();
