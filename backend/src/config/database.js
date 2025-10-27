const { Pool } = require('pg');

// Connection string with explicit client encoding to avoid Windows codepage issues
const connectionString = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'readme_to_recover'}?client_encoding=UTF8`;

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar conexión
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la base de datos:', err);
  // process.exit(-1); // Comentado temporalmente para debugging
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
