import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import DataStore from './DataStore'
import registerServiceWorker from './registerServiceWorker'

import 'bootswatch/cosmo/bootstrap.css'
import './index.css'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider dataStore={new DataStore()}>
        <Component />
      </Provider>
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

registerServiceWorker()
