import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectUploadsModal from '../../../UI/SelectUploadsModal/SelectUploadsModal'
import aventum from '../../../../aventum'
import { FcFile } from 'react-icons/fc'
import * as actions from '../../../../store/actions/index'
import axios from '../../../../axios'
import { withTranslation } from 'react-i18next'
import { getFileExtension } from '../../../../shared/utility'

class Upload extends Component {
  state = {
    localUploads: [],
    touched: false,
    imagesExtensions: ['png', 'jpg', 'tif', 'gif', 'jpeg', 'bmp'],
    videoExtensions: ['avi', 'asf', 'mov', 'mpg', 'mp4', 'wmv', 'flv'],
  }

  resetLocalUploads = () => {
    this.setState({ localUploads: [] })
  }

  onModalOpen = () => {
    this.props.setSelectedUploads(this.state.localUploads)
  }

  selectedUploadsModalDoneClickedSubscription = (selectedUploads) => {
    if (this.props.multiple) {
      this.props.onChange(selectedUploads.map((e) => e.id))
    } else {
      this.props.onChange(selectedUploads.length ? selectedUploads[0].id : '')
    }
    if (!this.state.touched) {
      this.setState({ touched: true })
    }

    this.setState({ localUploads: selectedUploads })
  }

  componentDidMount() {
    if (
      (Array.isArray(this.props.value) && this.props.value.length) ||
      this.props.value
    ) {
      this.setUpLocalUploads()
    }

    aventum.hooks.addAction(
      `selectedUploadsModalDoneClicked${
        this.props.uniqueID ? this.props.uniqueID : this.props.id
      }`,
      'Aventum/core/Upload/DidMount',
      this.selectedUploadsModalDoneClickedSubscription
    )
  }

  setUpLocalUploads() {
    let ids

    if (Array.isArray(this.props.value)) {
      ids = this.props.value
    } else {
      ids = [this.props.value]
    }

    let query = { whereIn: { column: 'id', values: ids } }

    axios
      .get(`uploads/all?query=${encodeURIComponent(JSON.stringify(query))}`)
      .then(
        (response) => {
          this.setState({ localUploads: response.data.uploads })
        },
        (error) => {}
      )
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (!prevProps.value && this.props.value && !this.state.touched) ||
      JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)
    ) {
      if (
        (Array.isArray(this.props.value) && this.props.value.length) ||
        this.props.value
      ) {
        this.setUpLocalUploads()
      } else {
        this.resetLocalUploads()
      }
    }
  }

  componentWillUnmount() {
    aventum.hooks.removeAction(
      `selectedUploadsModalDoneClicked${
        this.props.uniqueID ? this.props.uniqueID : this.props.id
      }`,
      'Aventum/core/Upload/DidMount'
    )
  }

  render() {
    let validationMessage = this.props.errors ? (
      <p className={`text-red-600 mt-2 text-sm`}>
        {this.props.errors.join(', ') + '!'}
      </p>
    ) : null

    return (
      <>
        <div className="flex justify-between my-4">
          <div>
            <label className="block text-sm font-medium leading-5 text-gray-700">
              {this.props.label}{' '}
              {this.props.required && <span style={{ color: 'red' }}>*</span>}
            </label>
          </div>
          <div>
            <SelectUploadsModal
              size="small"
              icon="image"
              labelPosition="left"
              id={this.props.uniqueID ? this.props.uniqueID : this.props.id}
              onOpen={this.onModalOpen}
              multiple={this.props.multiple || false}
            />
          </div>
        </div>
        {this.state.localUploads.length ? (
          <div>
            <div>
              <div className="flex flex-wrap -mx-7 max-w-7xl px-4">
                {this.state.localUploads.map((e) => {
                  let type = null
                  if (
                    this.state.imagesExtensions.includes(
                      getFileExtension(e.path)
                    )
                  ) {
                    type = 'i'
                  } else if (
                    this.state.videoExtensions.includes(
                      getFileExtension(e.path)
                    )
                  ) {
                    type = 'v'
                  } else {
                    type = 'f'
                  }
                  return (
                    <div key={e.id} className={`w-full p-3  ${this.state.localUploads.length > 1 ? 'max-h-52 md:w-1/4' : ''}`}>
                      {type === 'i' && (
                        <img
                          className="h-full w-full object-cover"
                          src={e.path}
                          alt={e.originalName}
                          title={e.originalName}
                        />
                      )}
                      {type === 'f' && (
                        <FcFile
                          className="h-full w-full object-cover"
                          title={e.originalName}
                        />
                      )}
                      {type === 'v' && (
                        <video
                          className={`max-w-full h-full w-full object-cover`}
                          controls
                          title={e.originalName}
                        >
                          <source src={e.path} /> To view this video please
                          enable JavaScript, and consider upgrading to a web
                          browser that supports HTML5 video
                        </video>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
        {validationMessage}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schema.schemas,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedUploads: (payload) =>
      dispatch(actions.setSelectedUploads(payload)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Upload))
