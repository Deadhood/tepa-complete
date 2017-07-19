import React, { Component } from 'react'

const { fetch } = window

class List extends Component {
  state = {
    ward: 0,
    show: ''
  }

  render () {
    return (
      <div>
        <input
          type='text'
          placeholder='ward'
          onChange={e => this.setState({ ward: Number(e.target.value) })}
        />
        <button onClick={this.getWard}>Go</button>
        <pre>{this.state.show}</pre>
      </div>
    )
  }

  componentDidMount () {}

  getWard = async () => {
    const { ward } = this.state
    const uri = '/view' + (ward ? `?ward=${ward}` : '')
    console.log(uri)
    let res = await fetch(uri, {
      credentials: 'same-origin'
    })
    res = await res.json()
    this.setState({
      show: JSON.stringify(res, null, 2)
    })
  }
}

export default List
