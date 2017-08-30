import R from 'ramda'
import React, { Component } from 'react'
import './List.css'
const { fetch } = window

const objMap = (fn, obj) => R.map(fn, R.toPairs(obj))

class List extends Component {
  state = {
    selected: 'nid-bc',
    value: '',
    data: []
  }

  render () {
    return (
      <div className='List'>
        <div className='form-group'>
          <label htmlFor='search'>Search by:&nbsp;</label>
          <select
            name='search'
            value={this.state.selected}
            onChange={e => this.setState({ selected: e.target.value })}
          >
            <option value='nid-bc'>জাতীয় পরিচয় পত্র / জন্ম নিবন্ধন</option>
            <option value='mobile'>ফোন নাম্বার</option>
            <option value='poribar-prodhan'>পরিবার প্রধান-এর নাম</option>
          </select>
          <input
            type='text'
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
          />
          <button onClick={this.fetchData} className='btn btn-primary'>
            Search
          </button>
        </div>
        {this.state.data.length !== 0 && this.getEntries(this.state.data)}
      </div>
    )
  }

  getEntries = R.map((record, rId) => {
    const rnd = () => Math.round(Math.random() * 5000)
    const isLastItObj = R.compose(R.equals('Object'), R.type, R.last)
    const [nest, flat] = R.partition(isLastItObj, R.toPairs(record))

    const root = (
      <div className='panel panel-primary' key={rId + rnd()}>
        <div className='panel-heading'>Personal Info</div>
        <div className='panel-body'>
          {flat.map(([key, val]) => (
            <div key={rId + key}><b>{key}</b>: {val}</div>
          ))}
        </div>
      </div>
    )

    const nested = nest.map(([key, val], idx) => {
      const [deep, here] = R.partition(isLastItObj, R.toPairs(val))

      const childEls = [].concat(
        here.map(([k, v]) => <div key={rId + idx + k}><b>{k}</b>: {v}</div>),
        deep.map(([k, v]) => (
          <div className='panel panel-warning' key={idx + k}>
            <div className='panel-heading'>{k}</div>
            <div className='panel-body'>
              {objMap(([x, y]) => <div key={x}><b>{x}</b>: {y}</div>, v)}
            </div>
          </div>
        ))
      )

      return (
        <div className='panel panel-success' key={idx + key}>
          <div className='panel-heading'>{key}</div>
          <div className='panel-body'>{childEls}</div>
        </div>
      )
    })

    return [].concat(root, nested)
  })

  fetchData = async e => {
    const { selected, value } = this.state
    const query = selected.length > 0 && value ? `${selected}=${value}` : ''
    const res = await fetch(`/record?${query}`, {
      credentials: 'same-origin'
    })
    const data = await res.json()

    this.setState({ data })
  }

  componentDidMount () {}
}

export default List
