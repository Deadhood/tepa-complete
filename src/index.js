import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import { HashRouter as Router } from 'react-router-dom'

import App from './App'
import DataStore from './DataStore'
import registerServiceWorker from './registerServiceWorker'

import 'bootswatch/cosmo/bootstrap.css'
import './font.css'
import './index.css'
import './navbar-fixed-side.css'

const stores = {
  dataStore: new DataStore()
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Router>
        <Provider {...stores}>
          <Component />
        </Provider>
      </Router>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
