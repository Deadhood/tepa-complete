import React, { Component } from 'react'

import './Tax.css'

const { fetch } = window
const calcTax = (rate, amt) => {
  const tx = Number(rate) / 6400 * (3 * Number(amt) + 3000)
  return tx > 500 ? 500 : Math.ceil(tx)
}

class Tax extends Component {
  state = {
    tax: 7,
    show: null
  }

  render () {
    return (
      <form className='taxPage form-inline' onSubmit={e => e.preventDefault()}>
        <div className='form-group'>
          <label htmlFor='tax'>Tax Percentage: </label>
          <input
            type='number'
            name='tax'
            value={this.state.tax}
            className='form-control'
            min={0}
            max={25}
            onChange={e => this.setState({ tax: Number(e.target.value) })}
          />
          <button className='btn btn-primary' onClick={this.reTax}>
            Re-calculate
          </button>
        </div>
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
      </form>
    )
  }

  componentDidMount () {
    this.getTax()
  }

  reTax = e => {
    this.getTax()
  }

  getTax = async e => {
    console.log('fetching data again')
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
        res.reduce((taxAcc, el) => {
          const wtax = {}
          const ward = `Ward ${el.ward}`
          const tax =
            calcTax(state.tax, Number(el['home-cost'])) + (taxAcc[ward] || 0)
          wtax[ward] = tax
          return Object.assign(taxAcc, wtax)
        }, {})
      )
    }))
  }
}

export default Tax
