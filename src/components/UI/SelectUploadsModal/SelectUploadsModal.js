import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../Modal/index'
import Button from '../Button/Button'
import Uploads from '../../../containers/Uploads/Uploads'
import * as actions from '../../../store/actions/index'
import aventum from '../../../aventum'
import { withTranslation } from 'react-i18next'

export class SelectUploadsModal extends Component {
  state = { modalOpen: false }

  handleOpen = () => {
    this.setState({ modalOpen: true })
    if (this.props.onOpen) {
      this.props.onOpen()
    }
  }

  handleClose = () => this.setState({ modalOpen: false })

  doneClicked = () => {
    this.setState({ modalOpen: false })
    let eventName = this.props.id
      ? `selectedUploadsModalDoneClicked${this.props.id}`
      : 'selectedUploadsModalDoneClicked'
    /**
     * Fires when the done button clicked in the SelectUploadsModal
     * The hook name either selectedUploadsModalDoneClicked or
     * [id]selectedUploadsModalDoneClicked
     *
     * @hook
     * @name [variable]
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Array} selectedUploads The selected uploads in the modal.
     * @param {Object} $this SelectUploadsModal component.
     */
    aventum.hooks.doActionSync(eventName, this.props.selectedUploads, this)

    if (this.props.onChange) {
      this.props.onChange(this.props.selectedUploads)
    }

    this.props.setSelectedUploads([])
  }

  // handleChange = (event, values) => {
  //   if (this.props.multiple) {
  //     this.props.onChange(event, values)
  //   } else {
  //     this.props.onChange(event, values[0])
  //   }
  // }

  render() {
    return (
      <Modal
        trigger={
          <Button
            size={this.props.size || 'normal'}
            primary
            onClick={this.handleOpen}
            className={this.props.className}
            style={this.props.style}
            icon={this.props.icon || null}
            labelPosition={this.props.labelPosition || null}
            floated={this.props.floated || 'right'}
            dataTestid="selectUploadTrigger"
          >
            {this.props.btnLabel
              ? this.props.btnLabel
              : this.props.t('SelectUpload', {
                  count: this.props.multiple ? 0 : 1,
                })}
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>{this.props.t('SelectUploadItem')}</Modal.Header>
        <Modal.Content scrolling>
          <Uploads picker multiple={this.props.multiple || false} />
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={this.doneClicked}>
            {this.props.t('Done')}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedUploads: state.upload.selectedUploads,
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
)(withTranslation()(SelectUploadsModal))
