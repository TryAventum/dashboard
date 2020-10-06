import React, { Component } from 'react'
import { FaDatabase } from "react-icons/fa"
import { withTranslation } from 'react-i18next'
import Modal from '../Modal'
import Button from '../Button/Button'
import ReactJson from 'react-json-view'

class DataModal extends Component {
  state = { modalOpen: this.props.modalOpen || false }

  handleOpen = event => {
    event.stopPropagation()
    this.setState({ modalOpen: true })
  }

  handleClose = () => this.setState({ modalOpen: false })

  doneClicked = (e) => {
    e.stopPropagation()
    if (this.props['doneClicked']) {
      this.props.doneClicked()
    }
    this.setState({ modalOpen: false })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.modalOpen !== this.props.modalOpen){
      this.setState({ modalOpen: this.props.modalOpen })
    }
  }

  render() {
    return (
      <Modal
        trigger={
          this.props.trigger ? (this.props.button ? (
            <Button color="grey" onClick={this.handleOpen} type="button">
              {this.props.triggerButtonText}
            </Button>
          ) : (
            <FaDatabase
              onClick={this.handleOpen}
              className="cursor-pointer text-gray-400 inline"
            />
          )) : null
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header headingTitle={this.props.headingTitle} icon={this.props.headerIcon || <FaDatabase className="text-gray-400" />}>
            {this.props.headerContent || ''}
        </Modal.Header>
        <Modal.Content>
          {this.props.json ? <ReactJson src={this.props.data} /> : this.props.data}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.doneClicked}>
            {this.props.buttonText || this.props.t('Done')}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default withTranslation()(DataModal)
