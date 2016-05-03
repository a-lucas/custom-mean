/**
 * Created by bodhi on 1/21/16.
 */

'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Provider = mongoose.model('Provider'),
  Q = require('q'),
  debug = require('debug'),
  info = debug('oauth:userProvider:info'),
  error = debug('oauth:userProvider:error'),
  _ = require('lodash');


/**
 *
 * Search by providerName and providerId
 * Reject if none
 * Resolve one
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.findProvider = function (userData) {

  info('Calling findProvider with email = %s, userId = %s, proviuderName = %s, providerId = %s', userData.me.email, userData.userId, userData.providerName, userData.me.providerId);

  var deferred = Q.defer();

  /*
  Provider.find({
    providerName: userData.me.providerName,
    providerId: userData.me.providerId
  }).remove().exec();
*/
  Provider.findOne({
    providerName: userData.providerName,
    providerId: userData.me.providerId
  }, function (err, pro) {
    if (err) {
      throw err;
    }
    if (pro) {
      userData.provider = pro;
      info('Provider found with ', pro);
      deferred.resolve(userData);
    } else {
      error('No provider found');
      deferred.reject(userData);
    }
  });
  return deferred.promise;

};

/**
 *
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.findProviderEmail = function (userData) {

  //Provider.find({ email:userData.me.email }).remove().exec();

  info('Calling findProviderEmail with email, userId', userData.me.email, userData.userId);

  var deferred = Q.defer();
  if (userData.provider && userData.userId) {
    info('Provider already found:', userData.provider);
    deferred.resolve(userData);
  } else {
    Provider.findOne(
      {
        email: userData.me.email,
        providerName: {
          '$ne': userData.me.providerName
        }
      }, function (err, pro) {
      if (err) {
        error('Error finding provider', err);
        throw err;
      }
      if (pro) {
        userData.userId = pro.user;
        userData.provider = pro;
        info('Provider found', pro);
        deferred.resolve(userData);
      } else {
        error('Provider not found');
        deferred.reject(userData);
      }
    });
  }
  return deferred.promise;
};

/**
 *
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.createProvider = function (userData) {
  info('Calling createProvider with email, userId', userData.me.email, userData.userId);

  var deferred = Q.defer();
  if (!userData.userId) {
    debug('failed: no UserId defined');
    deferred.reject(userData);
  }
  if (userData.provider) {
    info('found an already defined provider');
    deferred.resolve(userData);
  } else {

    userData.me.userId = userData.userId;
    userData.me.providerName = userData.me.credentials.provider;

    var newProvider = new Provider(userData.me);

    info('Going to create new Provider = ', newProvider);
    info('UserData = ', userData);

    newProvider.save(function (err, res) {
      if (err) {
        error('Problem saving new Provider', err, res);
        throw new Error(err);
      }
      userData.provider = res;
      deferred.resolve(userData);
    });

  }
  return deferred.promise;
};

/**
 *
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.createUser = function (userData) {
  info('Calling createUser with email, userId  = ', userData.me.email, userData.userId);

  var deferred = Q.defer();

  info(userData.provider);

  //User.find({ email:userData.me.email }).remove().exec();

  //FBFriendModel.find({ id:333 }).remove( callback )

  var newUser = new User({
    email: userData.me.email,
    displayName: userData.me.displayName,
    firstName: userData.me.firstName,
    lastName: userData.me.lastName,
    profileImageURL: userData.me.profileImageUrl
  });

  info('ME = ', userData.me);

  newUser.save(function (err, user) {
    if (err) {
      error('Error inserting the new user', err, newUser);
      throw err;
    }
    userData.userId = user._id;
    userData.user = user;

    return deferred.resolve(userData);

  });
  return deferred.promise;
};

/**
 *
 * @param me
 * @param credentials
 * @returns {{email: *, displayName: *, firstName: *, lastName: *, profileImageUrl: *, profileUrl: *, providerId: *, credentials: *}}
 */
exports.loadInMe = function (me, credentials) {
  return {
    email: me.email,
    displayName: me.name,
    firstName: me.firstname,
    lastName: me.lastname,
    profileImageUrl: me.avatar,
    profileUrl: me.url,
    providerId: me.id,
    credentials: credentials
  };
};

/**
 *
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.linkProviderToUser = function (userData) {

  info('Calling linkProviderToUser with email, userId  = ', userData.me.email, userData.userId);

  var deferred = Q.defer();

  if (!userData.user) {
    error('rejected, reason: no \'user\' defined');
    deferred.reject(userData);
  } else if (!userData.provider) {
    error('rejected, reason: no \'provider\' defined');
    deferred.reject(userData);
  } else {
    info('providers =  = ', userData.user.providers);

    if (!_.isArray(userData.user.providers)) {
      userData.user.providers = [];
    }
    userData.user.providers.push(userData.provider._id);
    userData.user.save(function (err, user) {
      if (err) {
        error('Error saving the user ', userData.user);
        throw err;
      }
      userData.user = user;
      deferred.resolve(userData);
    });
  }
  return deferred.promise;

};


/**
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.findUserById = function (userData) {
  info('Calling findUserById with userData = ', userData);
  var deferred = Q.defer();

  if (userData.userId && userData.user) {
    error('USe is already found');
    deferred.resolve(userData);
  }
  else if (!userData.userId) {
    error('findUSer failed - no userId');
    deferred.reject(userData);
  } else {
    User.findById(userData.userId, function (err, user) {
      if (err) {
        error('Can\'t create userL ', err);
        throw err;
      }
      userData.user = user;
      deferred.resolve(userData);
    });
  }
  return deferred.promise;
};

/**
 *
 * @param userData
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.findUser = function (userData) {
  info('Calling findUser with userData.provider = ', userData.provider);
  var deferred = Q.defer();

  if (userData.userId && userData.user) {
    deferred.resolve(userData);
  }
  if (userData.provider) {
    User.findOne({
      providers: { '$in': [userData.provider._id] }
    }).exec(function (err, user) {
      if (err) {
        error('Error finding User:: ', err);
        throw err;
      }
      if (user) {
        userData.user = user;
        deferred.resolve(userData);
      } else {
        deferred.reject(userData);
      }

    });
  }
  return deferred.promise;
};
