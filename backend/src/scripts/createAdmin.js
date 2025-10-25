require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    console.log('\n=== Crear Usuario Administrador ===\n');

    const name = await question('Nombre completo: ');
    const email = await question('Email: ');
    const password = await question('Contraseña (mínimo 6 caracteres): ');

    if (password.length < 6) {
      console.error('❌ La contraseña debe tener al menos 6 caracteres');
      process.exit(1);
    }

    // Verificar si el email ya existe
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.error('❌ Ya existe un usuario con ese email');
      process.exit(1);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    console.log('\n✅ Usuario administrador creado exitosamente:');
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Nombre: ${result.rows[0].name}`);
    console.log(`   Email: ${result.rows[0].email}`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    process.exit(1);
  }
}

createAdmin();
