require('dotenv').config()

const bcrypt = require('bcryptjs')
const r = require('rethinkdb')
require('rethinkdb-init')(r)

r
  .init(
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  [
    {
      name: 'admins',
      indexes: ['username']
    }
  ]
  )
  .then(conn => {
    r
      .db(process.env.DB_NAME)
      .table('admins')
      .insert({
        username: 'admin',
        password: bcrypt.hashSync('password')
      })
      .run(conn)
      .then(() => {
        console.log('All Done!')
        process.exit(0)
      })
      .error(e => {
        console.log(e)
        process.exit(1 + Math.ceil(Math.random() * 10))
      })
  })
  .catch(e => {
    console.log(e)
    process.exit(1 + Math.ceil(Math.random() * 10))
  })
