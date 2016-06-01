(function () {
  'use strict';

  // Donnors controller
  angular
    .module('donnors')
    .controller('DonnorsController', DonnorsController);

  DonnorsController.$inject = ['$scope', '$state', 'Authentication', 'donnorResolve'];

  function DonnorsController ($scope, $state, Authentication, donnor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.donnor = donnor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.types = ["0+","0-","A+","A-","B+","B-","AB+","AB-"];
    vm.isEmployee = Authentication.user.roles.indexOf("manager") >=0 || Authentication.user.roles.indexOf("employee") >=0; 

    // Remove existing Donnor
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.donnor.$remove($state.go('donnors.list'));
      }
    }

    // Save Donnor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.donnorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.donnor._id) {
        vm.donnor.$update(successCallback, errorCallback);
      } else {
        vm.donnor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('donnors.view', {
          donnorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
