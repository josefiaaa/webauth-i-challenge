const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');

const userRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');

const server = express();

const sessionConfig = {
    name: 'cookie monster',
    secret: 'Let\'s not and say we did.',
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
        secure: false,
    },
    resave: false,
    saveUninitialized: true,
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(morgan('dev'));
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    const username = req.session.username || 'stranger';
    res.send(`Hello ${username}!`);
});

module.exports = server;