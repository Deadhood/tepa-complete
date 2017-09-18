import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import DataStore from './DataStore'

import 'bootswatch/cosmo/bootstrap.min.css'
import './font.css'
import './index.css'
import './navbar-fixed-side.css'

const stores = {
  dataStore: new DataStore()
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Router basename='/admin'>
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
