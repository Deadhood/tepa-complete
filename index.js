const path = require('path')
const r = require('rethinkdb')
const morgan = require('morgan')
const Express = require('express')
const Passport = require('passport')
const rInit = require('rethinkdb-init')
const bodyParser = require('body-parser')
const { ensureLoggedIn } = require('connect-ensure-login')
const { Strategy: LocalStrategy } = require('passport-local')

// inintialize app and require configs
rInit(r)
const app = new Express()
const config = require('./config')

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('tiny'))
}

app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/assets', Express.static(path.join(__dirname, 'public')))
app.use(
  require('express-session')({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  })
)

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackConfig = require('./webpack.config')
  const hotMiddleware = require('webpack-hot-middleware')
  const devMiddleware = require('webpack-dev-middleware')
  const compiler = webpack(webpackConfig)

  app.use(
    devMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  )

  app.use(hotMiddleware(compiler, {
    path: '/__hmr'
  }))
}

const localRethinkStrategy = require('./utils/local-strategy')(r, config)

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(Passport.initialize())
app.use(Passport.session())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Setup our db so we can get started
r.init(config.database, [config.table, config.dataTable]).then(conn => {
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
    .error(console.error)
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

app.post('/add', ensureLoggedIn('/'), (req, res) => {
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
  const query = {}

  if (req.query) {
    for (let it in req.query) {
      const val = req.query[it]
      query[it] = isNaN(Number(val)) ? val : Number(val)
    }
  }

  r
    .db(config.database.db)
    .table(config.dataTable.name)
    .filter(query)
    .run(r.conn)
    .then(r => r.toArray())
    .then(data => {
      res.json(data)
    })
    .error(e => {
      console.error(e)
      res.status(404).json({})
    })
})

// do stuff when the file is run from cli
if (require.main === module) {
  const { isFreePort } = require('endpoint-utils')
  if (typeof config.port === 'undefined') {
    console.error(`Environment variables not set. Make sure .env file exists.`)
    process.exit(1)
  }
  isFreePort(config.database.port).then(free => {
    if (!free) {
      require('child_process').execFileSync('node', [
        path.resolve(__dirname, 'utils', 'seed-database.js')
      ])
    }

    if (free) {
      console.error(`RethinkDB is not running.`)
      process.exit(1)
    }
  })

  app.listen(config.port, function () {
    console.log(`Server listening on http://localhost:${config.port}/`)
  })
}
