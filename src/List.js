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

  getEntries = data => {
    data = Object.entries(data[0])
    const rand = Math.ceil(Math.random() * 100)

    const rootElems = (
      <div className='panel panel-primary' key={rand}>
        <div className='panel-heading'>Personal Info</div>
        <div className='panel-body'>
          {data
            .filter(el => !isObject(el[1]))
            .map((el, ix) => (
              <div key={rand + ix * 2}><b>{el[0]}</b>: {el[1]}</div>
            ))}
        </div>
      </div>
    )

    const deepElems = data.filter(el => isObject(el[1])).map((it, idx) => (
      <div key={idx + rand * 2} className='panel panel-default'>
        <div className='panel-heading'>{it[0]}</div>
        <div className='panel-body'>
          {Object.entries(it[1]).map(
            (el, idx) =>
              (isObject(el[1])
                ? Object.entries(el[1]).map((elm, ix) => (
                  <div key={ix}><b>{elm[0]}</b>: {elm[1]}</div>
                  ))
                : <div key={idx}><b>{el[0]}</b>: {el[1]}</div>)
          )}
        </div>
      </div>
    ))
    return [].concat(rootElems, deepElems)
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
