'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Blooddonation = mongoose.model('Blooddonation');

/**
 * Globals
 */
var user, blooddonation;

/**
 * Unit tests
 */
describe('Blooddonation Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      blooddonation = new Blooddonation({
        name: 'Blooddonation Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return blooddonation.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      blooddonation.name = '';

      return blooddonation.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Blooddonation.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
