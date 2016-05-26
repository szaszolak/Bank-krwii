(function () {
  'use strict';

  describe('Transfers Route Tests', function () {
    // Initialize global variables
    var $scope,
      TransfersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TransfersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TransfersService = _TransfersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('transfers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/transfers');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TransfersController,
          mockTransfer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('transfers.view');
          $templateCache.put('modules/transfers/client/views/view-transfer.client.view.html', '');

          // create mock Transfer
          mockTransfer = new TransfersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Transfer Name'
          });

          //Initialize Controller
          TransfersController = $controller('TransfersController as vm', {
            $scope: $scope,
            transferResolve: mockTransfer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:transferId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.transferResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            transferId: 1
          })).toEqual('/transfers/1');
        }));

        it('should attach an Transfer to the controller scope', function () {
          expect($scope.vm.transfer._id).toBe(mockTransfer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/transfers/client/views/view-transfer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TransfersController,
          mockTransfer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('transfers.create');
          $templateCache.put('modules/transfers/client/views/form-transfer.client.view.html', '');

          // create mock Transfer
          mockTransfer = new TransfersService();

          //Initialize Controller
          TransfersController = $controller('TransfersController as vm', {
            $scope: $scope,
            transferResolve: mockTransfer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.transferResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/transfers/create');
        }));

        it('should attach an Transfer to the controller scope', function () {
          expect($scope.vm.transfer._id).toBe(mockTransfer._id);
          expect($scope.vm.transfer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/transfers/client/views/form-transfer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TransfersController,
          mockTransfer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('transfers.edit');
          $templateCache.put('modules/transfers/client/views/form-transfer.client.view.html', '');

          // create mock Transfer
          mockTransfer = new TransfersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Transfer Name'
          });

          //Initialize Controller
          TransfersController = $controller('TransfersController as vm', {
            $scope: $scope,
            transferResolve: mockTransfer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:transferId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.transferResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            transferId: 1
          })).toEqual('/transfers/1/edit');
        }));

        it('should attach an Transfer to the controller scope', function () {
          expect($scope.vm.transfer._id).toBe(mockTransfer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/transfers/client/views/form-transfer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
