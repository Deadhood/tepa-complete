require('dotenv').config()

module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  table: {
    name: 'admins',
    indexes: ['username']
  },
  dataTable: {
    name: 'people'
  },
  secret: process.env.ESESSION_SECRET,
  port: process.env.SERVER_PORT
}
