const bcrypt = require('bcrypt');

const password = 'mico1234';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Password hash:', hash);
  }
});
