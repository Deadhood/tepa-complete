import React, { Component } from 'react'

import './Tax.css'

const { fetch } = window
const calcTax = (rate, amt) => {
  ;[rate, amt] = [Number(rate), Number(amt)]
  const tx = Math.ceil(rate / 6400 * (3 * amt + 3000))
  return Math.min(tx, 500)
}

class Tax extends Component {
  state = {
    tax: 7,
    show: null
  }

  render () {
    return (
      <div className='taxPage'>
        <form className='form-inline' onSubmit={e => e.preventDefault()}>
          <div className='form-group input-icon'>
            <label htmlFor='tax'>Tax Percentage:&nbsp;</label>
            <i>%</i>
            <input
              type='number'
              name='tax'
              min={0}
              max={15}
              value={this.state.tax}
              className='form-control'
              title='Tax Percentage: A value between 0 and 15'
              onChange={e =>
                this.setState({ tax: Math.min(Number(e.target.value), 15) })}
            />
          </div>
          <button className='btn btn-primary' onClick={this.reTax}>
            Re-calculate
          </button>
        </form>
        {this.state.show !== null
          ? <div className='responsible-table'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>Ward</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(this.state.show).map(el => (
                  <tr key={el[0]}><td>{el[0]}</td><td>{el[1]}</td></tr>
                  ))}
              </tbody>
            </table>
          </div>
          : 'Loading...'}
      </div>
    )
  }

  componentDidMount () {
    this.getTax()
  }

  reTax = e => {
    this.getTax()
  }

  getTax = async e => {
    let res = await fetch('/view', {
      credentials: 'same-origin'
    })

    res = await res.json()

    return this.setState(state => ({
      show: Object.assign(
        {
          'Ward 1': 0,
          'Ward 2': 0,
          'Ward 3': 0,
          'Ward 4': 0,
          'Ward 5': 0,
          'Ward 6': 0,
          'Ward 7': 0,
          'Ward 8': 0,
          'Ward 9': 0
        },
        res.reduce(
          (acc, el) =>
            Object.assign({}, acc, {
              [`Ward ${el.ward}`]: calcTax(state.tax, el['home-cost']) +
                (acc[`Ward ${el.ward}`] || 0)
            }),
          {}
        )
      )
    }))
  }
}

export default Tax
