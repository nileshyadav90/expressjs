var express = require('express');
const user = require('../models/user');
const { createUser, loginUser } = require('../library/authentication');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async function(req, res, next) {
  try {
    let input = req.body;
    let r = await loginUser({
      email: input.email,
      password: input.password
    });
    res.cookie("access-token", r.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 86400,
     });
    res.send({ data: { ...r }, message: 'Data found'});
  } catch(e) {
    res.send({ message: e.toString()});
  }
});

router.post('/register', async function(req, res, next) {
  try {
    let input = req.body;
    let r = await createUser({
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      password: input.password
    });
    res.send({ data: { ...r }, message: 'Account created'});
  } catch(e) {
    res.status(400).send({ message: e.toString()});
  }
});

module.exports = router;
