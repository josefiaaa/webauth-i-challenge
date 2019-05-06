// const server = require('./server.js');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const Users = require('./users/users-model')


const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(morgan('dev'));

server.get('/', (req, res) => {
    res.send("It's working!");
});

server.post('/api/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));