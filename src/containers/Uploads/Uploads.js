import React, { Component } from 'react'
import DropzoneJS from '../../components/UI/DropzoneJS/DropzoneJS'
import UploadList from '../../components/UI/UploadList/UploadList'
import { connect } from 'react-redux'
import * as actions from '../../store/actions/index'

export class Uploads extends Component {
  onSuccessUpload = response => {
    this.props.addUpload(response)
  }

  handleChange = (event, selected) => {}

  render() {
    return (
      <>
        <DropzoneJS onSuccessUpload={this.onSuccessUpload} />
        <UploadList
          picker={this.props.picker || false}
          multiple={this.props.multiple || false}
          style={{ marginTop: '.75em' }}
          onChange={this.handleChange}
        />
      </>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addUpload: payload => dispatch(actions.addUpload(payload))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Uploads)
