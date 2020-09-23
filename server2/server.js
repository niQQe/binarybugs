const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const UserService = require('./models/socket/UserService');
const { userInfo } = require('os');

mongoose.connect('mongodb://localhost/socket', { useNewUrlParser: true, useUnifiedTopology: true });



const IO = require('socket.io').listen(4000).sockets;

const app = express();

app.use(express.json());
app.use(cors());

const USER_SERVICE = new UserService(IO, mongoose);

USER_SERVICE.init();

app.use('/users', require('./routes/users'));
app.use('/notifications', require('./routes/notifications'));

const getAllNotifications = async () => await Notification.find({});

app.listen(5000);

console.log(`Server started on port 5000`);
