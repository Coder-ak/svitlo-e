const jwt = require('jsonwebtoken');

const secret = require('crypto').randomBytes(64).toString('hex')

const token = jwt.sign({"user": "coder"}, secret);

console.log('Token: ', token, "\nSecret: ", secret);
