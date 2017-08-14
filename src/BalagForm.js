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

  _handleSubmit = async ({ formData }) => {
    Object.assign(this.props.dataStore, { formData })

    const res = await fetch('/record', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props.dataStore.formData),
      credentials: 'same-origin'
    })

    if (res.status === 200) {
      formData = {}
      this.props.dataStore.message = 'Success'
      this.setState({ fd: {} })
    } else {
      this.props.dataStore.message = 'Failed'
    }
  }
}

export default BalagForm
