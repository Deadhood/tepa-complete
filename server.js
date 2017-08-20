const path = require('path')
const glob = require('glob')
const r = require('rethinkdb')
const morgan = require('morgan')
const helmet = require('helmet')
const Express = require('express')
const Passport = require('passport')
const rInit = require('rethinkdb-init')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const { Strategy } = require('passport-local')
const localStrategy = require('./utils/local-strategy')
const { ensureLoggedIn } = require('connect-ensure-login')

const IS_DEV = process.env.NODE_ENV !== 'production'

// initialize app and require configs
rInit(r)
const app = new Express()
const config = require('./config')

const bgImages = glob
  .sync(path.join(__dirname, 'public', 'pics', '*'))
  .map(im => im.replace(path.join(__dirname, 'public'), '/assets'))

// Normalizer for req.query
function normalizeObj (obj) {
  const newObj = {}
  for (let prop in obj) {
    const val = obj[prop]
    newObj[prop] = isNaN(Number(val)) ? val : Number(val)
  }
  return newObj
}

// Enable HTTP logs on dev environment
if (IS_DEV) app.use(morgan('tiny'))

// Parse cookies and form data
app.set('trust proxy', 1)
app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({ keys: [config.secret], maxAge: 3.6e6, name: 'tepa1' }))

// Mount static assets
app.use('/assets', Express.static(path.join(__dirname, 'public')))

// Enable webpack dev middleware
if (IS_DEV) {
  const webpack = require('webpack')
  const devMiddleware = require('webpack-dev-middleware')
  const hotMiddleware = require('webpack-hot-middleware')

  const webConf = require('./webpack.config')
  const compiler = webpack(webConf)

  app.use(
    devMiddleware(compiler, {
      noInfo: true,
      publicPath: webConf.output.publicPath
    })
  )
  app.use(hotMiddleware(compiler, { path: '/__hmr' }))
}

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
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

const LocalRethink = localStrategy(r, config)

// Setup PassportJS local authentication strategy
Passport.use(new Strategy(LocalRethink))

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

// LOGIN Page
app.get('/', (req, res) => {
  res.render('index', {
    authed: req.isAuthenticated(),
    images: JSON.stringify(bgImages)
  })
})

// LOGIN -- handle login POST data
app.post(
  '/',
  Passport.authenticate('local', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/admin')
  }
)

// LOGIN -> /
app.get('/login', (req, res) => {
  res.redirect('/')
})

// ADMIN panel -- React app
app.get(['/admin', '/admin/*'], ensureLoggedIn('/'), (req, res) => {
  res.render('admin', { authed: req.isAuthenticated() })
})

// LOGOUT
app.get(['/logout', '/admin/logout'], (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/record', ensureLoggedIn('/'), (req, res) => {
  const query = req.query ? normalizeObj(req.query) : {}

  r
    .db(config.database.db)
    .table(config.dataTable.name)
    .filter(query)
    .run(r.conn)
    .then(r => r.toArray())
    .then(data => res.json(data))
})

app.post('/record', ensureLoggedIn('/'), (req, res) => {
  r
    .db(config.database.db)
    .table(config.dataTable.name)
    .insert(req.body)
    .run(r.conn)
    .then(result => {
      if (result.inserted === 1) return res.status(200).send('Success')
      return res.status(400).send('Failed')
    })
    .error(console.log)
})

// do stuff when the file is run from cli
if (require.main === module) {
  if (IS_DEV) {
    const rimraf = require('rimraf')
    const res = require('./utils/seed-database')

    if (res.inserted === 1) console.log('Inserted a dummy user into DB')

    rimraf(path.resolve(__dirname, 'public', 'static'), function (err) {
      if (err) throw err
      console.log(
        `Deleted static assets.`,
        `Server should serve those from memory.`
      )
    })
  }

  app.listen(config.port, function () {
    console.log(`Server listening on http://localhost:${config.port}/`)
  })
}
