const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

// const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/signup').post(UsersController.signUp);
router.route('/signin').post(passportSignIn, UsersController.signIn);
router.route('/').get(passportJWT, UsersController.getAllUsers);

module.exports = router;
