const path = require('path')
const Express = require('express')
const Passport = require('passport')
const bodyParser = require('body-parser')
const { ensureLoggedIn } = require('connect-ensure-login')
const { Strategy: LocalStrategy } = require('passport-local')
const r = require('rethinkdb')
require('rethinkdb-init')(r)


const app = new Express()
const config = require('./config')

if (process.env.NODE_ENV !== 'production') { app.use(require('morgan')('combined')) }

app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(Express.static(path.join(__dirname, 'public')))
app.use(
  require('express-session')({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  })
)

const localRethinkStrategy = require('./utils/local-strategy')(r, config)

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(Passport.initialize())
app.use(Passport.session())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Setup our db so we can get started
r
  .init(config.database, [config.table, config.dataTable])
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
    .db(config.database.db)
    .table(config.table.name)
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
})

// Setup the views
app.get('/', (req, res) => {
  res.render('index', { authed: req.isAuthenticated() })
})

app.get('/admin', ensureLoggedIn('/'), (req, res) => {
  res.render('admin', { authed: req.isAuthenticated() })
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.redirect('/')
})

app.post(
  '/login',
  Passport.authenticate('local', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/admin')
  }
)

app.post('/add', (req, res) => {
  r
    .db(config.database.db)
    .table(config.dataTable.name)
    .insert(req.body)
    .run(r.conn)
    .then(result => {
      if (result.inserted === 1) return res.status(200).send('Success')
      return res.status(400).send('Failed')
    })
    .error(e => {
      console.log(e)
    })
})

app.get('/view', ensureLoggedIn('/'), (req, res) => {
  r
    .db(config.database.db)
    .table(config.dataTable.name)
    .run(r.conn)
    .then(r => r.toArray())
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .error(e => {
      console.log(e)
      res.status(404).json({})
    })
})


app.listen(config.port, function () {
  console.log(`Server listening on port ${config.port}!`)
})
