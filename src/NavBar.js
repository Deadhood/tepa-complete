import React, { Component } from 'react'

import './navbar-fixed-side.css'

class NavBar extends Component {
  render () {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-side'>
        <div className='collapse navbar-collapse'>
          <ul className='nav navbar-nav'>
            <li className='active'>
              <a href='#'>Link <span className='sr-only'>(current)</span></a>
            </li>
            <li><a href='#'>Link</a></li>
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li><a href='#'>Link</a></li>
            <li className='dropdown'>
              <a
                href='#'
                className='dropdown-toggle'
                dataToggle='dropdown'
                role='button'
                ariaHaspopup='true'
                ariaExpanded='false'
              >
                Dropdown <span className='caret' />
              </a>
              <ul className='dropdown-menu'>
                <li><a href='#'>Action</a></li>
                <li><a href='#'>Another action</a></li>
                <li><a href='#'>Something else here</a></li>
                <li role='separator' className='divider' />
                <li><a href='#'>Separated link</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default NavBar
