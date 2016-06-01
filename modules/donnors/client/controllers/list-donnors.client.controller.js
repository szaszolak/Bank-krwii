(function () {
  'use strict';

  angular
    .module('donnors')
    .controller('DonnorsListController', DonnorsListController);

  DonnorsListController.$inject = ['$state','DonnorsService','Authentication'];

  function DonnorsListController($state,DonnorsService,Authentication) {
    var vm = this;
    vm.donnors = DonnorsService.query({honorable:$state.$current.name=="donnors.honorable.list"});
    vm.isEmployee = Authentication.user.roles.indexOf("manager") >=0 || Authentication.user.roles.indexOf("employee") >=0; 
    //vm.honorable_donnors = DonnorsService.query({honorable:true});
  }
})();
