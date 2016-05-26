'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Donnor = mongoose.model('Donnor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, donnor;

/**
 * Donnor routes tests
 */
describe('Donnor CRUD tests', function () {

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

    // Save a user to the test db and create new Donnor
    user.save(function () {
      donnor = {
        name: 'Donnor name'
      };

      done();
    });
  });

  it('should be able to save a Donnor if logged in', function (done) {
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

        // Save a new Donnor
        agent.post('/api/donnors')
          .send(donnor)
          .expect(200)
          .end(function (donnorSaveErr, donnorSaveRes) {
            // Handle Donnor save error
            if (donnorSaveErr) {
              return done(donnorSaveErr);
            }

            // Get a list of Donnors
            agent.get('/api/donnors')
              .end(function (donnorsGetErr, donnorsGetRes) {
                // Handle Donnor save error
                if (donnorsGetErr) {
                  return done(donnorsGetErr);
                }

                // Get Donnors list
                var donnors = donnorsGetRes.body;

                // Set assertions
                (donnors[0].user._id).should.equal(userId);
                (donnors[0].name).should.match('Donnor name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Donnor if not logged in', function (done) {
    agent.post('/api/donnors')
      .send(donnor)
      .expect(403)
      .end(function (donnorSaveErr, donnorSaveRes) {
        // Call the assertion callback
        done(donnorSaveErr);
      });
  });

  it('should not be able to save an Donnor if no name is provided', function (done) {
    // Invalidate name field
    donnor.name = '';

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

        // Save a new Donnor
        agent.post('/api/donnors')
          .send(donnor)
          .expect(400)
          .end(function (donnorSaveErr, donnorSaveRes) {
            // Set message assertion
            (donnorSaveRes.body.message).should.match('Please fill Donnor name');

            // Handle Donnor save error
            done(donnorSaveErr);
          });
      });
  });

  it('should be able to update an Donnor if signed in', function (done) {
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

        // Save a new Donnor
        agent.post('/api/donnors')
          .send(donnor)
          .expect(200)
          .end(function (donnorSaveErr, donnorSaveRes) {
            // Handle Donnor save error
            if (donnorSaveErr) {
              return done(donnorSaveErr);
            }

            // Update Donnor name
            donnor.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Donnor
            agent.put('/api/donnors/' + donnorSaveRes.body._id)
              .send(donnor)
              .expect(200)
              .end(function (donnorUpdateErr, donnorUpdateRes) {
                // Handle Donnor update error
                if (donnorUpdateErr) {
                  return done(donnorUpdateErr);
                }

                // Set assertions
                (donnorUpdateRes.body._id).should.equal(donnorSaveRes.body._id);
                (donnorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Donnors if not signed in', function (done) {
    // Create new Donnor model instance
    var donnorObj = new Donnor(donnor);

    // Save the donnor
    donnorObj.save(function () {
      // Request Donnors
      request(app).get('/api/donnors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Donnor if not signed in', function (done) {
    // Create new Donnor model instance
    var donnorObj = new Donnor(donnor);

    // Save the Donnor
    donnorObj.save(function () {
      request(app).get('/api/donnors/' + donnorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', donnor.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Donnor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/donnors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Donnor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Donnor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Donnor
    request(app).get('/api/donnors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Donnor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Donnor if signed in', function (done) {
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

        // Save a new Donnor
        agent.post('/api/donnors')
          .send(donnor)
          .expect(200)
          .end(function (donnorSaveErr, donnorSaveRes) {
            // Handle Donnor save error
            if (donnorSaveErr) {
              return done(donnorSaveErr);
            }

            // Delete an existing Donnor
            agent.delete('/api/donnors/' + donnorSaveRes.body._id)
              .send(donnor)
              .expect(200)
              .end(function (donnorDeleteErr, donnorDeleteRes) {
                // Handle donnor error error
                if (donnorDeleteErr) {
                  return done(donnorDeleteErr);
                }

                // Set assertions
                (donnorDeleteRes.body._id).should.equal(donnorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Donnor if not signed in', function (done) {
    // Set Donnor user
    donnor.user = user;

    // Create new Donnor model instance
    var donnorObj = new Donnor(donnor);

    // Save the Donnor
    donnorObj.save(function () {
      // Try deleting Donnor
      request(app).delete('/api/donnors/' + donnorObj._id)
        .expect(403)
        .end(function (donnorDeleteErr, donnorDeleteRes) {
          // Set message assertion
          (donnorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Donnor error error
          done(donnorDeleteErr);
        });

    });
  });

  it('should be able to get a single Donnor that has an orphaned user reference', function (done) {
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

          // Save a new Donnor
          agent.post('/api/donnors')
            .send(donnor)
            .expect(200)
            .end(function (donnorSaveErr, donnorSaveRes) {
              // Handle Donnor save error
              if (donnorSaveErr) {
                return done(donnorSaveErr);
              }

              // Set assertions on new Donnor
              (donnorSaveRes.body.name).should.equal(donnor.name);
              should.exist(donnorSaveRes.body.user);
              should.equal(donnorSaveRes.body.user._id, orphanId);

              // force the Donnor to have an orphaned user reference
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

                    // Get the Donnor
                    agent.get('/api/donnors/' + donnorSaveRes.body._id)
                      .expect(200)
                      .end(function (donnorInfoErr, donnorInfoRes) {
                        // Handle Donnor error
                        if (donnorInfoErr) {
                          return done(donnorInfoErr);
                        }

                        // Set assertions
                        (donnorInfoRes.body._id).should.equal(donnorSaveRes.body._id);
                        (donnorInfoRes.body.name).should.equal(donnor.name);
                        should.equal(donnorInfoRes.body.user, undefined);

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
      Donnor.remove().exec(done);
    });
  });
});
