(function () {
  'use strict';

  // Stations controller
  angular
    .module('stations')
    .controller('StationsController', StationsController);

  StationsController.$inject = ['$scope','$http', '$state','$resource', 'Authentication','Users', 'stationResolve'];

  function StationsController ($scope, $http, $state, $resource, Authentication, Users, station) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.station = station;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addUserEnabled = false;
    vm.toggleAddUser = toggleAddUser;
    vm.addEmployee = addEmployee;
    vm.employess = Users.query({station: station._id});
    vm.removeEmployee = removeEmployee;
    vm.isManager = vm.user.roles.includes("manager") && vm.user.station === station._id;
    vm.isAuthorizedToRequestTransfer = vm.user.roles.includes("manager") && !(vm.user.station === station._id);

    function toggleAddUser(){
      vm.addUserEnabled= !vm.addUserEnabled;
    }

    

    function addEmployee (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      vm.credentials.station = vm.station;
      vm.credentials.roles = ['user','employee'];

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        vm.employess.push(response);
        vm.credentials = {};
        vm.toggleAddUser();
      }).error(function (response) {
        vm.error = response.message;
      });
    };

    function removeEmployee (employee) {
      if (confirm('Czy na pewno chcesz usunąć tego pracownika?')) {
        if (employee) {
            var emp = $resource('api/users/:userId', {userId:'@id'});
             emp.remove({userId: employee._id})
              .$promise.then(function(employee) {
                  vm.employess = Users.query({station: station._id});
                });
          } else {
          
        }
      }
    };
    // Remove existing Station
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.station.$remove($state.go('stations.list'));
      }
    }

    // Save Station
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.stationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.station._id) {
        vm.station.$update(successCallback, errorCallback);
      } else {
        vm.station.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('stations.view', {
          stationId: res._id
        });
      }

      

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
