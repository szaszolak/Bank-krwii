(function () {
  'use strict';

  describe('Stations Controller Tests', function () {
    // Initialize global variables
    var StationsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      StationsService,
      mockStation;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _StationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      StationsService = _StationsService_;

      // create mock Station
      mockStation = new StationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Station Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Stations controller.
      StationsController = $controller('StationsController as vm', {
        $scope: $scope,
        stationResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleStationPostData;

      beforeEach(function () {
        // Create a sample Station object
        sampleStationPostData = new StationsService({
          name: 'Station Name'
        });

        $scope.vm.station = sampleStationPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (StationsService) {
        // Set POST response
        $httpBackend.expectPOST('api/stations', sampleStationPostData).respond(mockStation);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Station was created
        expect($state.go).toHaveBeenCalledWith('stations.view', {
          stationId: mockStation._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/stations', sampleStationPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Station in $scope
        $scope.vm.station = mockStation;
      });

      it('should update a valid Station', inject(function (StationsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/stations\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('stations.view', {
          stationId: mockStation._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (StationsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/stations\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Stations
        $scope.vm.station = mockStation;
      });

      it('should delete the Station and redirect to Stations', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/stations\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('stations.list');
      });

      it('should should not delete the Station and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
