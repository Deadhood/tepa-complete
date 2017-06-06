if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}

const path = require('path')
const Express = require('express')
const Passport = require('passport')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const { ensureLoggedIn } = require('connect-ensure-login')
const { Strategy: LocalStrategy } = require('passport-local')

const r = require('rethinkdb')
require('rethinkdb-init')(r)
const app = new Express()

if (process.env.NODE_ENV !== 'production') { app.use(require('morgan')('combined')) }

app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(Express.static(path.join(__dirname, 'public')))
app.use(
  require('express-session')({
    secret: process.env.ESESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

const localRethinkStrategy = require('./utils/local-strategy')(r, config.db)

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(Passport.initialize())
app.use(Passport.session())
app.use(flash())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Setup our db so we can get started
r
  .init(config, [
    {
      name: 'admins'
    }
  ])
  .then(conn => {
    r.conn = conn
  })

// Setup PassportJS local authentication strategy
Passport.use(new LocalStrategy(localRethinkStrategy))

// Provide a user serialization method
Passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// Deserialize the user: Get the record from the db and return it
Passport.deserializeUser(function (id, done) {
  r
    .db(config.db)
    .table('admins')
    .filter(r.row('id').eq(id))
    .run(r.conn)
    .then(user => {
      if (!user) return done(null, false)
      return user.toArray()
    })
    .then(res => done(null, res[0]))
    .error(e => {
      throw e
    })
    .catch(e => {
      throw e
    })
})

// Setup the views
app.get('/', function (req, res) {
  res.render('index', { authed: req.isAuthenticated() })
})

app.get('/admin', ensureLoggedIn('/'), function (req, res) {
  res.render('admin', { authed: req.isAuthenticated() })
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.post(
  '/login',
  Passport.authenticate('local', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/admin')
  }
)

app.listen(process.env.SERVER_PORT, function () {
  console.log(`Server listening on port ${process.env.SERVER_PORT}!`)
})
