'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Blooddonations Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/blooddonations',
      permissions: '*'
    }, {
      resources: '/api/blooddonations/:blooddonationId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/blooddonations',
      permissions: ['get', 'post']
    }, {
      resources: '/api/blooddonations/:blooddonationId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/blooddonations',
      permissions: ['get']
    }, {
      resources: '/api/blooddonations/:blooddonationId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Blooddonations Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Blooddonation is being processed and the current user created it then allow any manipulation
  if (req.blooddonation && req.user && req.blooddonation.user && req.blooddonation.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
