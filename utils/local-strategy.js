const bcrypt = require('bcryptjs')

module.exports = (r, cfg) =>
  function (username, password, done) {
    r
      .db(cfg.database.db)
      .table(cfg.table.name)
      .filter(r.row('username').eq(username))
      .run(r.conn, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false)
        }

        user.toArray(function (err, result) {
          if (err) throw err
          if (result.length === 0) {
            return done(null, false)
          }
          if (!bcrypt.compareSync(password, result[0].password)) {
            return done(null, false)
          }
          return done(null, result[0])
        })
      })
  }
