import _ from 'lodash'
import React, { Component } from 'react'
import './List.css'
const { fetch } = window

const mPairs = (obj, cb) => {
  return _.map(_.toPairs(obj), cb)
}

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

  getEntries = records =>
    _.map(records, (record, index) => {
      const rnd = () => _.random(1, 5000)
      const [flat, nest] = _.partition(
        _.toPairs(record),
        it => !_.isPlainObject(it[1])
      )

      const keyVal = _.map(flat, ([key, val]) => (
        <div key={index + key}><b>{key}</b>: {val}</div>
      ))

      const base = (
        <div className='panel panel-primary' key={index + rnd()}>
          <div className='panel-heading'>Personal Info</div>
          <div className='panel-body'>{keyVal}</div>
        </div>
      )

      const nested = _.map(nest, ([key, val], idx) => {
        const [root, deep] = _.partition(
          _.toPairs(val),
          it => !_.isPlainObject(it[1])
        )

        const childs = [].concat(
          root.map(([k, v]) => <div key={idx + k}><b>{k}</b>: {v}</div>),
          deep.map(([k, v]) => (
            <div key={idx + k} className='panel panel-warning'>
              <div className='panel-heading'>{k}</div>
              <div className='panel-body'>
                {mPairs(v, ([x, y]) => <div key={x}><b>{x}</b>: {y}</div>)}
              </div>
            </div>
          ))
        )

        return (
          <div className='panel panel-success' key={idx + key}>
            <div className='panel-heading'>{key}</div>
            <div className='panel-body'>{childs}</div>
          </div>
        )
      })
      return [].concat(base, nested)
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
