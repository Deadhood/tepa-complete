import _ from 'lodash'
import React, { Component } from 'react'
import './List.css'
const { fetch } = window

const isObject = el => Object.prototype.toString.call(el) === '[object Object]'

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

  getEntries = data =>
    data.map((record, index) => {
      const rnd = () => _.random(1, 5000)
      const [rootEls, deepEls] = _.partition(
        Object.entries(record),
        it => !isObject(it[1])
      )

      const rootElems = (
        <div className='panel panel-primary' key={index + rnd()}>
          <div className='panel-heading'>Personal Info</div>
          <div className='panel-body'>
            {rootEls.map((rec, idx) => (
              <div key={idx}><b>{rec[0]}</b>: {rec[1]}</div>
            ))}
          </div>
        </div>
      )

      const deepElems = deepEls.map((rec, idx) => {
        const [root, deep] = _.partition(
          Object.entries(rec[1]),
          it => !isObject(it[1])
        )

        const childs = [].concat(
          root.map(it => (
            <div key={it[0] + rnd()}>
              <b>{it[0]}</b>: {it[1]}
            </div>
          )),
          deep.map(it => (
            <div key={it[0] + rnd()} className='panel panel-warning'>
              <div className='panel-heading'>{it[0]}</div>
              <div className='panel-body'>
                {Object.entries(it[1]).map(itm => (
                  <div key={itm[0]}><b>{itm[0]}</b>: {itm[1]}</div>
                ))}
              </div>
            </div>
          ))
        )

        return (
          <div className='panel panel-success' key={idx + rnd()}>
            <div className='panel-heading'>{rec[0]}</div>
            <div className='panel-body'>
              {childs}
            </div>
          </div>
        )
      })
      return [].concat(rootElems, deepElems)
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
