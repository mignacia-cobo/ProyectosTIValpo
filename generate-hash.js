const bcrypt = require('bcryptjs');

const password = 'mico1234';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Hash generado para "mico1234":');
  console.log(hash);
  
  // Verificar que el hash funciona
  bcrypt.compare(password, hash, function(err, result) {
    if (err) {
      console.error('Error al verificar:', err);
    } else {
      console.log('Verificación:', result ? '✅ OK' : '❌ FAIL');
    }
  });
});
