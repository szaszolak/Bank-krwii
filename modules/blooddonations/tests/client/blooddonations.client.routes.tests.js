(function () {
  'use strict';

  describe('Blooddonations Route Tests', function () {
    // Initialize global variables
    var $scope,
      BlooddonationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BlooddonationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BlooddonationsService = _BlooddonationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('blooddonations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/blooddonations');
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
          BlooddonationsController,
          mockBlooddonation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('blooddonations.view');
          $templateCache.put('modules/blooddonations/client/views/view-blooddonation.client.view.html', '');

          // create mock Blooddonation
          mockBlooddonation = new BlooddonationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Blooddonation Name'
          });

          //Initialize Controller
          BlooddonationsController = $controller('BlooddonationsController as vm', {
            $scope: $scope,
            blooddonationResolve: mockBlooddonation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:blooddonationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.blooddonationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            blooddonationId: 1
          })).toEqual('/blooddonations/1');
        }));

        it('should attach an Blooddonation to the controller scope', function () {
          expect($scope.vm.blooddonation._id).toBe(mockBlooddonation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/blooddonations/client/views/view-blooddonation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BlooddonationsController,
          mockBlooddonation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('blooddonations.create');
          $templateCache.put('modules/blooddonations/client/views/form-blooddonation.client.view.html', '');

          // create mock Blooddonation
          mockBlooddonation = new BlooddonationsService();

          //Initialize Controller
          BlooddonationsController = $controller('BlooddonationsController as vm', {
            $scope: $scope,
            blooddonationResolve: mockBlooddonation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.blooddonationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/blooddonations/create');
        }));

        it('should attach an Blooddonation to the controller scope', function () {
          expect($scope.vm.blooddonation._id).toBe(mockBlooddonation._id);
          expect($scope.vm.blooddonation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/blooddonations/client/views/form-blooddonation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BlooddonationsController,
          mockBlooddonation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('blooddonations.edit');
          $templateCache.put('modules/blooddonations/client/views/form-blooddonation.client.view.html', '');

          // create mock Blooddonation
          mockBlooddonation = new BlooddonationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Blooddonation Name'
          });

          //Initialize Controller
          BlooddonationsController = $controller('BlooddonationsController as vm', {
            $scope: $scope,
            blooddonationResolve: mockBlooddonation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:blooddonationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.blooddonationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            blooddonationId: 1
          })).toEqual('/blooddonations/1/edit');
        }));

        it('should attach an Blooddonation to the controller scope', function () {
          expect($scope.vm.blooddonation._id).toBe(mockBlooddonation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/blooddonations/client/views/form-blooddonation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
