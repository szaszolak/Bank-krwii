(function () {
  'use strict';

  // Transfers controller
  angular
    .module('transfers')
    .controller('TransfersController', TransfersController);

  TransfersController.$inject = ['$scope', '$state', 'Authentication', 'transferResolve', 'destination'];

  function TransfersController ($scope, $state, Authentication, transfer,  destination) {
    var vm = this;

    vm.authentication = Authentication;
    vm.transfer = transfer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.types = ["0+","0-","A+","A-","B+","B-","AB+","AB-"];

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
      vm.transfer.source = source;
      if (vm.transfer._id) {
        vm.transfer.$update(successCallback, errorCallback);
      } else {
        vm.transfer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('transfers.view', {
          transferId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
