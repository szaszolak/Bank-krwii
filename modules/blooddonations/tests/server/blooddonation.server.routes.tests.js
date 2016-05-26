'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Blooddonation = mongoose.model('Blooddonation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, blooddonation;

/**
 * Blooddonation routes tests
 */
describe('Blooddonation CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Blooddonation
    user.save(function () {
      blooddonation = {
        name: 'Blooddonation name'
      };

      done();
    });
  });

  it('should be able to save a Blooddonation if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blooddonation
        agent.post('/api/blooddonations')
          .send(blooddonation)
          .expect(200)
          .end(function (blooddonationSaveErr, blooddonationSaveRes) {
            // Handle Blooddonation save error
            if (blooddonationSaveErr) {
              return done(blooddonationSaveErr);
            }

            // Get a list of Blooddonations
            agent.get('/api/blooddonations')
              .end(function (blooddonationsGetErr, blooddonationsGetRes) {
                // Handle Blooddonation save error
                if (blooddonationsGetErr) {
                  return done(blooddonationsGetErr);
                }

                // Get Blooddonations list
                var blooddonations = blooddonationsGetRes.body;

                // Set assertions
                (blooddonations[0].user._id).should.equal(userId);
                (blooddonations[0].name).should.match('Blooddonation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Blooddonation if not logged in', function (done) {
    agent.post('/api/blooddonations')
      .send(blooddonation)
      .expect(403)
      .end(function (blooddonationSaveErr, blooddonationSaveRes) {
        // Call the assertion callback
        done(blooddonationSaveErr);
      });
  });

  it('should not be able to save an Blooddonation if no name is provided', function (done) {
    // Invalidate name field
    blooddonation.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blooddonation
        agent.post('/api/blooddonations')
          .send(blooddonation)
          .expect(400)
          .end(function (blooddonationSaveErr, blooddonationSaveRes) {
            // Set message assertion
            (blooddonationSaveRes.body.message).should.match('Please fill Blooddonation name');

            // Handle Blooddonation save error
            done(blooddonationSaveErr);
          });
      });
  });

  it('should be able to update an Blooddonation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blooddonation
        agent.post('/api/blooddonations')
          .send(blooddonation)
          .expect(200)
          .end(function (blooddonationSaveErr, blooddonationSaveRes) {
            // Handle Blooddonation save error
            if (blooddonationSaveErr) {
              return done(blooddonationSaveErr);
            }

            // Update Blooddonation name
            blooddonation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Blooddonation
            agent.put('/api/blooddonations/' + blooddonationSaveRes.body._id)
              .send(blooddonation)
              .expect(200)
              .end(function (blooddonationUpdateErr, blooddonationUpdateRes) {
                // Handle Blooddonation update error
                if (blooddonationUpdateErr) {
                  return done(blooddonationUpdateErr);
                }

                // Set assertions
                (blooddonationUpdateRes.body._id).should.equal(blooddonationSaveRes.body._id);
                (blooddonationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Blooddonations if not signed in', function (done) {
    // Create new Blooddonation model instance
    var blooddonationObj = new Blooddonation(blooddonation);

    // Save the blooddonation
    blooddonationObj.save(function () {
      // Request Blooddonations
      request(app).get('/api/blooddonations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Blooddonation if not signed in', function (done) {
    // Create new Blooddonation model instance
    var blooddonationObj = new Blooddonation(blooddonation);

    // Save the Blooddonation
    blooddonationObj.save(function () {
      request(app).get('/api/blooddonations/' + blooddonationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', blooddonation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Blooddonation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/blooddonations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Blooddonation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Blooddonation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Blooddonation
    request(app).get('/api/blooddonations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Blooddonation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Blooddonation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blooddonation
        agent.post('/api/blooddonations')
          .send(blooddonation)
          .expect(200)
          .end(function (blooddonationSaveErr, blooddonationSaveRes) {
            // Handle Blooddonation save error
            if (blooddonationSaveErr) {
              return done(blooddonationSaveErr);
            }

            // Delete an existing Blooddonation
            agent.delete('/api/blooddonations/' + blooddonationSaveRes.body._id)
              .send(blooddonation)
              .expect(200)
              .end(function (blooddonationDeleteErr, blooddonationDeleteRes) {
                // Handle blooddonation error error
                if (blooddonationDeleteErr) {
                  return done(blooddonationDeleteErr);
                }

                // Set assertions
                (blooddonationDeleteRes.body._id).should.equal(blooddonationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Blooddonation if not signed in', function (done) {
    // Set Blooddonation user
    blooddonation.user = user;

    // Create new Blooddonation model instance
    var blooddonationObj = new Blooddonation(blooddonation);

    // Save the Blooddonation
    blooddonationObj.save(function () {
      // Try deleting Blooddonation
      request(app).delete('/api/blooddonations/' + blooddonationObj._id)
        .expect(403)
        .end(function (blooddonationDeleteErr, blooddonationDeleteRes) {
          // Set message assertion
          (blooddonationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Blooddonation error error
          done(blooddonationDeleteErr);
        });

    });
  });

  it('should be able to get a single Blooddonation that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Blooddonation
          agent.post('/api/blooddonations')
            .send(blooddonation)
            .expect(200)
            .end(function (blooddonationSaveErr, blooddonationSaveRes) {
              // Handle Blooddonation save error
              if (blooddonationSaveErr) {
                return done(blooddonationSaveErr);
              }

              // Set assertions on new Blooddonation
              (blooddonationSaveRes.body.name).should.equal(blooddonation.name);
              should.exist(blooddonationSaveRes.body.user);
              should.equal(blooddonationSaveRes.body.user._id, orphanId);

              // force the Blooddonation to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Blooddonation
                    agent.get('/api/blooddonations/' + blooddonationSaveRes.body._id)
                      .expect(200)
                      .end(function (blooddonationInfoErr, blooddonationInfoRes) {
                        // Handle Blooddonation error
                        if (blooddonationInfoErr) {
                          return done(blooddonationInfoErr);
                        }

                        // Set assertions
                        (blooddonationInfoRes.body._id).should.equal(blooddonationSaveRes.body._id);
                        (blooddonationInfoRes.body.name).should.equal(blooddonation.name);
                        should.equal(blooddonationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Blooddonation.remove().exec(done);
    });
  });
});
