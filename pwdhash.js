const bcrypt = require('bcrypt');

const plainPassword = 'tester123';

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});