import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRR4, Nav, NavIcon, NavText } from 'react-sidenav'

import { Route, withRouter } from 'react-router-dom'

// Icons
import MdGroupAdd from 'react-icons/lib/md/group-add'
import MdViewList from 'react-icons/lib/md/view-list'
import MdAddBox from 'react-icons/lib/md/add-box'

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
        <div className='col-sm-3'>
          <div
            className='sidenav-custom'
            style={{
              backgroundColor: '#222'
            }}
          >
            <SideNav
              defaultSelected='add'
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
            </SideNav>
          </div>
        </div>
        <div className='col-sm-9 container-fluid'>
          <div className='well'>{this.dataStore.message}</div>
          <Route exact path='/' component={BalagForm} />
          <Route path='/add' component={BalagForm} />
          <Route path='/list' component={List} />
          <Route path='/tax' component={Tax} />
        </div>
      </div>
    )
  }
}

export default App
