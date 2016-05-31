(function () {
  'use strict';

  angular
    .module('donnors')
    .controller('DonnorsListController', DonnorsListController);

  DonnorsListController.$inject = ['$state','DonnorsService'];

  function DonnorsListController($state,DonnorsService) {
    var vm = this;
    vm.donnors = DonnorsService.query({honorable:$state.$current.name=="donnors.honorable.list"});
    //vm.honorable_donnors = DonnorsService.query({honorable:true});
  }
})();
