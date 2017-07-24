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
    show: []
  }

  render () {
    return (
      <div className='taxPage'>
        <div className='container-fluid'>
          <label>
            Tax Percentage:
            <input
              type='number'
              className='form-control'
              onChange={e => this.setState({ tax: Number(e.target.value) })}
            />
          </label>
          <button className='btn btn-primary' onClick={this.reTax}>
            Re-calculate
          </button>
        </div>
        {this.state.show.length > 0
          ? <div className='container-fluid'>
            <div className='responsible-table'>
              <table className='table table-striped'>
                <th>
                  <td>Ward</td>
                  <td>Tax</td>
                </th>
                {this.state.show.map(el => (
                  <tr key={el.ward}><td>{el.ward}</td><td>{el.tax}</td></tr>
                  ))}
              </table>
            </div>
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
    console.log('fetching data again')
    const taxes = {
      'Ward 1': 0,
      'Ward 2': 0,
      'Ward 3': 0,
      'Ward 4': 0,
      'Ward 5': 0,
      'Ward 6': 0,
      'Ward 7': 0,
      'Ward 8': 0,
      'Ward 9': 0
    }
    let res = await fetch('/view', {
      credentials: 'same-origin'
    })

    res = await res.json()

    res.forEach(el => {
      if (el.hasOwnProperty('home-cost')) {
        taxes['Ward ' + el.ward] += calcTax(
          this.state.tax,
          Number(el['home-cost'])
        )
      }
    })

    return this.setState({
      show: Object.keys(taxes).map(w => {
        return { tax: taxes[w], ward: w }
      })
    })
  }
}

export default Tax
