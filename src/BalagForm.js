import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import { inject, observer } from 'mobx-react'

import formSchema from './Schema.Data'
import uiSchema from './Schema.UI'

const { fetch } = window

@inject('dataStore')
@observer
class BalagForm extends Component {
  state = {
    fd: {}
  }

  render () {
    return (
      <Form
        schema={formSchema}
        uiSchema={uiSchema}
        onSubmit={this._handleSubmit}
        formData={this.state.fd}
      />
    )
  }

  _handleSubmit = ({ formData }) => {
    Object.assign(this.props.dataStore, { formData })
    fetch('/add', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props.dataStore.formData),
      credentials: 'same-origin'
    })
      .then(res => {
        if (res.status === 200) {
          this.props.dataStore.message = 'Success'
          formData = {}
          this.setState({ fd: null })
        } else {
          this.props.dataStore.message = 'Failed'
          throw new Error('Failed')
        }
        document.body.scrollTop = 0
      })
      .catch(e => {
        this.props.dataStore.message = 'Failed'
        document.body.scrollTop = 0
      })
  }
}

export default BalagForm
