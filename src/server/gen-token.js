const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

if (process.argv[2] != null ) {
  const secret = process.env.TOKEN_SECRET || require('crypto').randomBytes(64).toString('hex');
  const token = jwt.sign({"area": process.argv[2]}, secret);

  console.log('Token: ', token, "\nSecret: ", secret);
} else {
  console.log('node gen-token.js [username]');
}
