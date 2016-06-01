(function () {
  'use strict';

  // Blooddonations controller
  angular
    .module('blooddonations')
    .controller('BlooddonationsController', BlooddonationsController);

  BlooddonationsController.$inject = ['$scope', '$state', 'Authentication', 'blooddonationResolve','DonnorsService'];

  function BlooddonationsController ($scope, $state, Authentication, blooddonation,DonnorsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.blooddonation = blooddonation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.donnors = DonnorsService.query({stationId: Authentication.user.station});
    vm.save = save;
    vm.isUserAllowedToEdit = vm.blooddonation.station == Authentication.user.station && (Authentication.user.roles.indexOf("manager") >= 0 || 
      Authentication.user.roles.indexOf("employee") >= 0);
  //[{id: 1, name:'Jan', surname:'Kowalski', pesel: 93120811444},{id: 2, name:'Anna', surname:'Mucha',pesel: 93120811332}]
 
    // Remove existing Blooddonation
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.blooddonation.$remove($state.go('blooddonations.list'));
      }
    }

    // Save Blooddonation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.blooddonationForm');
        return false;
      }

      vm.blooddonation.station = Authentication.user.station; 
      // TODO: move create/update logic to service
      if (vm.blooddonation._id) {
        vm.blooddonation.$update(successCallback, errorCallback);
      } else {
        vm.blooddonation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('blooddonations.view', {
          blooddonationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
