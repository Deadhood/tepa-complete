const bcrypt = require('bcryptjs')
const r = require('rethinkdb')
require('rethinkdb-init')(r)

const config = require('../config')

r
  .init(config.database, [config.table])
  .then(conn => {
    r
      .db(config.database.db)
      .table(config.table.name)
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
