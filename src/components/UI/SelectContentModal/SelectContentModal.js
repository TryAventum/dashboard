import React, { Component } from 'react'
import Button from '../Button/Button'
import Modal from '../Modal/index'
import DynamicContentList from '../../../components/DynamicContentList/DynamicContentList'
import { withTranslation } from 'react-i18next'

export class SelectContentModal extends Component {
  state = { modalOpen: false }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  doneClicked = () => this.setState({ modalOpen: false })

  handleChange = (event, values) => {
    if (this.props.multiple) {
      this.props.onChange(event, values)
    } else {
      this.props.onChange(event, values[0])
    }
  }

  render() {
    return (
      <Modal
        trigger={
          <Button
            primary
            onClick={this.handleOpen}
            size={this.props.btnSize || 'small'}
            floated={this.props.floated || 'right'}
            labelPosition="left"
            icon="content"
            dataTestid="selectContentTrigger"
          >
            {this.props.t('SelectContent', {
              count: this.props.multiple ? 0 : 1,
            })}
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>
          {this.props.t('SelectContent', {
            count: this.props.multiple ? 0 : 1,
          })}
        </Modal.Header>
        <Modal.Content scrolling>
          <DynamicContentList
            onChange={this.handleChange}
            content={this.props.content}
            multiple={this.props.multiple}
            selected={this.props.selected}
            selectable
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.doneClicked}>{this.props.t('Done')}</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default withTranslation()(SelectContentModal)
