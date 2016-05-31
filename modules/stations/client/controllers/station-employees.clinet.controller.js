(function () {
  'use strict';

  // Stations controller
  angular
    .module('stations')
    .controller('StationEmployeesController', StationEmployeesController);

  StationEmployeesController.$inject = ['$scope','$http', '$state','$resource', 'Authentication','Users', 'stationResolve'];

  function StationEmployeesController ($scope, $http, $state, $resource, Authentication, Users, station) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.station = station;
    vm.error = null;
    vm.form = {};
    vm.addUserEnabled = false;
    vm.toggleAddUser = toggleAddUser;
    vm.addEmployee = addEmployee;
    vm.employess = Users.query({station: station._id});
    vm.removeEmployee = removeEmployee;

   
    function toggleAddUser(){
      vm.addUserEnabled= !vm.addUserEnabled;
    }

    

    function addEmployee (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      vm.credentials.station = vm.station;

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
    

  
  }
})();
