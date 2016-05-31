(function () {
  'use strict';

  angular
    .module('donnors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('donnors', {
        abstract: true,
        url: '/donnors',
        template: '<ui-view/>'
      })
       .state('donnors.honorable', {
        abstract: true,
        url: '/donnors/honorable',
        template: '<ui-view/>'
      })
      .state('donnors.list', {
        url: '',
        templateUrl: 'modules/donnors/client/views/list-donnors.client.view.html',
        controller: 'DonnorsListController',
        controllerAs: 'vm',
        data: {
          roles: ['empolyee','manager','admin'],
          pageTitle: 'Donnors List'
        }
      })
      .state('donnors.create', {
        url: '/create',
        templateUrl: 'modules/donnors/client/views/form-donnor.client.view.html',
        controller: 'DonnorsController',
        controllerAs: 'vm',
        resolve: {
          donnorResolve: newDonnor
        },
        data: {
          roles: ['empolyee','manager','admin'],
          pageTitle : 'Donnors Create'
        }
      })
      .state('donnors.edit', {
        url: '/:donnorId/edit',
        templateUrl: 'modules/donnors/client/views/form-donnor.client.view.html',
        controller: 'DonnorsController',
        controllerAs: 'vm',
        resolve: {
          donnorResolve: getDonnor
        },
        data: {
          roles: ['empolyee','manager','admin'],
          pageTitle: 'Edit Donnor {{ donnorResolve.name }}'
        }
      })
      .state('donnors.view', {
        url: '/:donnorId',
        templateUrl: 'modules/donnors/client/views/view-donnor.client.view.html',
        controller: 'DonnorsController',
        controllerAs: 'vm',
        resolve: {
          donnorResolve: getDonnor
        },
        data:{
          roles: ['empolyee','manager','admin'],
          pageTitle: 'Donnor {{ articleResolve.name }}'
        }
      }) 
      .state('donnors.honorable.list', {
        url: '',
        templateUrl: 'modules/donnors/client/views/list-honorable-donnors.client.view.html',
        controller: 'DonnorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Honorowi dawcy krwii'
        }
      })
      .state('donnors.honorable.view', {
        url: '/:donnorId',
        templateUrl: 'modules/donnors/client/views/view-honorable-donnor.client.view.html',
        controller: 'DonnorsController',
        controllerAs: 'vm',
        resolve: {
          donnorResolve: getDonnor
        },
        data:{
          pageTitle: 'Donnor {{ articleResolve.name }}'
        }
      });
  }

  getDonnor.$inject = ['$stateParams', 'DonnorsService'];

  function getDonnor($stateParams, DonnorsService) {
    return DonnorsService.get({
      donnorId: $stateParams.donnorId
    }).$promise;
  }

  newDonnor.$inject = ['DonnorsService'];

  function newDonnor(DonnorsService) {
    return new DonnorsService();
  }
})();
