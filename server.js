var express = require('express');
var bodyParser = require('body-parser');
var users = require('./users.json');

var app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('/api/users', (req, res, next) => {
  let results = [];
  if (req.query.age) {
    results = users.filter((user) => { return (user.age === Number(req.query.age)); });
  } else if (req.query.language) {
    results = users.filter((user) => { return (user.language === req.query.language); });
  } else if (req.query.city) {
    results = users.filter((user) => { return (user.city === req.query.city); });
  } else if (req.query.state) {
    results = users.filter((user) => { return (user.state === req.query.state); });
  } else if (req.query.gender) {
    results = users.filter((user) => { return (user.gender === req.query.gender); });
  } else {
    results = users;
  }
  res.status(200).send(results);
});

const userTypes = ['admin', 'user', 'moderator'];

app.get('/api/users/:value', (req, res, next) => {
  let results = [];
  if (userTypes.includes(req.params.value)) {
    results = users.filter((user) => { return (user.type === req.params.value); });
  } else {
    let id = Number(req.params.value);
    results = users.filter((user) => {return (user.id === id)})[0];
  }
  if (!results) {
    res.status(404).send('User not found.');
  }
  res.status(200).send(results);
});

app.post('/api/users', (req, res, next) => {
  req.body.id = users.length + 1;
  users.push(req.body);
  res.status(200).send(req.body);
});

app.post('/api/users/:value', (req, res, next) => {
  if (userTypes.includes(req.params.value)) {
    req.body.id = users.length + 1;
    req.body.type = req.params.value;
    users.push(req.body);
    res.status(200).send(req.body);
  }
});

app.post('/api/users/language/:id', (req, res, next) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === Number(req.params.id)) {
      users[i].language = req.body.language;
      res.status(200).send(users[i]);
    }
  }
  res.status(404).send('User not found.');
});

app.post('/api/users/forums/:id', (req, res, next) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === Number(req.params.id)) {
      users[i].favorites.push(req.body.add);
      res.status(200).send(users[i]);
    }
  }
  res.status(404).send('User not found.');
});

app.delete('/api/users/forums/:id', (req, res, next) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === Number(req.params.id)) {
      let index = users[i].favorites.indexOf(req.query.favorite);
      users[i].favorites.splice(index, 1);
      res.status(200).send(users[i]);
    }
  }
  res.status(404).send('User not found.');
});

app.delete('/api/users/:id', (req, res, next) => {
  let index = users.findIndex((user) => { return (user.id === Number(req.params.id)); });
  users.splice(index, 1);
  res.status(200).send('User deleted.');
});

app.put('/api/users/:id', (req, res, next) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === Number(req.params.id)) {
      users[i] = req.body;
      res.status(200).send(users[i]);
    }
  }
  res.status(404).send('User not found.');
});

module.exports = app;
