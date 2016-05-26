(function () {
  'use strict';

  describe('Transfers Controller Tests', function () {
    // Initialize global variables
    var TransfersController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TransfersService,
      mockTransfer;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TransfersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TransfersService = _TransfersService_;

      // create mock Transfer
      mockTransfer = new TransfersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Transfer Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Transfers controller.
      TransfersController = $controller('TransfersController as vm', {
        $scope: $scope,
        transferResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTransferPostData;

      beforeEach(function () {
        // Create a sample Transfer object
        sampleTransferPostData = new TransfersService({
          name: 'Transfer Name'
        });

        $scope.vm.transfer = sampleTransferPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TransfersService) {
        // Set POST response
        $httpBackend.expectPOST('api/transfers', sampleTransferPostData).respond(mockTransfer);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Transfer was created
        expect($state.go).toHaveBeenCalledWith('transfers.view', {
          transferId: mockTransfer._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/transfers', sampleTransferPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Transfer in $scope
        $scope.vm.transfer = mockTransfer;
      });

      it('should update a valid Transfer', inject(function (TransfersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/transfers\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('transfers.view', {
          transferId: mockTransfer._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TransfersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/transfers\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Transfers
        $scope.vm.transfer = mockTransfer;
      });

      it('should delete the Transfer and redirect to Transfers', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/transfers\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('transfers.list');
      });

      it('should should not delete the Transfer and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
