import React, { Component } from 'react'
import Dropzone from 'dropzone'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

export class DropzoneJS extends Component {
  state = {
    dropzoneInstance: null
  }

  setDropzoneInstance = () => {
    var self = this
    var APP_URI = this.props.options.length ? this.props.options.find(e=>e.name==='APP_URI').value : ''

    var url = this.props.url ? `${APP_URI}/${this.props.url}` : `${APP_URI}/uploads`

    Dropzone.autoDiscover = false
    self.state.dropzoneInstance = new Dropzone('form.dropzone', {
      //TODO the use URL here must be dynamic
      url,
      headers: {
        'x-access-token': localStorage.getItem('x-access-token')
      },
      timeout: 3600000 //60 Minutes
      // ,
      // success: function (file, response) {
      //   // console.log(this.state.access);
      //   // console.log("File",file);
      //   // console.log("Response",response);
      // }
    })

    this.state.dropzoneInstance.on('success', function(e, response) {
      self.props.onSuccessUpload && self.props.onSuccessUpload(response)
    })
  }

  componentDidMount() {
    this.setDropzoneInstance()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.options.length && !prevProps.options.length){
      this.setDropzoneInstance()
    }
  }

  componentWillUnmount() {
    this.state.dropzoneInstance.destroy()
  }
  render() {
    return (
      <form action="/file-upload" className="dropzone" id="my-awesome-dropzone">
        <div className="dz-message" data-dz-message>
          <span>{this.props.message || this.props.t('DropFilesToUpload')}</span>
        </div>
      </form>
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.option.options
  }
}

export default connect(
  mapStateToProps
)(withTranslation()(DropzoneJS))
