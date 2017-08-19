import React, { Component } from 'react'
import './List.css'
const { fetch } = window

class List extends Component {
  state = {
    selected: '',
    value: '',
    data: []
  }

  render () {
    return (
      <div className='List'>
        <div className='form-group'>
          <label className='radio-inline'>
            <input
              onChange={this.selectType}
              type='radio'
              value='nid-bc'
              name='type'
              className='radio'
            />
            NID/BC
          </label>

          <label className='radio-inline'>
            <input
              onChange={this.selectType}
              type='radio'
              value='poribar-prodhan'
              name='type'
              className='radio'
            />
            Name
          </label>

          <label className='radio-inline'>
            <input
              onChange={this.selectType}
              type='radio'
              value='mobile'
              name='type'
              className='radio'
            />
            Phone Number
          </label>
          <input
            onChange={e => this.setState({ value: e.target.value })}
            type='text'
            className='form-control'
          />
          <button onClick={this.fetchData} className='btn btn-primary'>
            Search
          </button>
        </div>
        {this.state.data.length !== 0 &&
          Object.entries(this.state.data[0]).map(
            (n, indx) =>
              (typeof n[1] === 'object'
                ? <div key={indx} className='panel panel-default'>
                  <div className='panel-heading'>{n[0]}</div>
                  <div className='panel-body'>
                    {Object.entries(n[1]).map(
                        (el, idx) =>
                          (typeof n[1] === 'object'
                            ? Object.entries(el[1]).map((elm, ix) => (
                              <div key={ix}><b>{elm[0]}</b>: {elm[1]}</div>
                              ))
                            : <div key={idx}><b>{el[0]}</b>: {el[1]}</div>)
                      )}
                  </div>
                </div>
                : <div key={indx}><b>{n[0]}</b>: {n[1]}</div>)
          )}
      </div>
    )
  }

  selectType = e => {
    if (e.target.checked) this.setState({ selected: e.target.value })
  }

  fetchData = async e => {
    const { selected, value } = this.state
    const res = await fetch(`/record?${selected}=${value}`, {
      credentials: 'same-origin'
    })
    const data = await res.json()

    this.setState({ data })
  }

  componentDidMount () {}
}

export default List
