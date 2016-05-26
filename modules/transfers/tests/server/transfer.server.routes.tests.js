'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transfer = mongoose.model('Transfer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, transfer;

/**
 * Transfer routes tests
 */
describe('Transfer CRUD tests', function () {

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

    // Save a user to the test db and create new Transfer
    user.save(function () {
      transfer = {
        name: 'Transfer name'
      };

      done();
    });
  });

  it('should be able to save a Transfer if logged in', function (done) {
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

        // Save a new Transfer
        agent.post('/api/transfers')
          .send(transfer)
          .expect(200)
          .end(function (transferSaveErr, transferSaveRes) {
            // Handle Transfer save error
            if (transferSaveErr) {
              return done(transferSaveErr);
            }

            // Get a list of Transfers
            agent.get('/api/transfers')
              .end(function (transfersGetErr, transfersGetRes) {
                // Handle Transfer save error
                if (transfersGetErr) {
                  return done(transfersGetErr);
                }

                // Get Transfers list
                var transfers = transfersGetRes.body;

                // Set assertions
                (transfers[0].user._id).should.equal(userId);
                (transfers[0].name).should.match('Transfer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Transfer if not logged in', function (done) {
    agent.post('/api/transfers')
      .send(transfer)
      .expect(403)
      .end(function (transferSaveErr, transferSaveRes) {
        // Call the assertion callback
        done(transferSaveErr);
      });
  });

  it('should not be able to save an Transfer if no name is provided', function (done) {
    // Invalidate name field
    transfer.name = '';

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

        // Save a new Transfer
        agent.post('/api/transfers')
          .send(transfer)
          .expect(400)
          .end(function (transferSaveErr, transferSaveRes) {
            // Set message assertion
            (transferSaveRes.body.message).should.match('Please fill Transfer name');

            // Handle Transfer save error
            done(transferSaveErr);
          });
      });
  });

  it('should be able to update an Transfer if signed in', function (done) {
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

        // Save a new Transfer
        agent.post('/api/transfers')
          .send(transfer)
          .expect(200)
          .end(function (transferSaveErr, transferSaveRes) {
            // Handle Transfer save error
            if (transferSaveErr) {
              return done(transferSaveErr);
            }

            // Update Transfer name
            transfer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Transfer
            agent.put('/api/transfers/' + transferSaveRes.body._id)
              .send(transfer)
              .expect(200)
              .end(function (transferUpdateErr, transferUpdateRes) {
                // Handle Transfer update error
                if (transferUpdateErr) {
                  return done(transferUpdateErr);
                }

                // Set assertions
                (transferUpdateRes.body._id).should.equal(transferSaveRes.body._id);
                (transferUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Transfers if not signed in', function (done) {
    // Create new Transfer model instance
    var transferObj = new Transfer(transfer);

    // Save the transfer
    transferObj.save(function () {
      // Request Transfers
      request(app).get('/api/transfers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Transfer if not signed in', function (done) {
    // Create new Transfer model instance
    var transferObj = new Transfer(transfer);

    // Save the Transfer
    transferObj.save(function () {
      request(app).get('/api/transfers/' + transferObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', transfer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Transfer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/transfers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Transfer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Transfer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Transfer
    request(app).get('/api/transfers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Transfer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Transfer if signed in', function (done) {
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

        // Save a new Transfer
        agent.post('/api/transfers')
          .send(transfer)
          .expect(200)
          .end(function (transferSaveErr, transferSaveRes) {
            // Handle Transfer save error
            if (transferSaveErr) {
              return done(transferSaveErr);
            }

            // Delete an existing Transfer
            agent.delete('/api/transfers/' + transferSaveRes.body._id)
              .send(transfer)
              .expect(200)
              .end(function (transferDeleteErr, transferDeleteRes) {
                // Handle transfer error error
                if (transferDeleteErr) {
                  return done(transferDeleteErr);
                }

                // Set assertions
                (transferDeleteRes.body._id).should.equal(transferSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Transfer if not signed in', function (done) {
    // Set Transfer user
    transfer.user = user;

    // Create new Transfer model instance
    var transferObj = new Transfer(transfer);

    // Save the Transfer
    transferObj.save(function () {
      // Try deleting Transfer
      request(app).delete('/api/transfers/' + transferObj._id)
        .expect(403)
        .end(function (transferDeleteErr, transferDeleteRes) {
          // Set message assertion
          (transferDeleteRes.body.message).should.match('User is not authorized');

          // Handle Transfer error error
          done(transferDeleteErr);
        });

    });
  });

  it('should be able to get a single Transfer that has an orphaned user reference', function (done) {
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

          // Save a new Transfer
          agent.post('/api/transfers')
            .send(transfer)
            .expect(200)
            .end(function (transferSaveErr, transferSaveRes) {
              // Handle Transfer save error
              if (transferSaveErr) {
                return done(transferSaveErr);
              }

              // Set assertions on new Transfer
              (transferSaveRes.body.name).should.equal(transfer.name);
              should.exist(transferSaveRes.body.user);
              should.equal(transferSaveRes.body.user._id, orphanId);

              // force the Transfer to have an orphaned user reference
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

                    // Get the Transfer
                    agent.get('/api/transfers/' + transferSaveRes.body._id)
                      .expect(200)
                      .end(function (transferInfoErr, transferInfoRes) {
                        // Handle Transfer error
                        if (transferInfoErr) {
                          return done(transferInfoErr);
                        }

                        // Set assertions
                        (transferInfoRes.body._id).should.equal(transferSaveRes.body._id);
                        (transferInfoRes.body.name).should.equal(transfer.name);
                        should.equal(transferInfoRes.body.user, undefined);

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
      Transfer.remove().exec(done);
    });
  });
});
