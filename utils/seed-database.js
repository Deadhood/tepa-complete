const bcrypt = require('bcryptjs')
const r = require('rethinkdb')
require('rethinkdb-init')(r)

const cfg = require('../config')

async function seedDatabase () {
  const conn = await r.init(cfg.database, [cfg.table])
  const connection = conn.use(cfg.database.db)
  const password = bcrypt.hashSync('password')
  return r
    .table(cfg.table.name)
    .insert({ username: 'admin', password })
    .run(connection)
}

if (require.main === module) {
  seedDatabase()
    .then(result => {
      if (result.inserted === 1) console.log('All Done!')
      process.exit(0)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

module.exports = seedDatabase
