import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import { HashRouter as Router, Route } from 'react-router-dom'

import App from './App'
import DataStore from './DataStore'
import registerServiceWorker from './registerServiceWorker'

import 'bootswatch/cosmo/bootstrap.css'
import './index.css'

const render = Component => {
  ReactDOM.render(<Component />, document.getElementById('root'))
}

const Container = props => (
  <AppContainer>
    <Provider dataStore={new DataStore()}>
      {props.children}
    </Provider>
  </AppContainer>
)

const Routing = () => (
  <Router>
    <div>
      <Route exact path='' component={<Container><App /></Container>} />
      <Route path='view' component={() => <h1>Hello</h1>} />
    </div>
  </Router>
)

render(Routing)

if (module.hot) {
  module.hot.accept('./App', () => {
    render(Routing)
  })
}

registerServiceWorker()
