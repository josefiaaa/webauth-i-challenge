// const server = require('./server.js');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const Users = require('./users/users-model');
const protected = require('./auth/protected-middleware.js');

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

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
              res.status(200).json({ message: `Welcome ${user.username}!` })
            } else {
              res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(err => {
          res.status(500).json(err)
        })
})

server.get('/api/users', protected, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));