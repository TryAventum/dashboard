import React, { Component } from 'react'
import Input from '../../UI/Input/Input'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { FaBars, FaPlus, FaMinus } from 'react-icons/fa'
import { withTranslation } from 'react-i18next'
import aventum from '../../../aventum'

export class RepeatableTextValue extends Component {
  componentDidMount() {
    aventum.hooks.addAction(
      'SchemaNFieldsOnDragEnd',
      'Aventum/Core/RepeatableTextValue',
      this.fieldsSettingsListDragEnd
    )
  }

  componentWillUnmount() {
    aventum.hooks.removeAction(
      'SchemaNFieldsOnDragEnd',
      'Aventum/Core/RepeatableTextValue'
    )
  }

  fieldsSettingsListDragEnd = (result) => {
    if (result.type !== this.props.id) {
      return
    }

    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    let currentList = [...this.props.rows]

    let draggableElement = this.props.rows.find((i) => i.id === draggableId)

    //From source.index remove one item
    currentList.splice(source.index, 1)

    //Remove nothing and insert the draggableId
    currentList.splice(destination.index, 0, draggableElement)

    this.reorder(currentList)
  }

  reorder = (rows) => {
    this.props.onChange({ type: 'reorder', rows })
  }

  plusClicked = (index) => {
    this.props.onChange({ type: 'plus', index })
  }

  minusClicked = (index) => {
    this.props.onChange({ type: 'minus', index })
  }

  valueChanged = (event, index) => {
    this.props.onChange({ type: 'value', event, index })
  }

  textChanged = (event, index) => {
    this.props.onChange({ type: 'text', event, index })
  }

  render() {
    let rows =
      this.props.rows && this.props.rows.length
        ? this.props.rows.map((option, index) => {
            return (
              <Draggable key={option.id} draggableId={option.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    key={index}
                  >
                    <div className="flex m-0 py-2 justify-between">
                      <Input
                        placeholder={this.props.t('OptionText')}
                        value={option.label}
                        onChange={(event) => this.textChanged(event, index)}
                        className="w-2/5"
                      />
                      <Input
                        placeholder={this.props.t('OptionValue')}
                        value={option.value}
                        onChange={(event) => this.valueChanged(event, index)}
                        className="w-2/5"
                      />
                      <div className="flex justify-center items-center">
                        <span
                          className="text-green-400 cursor-pointer mx-3 plus"
                          onClick={(event) => this.plusClicked(index)}
                        >
                          <FaPlus />
                        </span>
                        <span
                          className="text-red-600 cursor-pointer mx-3 minus"
                          onClick={(event) => this.minusClicked(index)}
                        >
                          <FaMinus />
                        </span>
                      </div>
                      <div className="flex justify-center items-center">
                        <span {...draggableProvided.dragHandleProps}>
                          <FaBars
                            title={this.props.t('DragToReorder')}
                            className={`fill-current text-gray-500`}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            )
          })
        : null

    return (
      <div className="my-4">
        <Droppable droppableId={this.props.id} type={this.props.id}>
          {(droppableProvided, droppableSnapshot) => (
            <div ref={droppableProvided.innerRef} className="rep-text-val">
              {rows}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }
}

export default withTranslation()(RepeatableTextValue)
