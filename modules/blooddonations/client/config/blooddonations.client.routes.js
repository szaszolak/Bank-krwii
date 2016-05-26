(function () {
  'use strict';

  angular
    .module('blooddonations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('blooddonations', {
        abstract: true,
        url: '/blooddonations',
        template: '<ui-view/>'
      })
      .state('blooddonations.list', {
        url: '',
        templateUrl: 'modules/blooddonations/client/views/list-blooddonations.client.view.html',
        controller: 'BlooddonationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Blooddonations List'
        }
      })
      .state('blooddonations.create', {
        url: '/create',
        templateUrl: 'modules/blooddonations/client/views/form-blooddonation.client.view.html',
        controller: 'BlooddonationsController',
        controllerAs: 'vm',
        resolve: {
          blooddonationResolve: newBlooddonation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Blooddonations Create'
        }
      })
      .state('blooddonations.edit', {
        url: '/:blooddonationId/edit',
        templateUrl: 'modules/blooddonations/client/views/form-blooddonation.client.view.html',
        controller: 'BlooddonationsController',
        controllerAs: 'vm',
        resolve: {
          blooddonationResolve: getBlooddonation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Blooddonation {{ blooddonationResolve.name }}'
        }
      })
      .state('blooddonations.view', {
        url: '/:blooddonationId',
        templateUrl: 'modules/blooddonations/client/views/view-blooddonation.client.view.html',
        controller: 'BlooddonationsController',
        controllerAs: 'vm',
        resolve: {
          blooddonationResolve: getBlooddonation

        },
        data:{
          pageTitle: 'Blooddonation {{ articleResolve.name }}'
        }
      });
  }



  getBlooddonation.$inject = ['$stateParams', 'BlooddonationsService'];

  function getBlooddonation($stateParams, BlooddonationsService) {
    return BlooddonationsService.get({
      blooddonationId: $stateParams.blooddonationId
    }).$promise;
  }

  newBlooddonation.$inject = ['BlooddonationsService'];

  function newBlooddonation(BlooddonationsService) {
    return new BlooddonationsService();
  }
})();
