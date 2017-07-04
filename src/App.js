import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRR4, Nav, NavText } from 'react-sidenav'

import { Route } from 'react-router-dom'

import './App.css'

import BalagForm from './BalagForm'

const SideNav = withRR4()

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='col-sm-2'>
          <div
            className='navbar-fixed-side'
            style={{
              backgroundColor: '#222'
            }}
          >
            <SideNav
              default='add'
              highlightBgColor='#111'
              hoverBgColor='#111'
              highlightColor='white'
            >
              <Nav id='add'>
                <NavText>Add records</NavText>
              </Nav>
            </SideNav>
          </div>
        </div>
        <div className='col-sm-10 container-fluid'>
          <div className='well'>{this.props.dataStore.message}</div>
          <Route exact path='/' component={BalagForm} />
          <Route path='/add' component={BalagForm} />
        </div>
      </div>
    )
  }
}

export default inject('dataStore')(observer(App))
