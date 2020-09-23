const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const NotificationsController = require('../controllers/notifications');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/').get(passportJWT, NotificationsController.getAll )


module.exports = router;