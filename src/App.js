import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRR4, Nav, NavIcon, NavText } from 'react-sidenav'
import { Route, withRouter, Redirect } from 'react-router-dom'

// Icons
import MdGroupAdd from 'react-icons/lib/md/group-add'
import MdViewList from 'react-icons/lib/md/view-list'
import MdAddBox from 'react-icons/lib/md/add-box'
import MdRemoveCircle from 'react-icons/lib/md/remove-circle'

import './App.css'

import BalagForm from './BalagForm'
import List from './List'
import Tax from './Tax'

const SideNav = withRR4()

@inject('dataStore')
@withRouter
@observer
class App extends Component {
  dataStore = this.props.dataStore

  render () {
    return (
      <div className='App'>
        <div className='col-sm-2'>
          <div
            className='sidenav-custom'
            style={{
              backgroundColor: '#222'
            }}
          >
            <SideNav
              defaultSelected={this.props.location.pathname.slice(1)}
              highlightBgColor='#111'
              hoverBgColor='#111'
              highlightColor='white'
            >
              <Nav id='add'>
                <NavIcon><MdGroupAdd /></NavIcon>
                <NavText>Add records</NavText>
              </Nav>
              <Nav id='list'>
                <NavIcon><MdViewList /></NavIcon>
                <NavText>Show Records</NavText>
              </Nav>
              <Nav id='tax'>
                <NavIcon><MdAddBox /></NavIcon>
                <NavText>Tax Calculations</NavText>
              </Nav>
              <Nav id='logout'>
                <NavIcon><MdRemoveCircle /></NavIcon>
                <NavText><a href='/logout'>Logout</a></NavText>
              </Nav>
            </SideNav>
            <img
              src='/assets/mujib.png'
              alt='Sheikh Mujibur Rahman'
              id='mujib'
            />
          </div>
        </div>
        <div className='col-sm-10 container-fluid'>
          <div className='text-center'>
            <img src='/assets/banner.jpg' alt='আমার বাংলাদেশ' id='banner' />
          </div>
          {this.dataStore.message.length > 0 &&
            <div className='well'>{this.dataStore.message}</div>}
          <Route exact path='/' render={() => <Redirect to='/add' />} />
          <Route path='/add' component={BalagForm} />
          <Route path='/list' component={List} />
          <Route path='/tax' component={Tax} />
          <Route
            path='/logout'
            render={() => (
              <div>{Object.assign(window, { location: '/logout' })}</div>
            )}
          />
        </div>
      </div>
    )
  }
}

export default App
