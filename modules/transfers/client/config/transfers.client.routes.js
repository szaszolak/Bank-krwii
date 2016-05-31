(function () {
  'use strict';

  angular
    .module('transfers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('transfers', {
        abstract: true,
        url: '/transfers',
        template: '<ui-view/>'
      })
      .state('transfers.list', {
        url: '',
        templateUrl: 'modules/transfers/client/views/list-transfers.client.view.html',
        controller: 'TransfersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Transfers List'
        }
      })
      .state('transfers.create', {
        url: '/create?:source',
        templateUrl: 'modules/transfers/client/views/form-transfer.client.view.html',
        controller: 'TransfersController',
        controllerAs: 'vm',
        resolve: {
          transferResolve: newTransfer
        },
        data: {
          roles: ['manager', 'admin'],
          pageTitle : 'Transfers Create'
        }
      })
      .state('transfers.edit', {
        url: '/:transferId/edit',
        templateUrl: 'modules/transfers/client/views/form-transfer.client.view.html',
        controller: 'TransfersController',
        controllerAs: 'vm',
        resolve: {
          transferResolve: getTransfer
        },
        data: {
          roles: ['manager', 'admin'],
          pageTitle: 'Edit Transfer {{ transferResolve.name }}'
        }
      })
      .state('transfers.view', {
        url: '/:transferId',
        templateUrl: 'modules/transfers/client/views/view-transfer.client.view.html',
        controller: 'TransfersController',
        controllerAs: 'vm',
        resolve: {
          transferResolve: getTransfer
        },
        data:{
          pageTitle: 'Transfer {{ articleResolve.name }}'
        }
      });
  }

  getTransfer.$inject = ['$stateParams', 'TransfersService'];

  function getTransfer($stateParams, TransfersService) {
    return TransfersService.get({
      transferId: $stateParams.transferId
    }).$promise;
  }

  newTransfer.$inject = ['TransfersService'];

  function newTransfer(TransfersService) {
    return new TransfersService();
  }
})();
