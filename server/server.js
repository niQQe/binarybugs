const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const SocketConnection = require('./models/socket/notifications');

mongoose.connect('mongodb://localhost/socket', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(cors());

const SOCKET = new SocketConnection(4000);

SOCKET.handle();


app.use('/users', require('./routes/users'));
app.use('/notifications', require('./routes/notifications'));

const getAllNotifications = async () => await Notification.find({});


app.listen(5000);

console.log(`Server started on port 5000`);
