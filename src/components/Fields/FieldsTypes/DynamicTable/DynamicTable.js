import React, { Component } from 'react'
// import ReactTable from 'react-table'
import {
  ReactTableWrapper,
  TrComponent,
} from '../../../UI/TableGenerator/TableGenerator'
import { v1 as uuidv1 } from 'uuid'
import { FaBars, FaPlus, FaMinus } from 'react-icons/fa'
import i18n from '../../../../i18n'
import { withTranslation } from 'react-i18next'
import aventum from '../../../../aventum'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// const range = len => {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// };

// const newPerson = () => {
//   const statusChance = Math.random();
//   return {
//     firstName: namor.generate({ words: 1, numbers: 0 }),
//     lastName: namor.generate({ words: 1, numbers: 0 }),
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status:
//       statusChance > 0.66
//         ? "relationship"
//         : statusChance > 0.33 ? "complicated" : "single"
//   };
// };

// export function makeData(len = 5553) {
//   return range(len).map(d => {
//     return {
//       ...newPerson(),
//       children: range(10).map(newPerson)
//     };
//   });
// }

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
// export function TrWrapperComponent({ children = null, rowInfo }) {
//   if (rowInfo) {
//     const { original, index } = rowInfo
//     const { id } = original
//     const _uuidv1 = original.uuidv1
//     const specialId = id || _uuidv1 || uuidv1()

//     return (
//       <Draggable key={specialId} index={index} draggableId={specialId + ''}>
//         {(draggableProvided, draggableSnapshot) => (
//           <div
//             ref={draggableProvided.innerRef}
//             {...draggableProvided.draggableProps}
//           >
//             <ReactTableWrapper.defaultProps.TrComponent
//               style={{ width: '100%' }}
//               className={`relative`}
//             >
//               {children}
//               <span
//                 {...draggableProvided.dragHandleProps}
//                 className={`absolute ${
//                   i18n.dir() === 'ltr' ? 'right-0' : 'left-0'
//                 }`}
//                 style={{ top: 'calc(50% - 10px)' }}
//               >
//                 <FaBars
//                   title={i18n.t('DragToReorder')}
//                   className={`fill-current text-gray-500`}
//                 />
//               </span>
//             </ReactTableWrapper.defaultProps.TrComponent>
//           </div>
//         )}
//       </Draggable>
//     )
//   } else
//     return (
//       <ReactTableWrapper.defaultProps.TrComponent>
//         {children}
//       </ReactTableWrapper.defaultProps.TrComponent>
//     )
// }

class DragTrComponent extends React.Component {
  render() {
    const { children = null, rowInfo } = this.props
    if (rowInfo) {
      const { original, index } = rowInfo
      const { id } = original
      const _uuidv1 = original.uuidv1
      const specialId = id || _uuidv1 || uuidv1()

      return (
        <Draggable key={specialId} index={index} draggableId={specialId + ''}>
          {(draggableProvided, draggableSnapshot) => (
            <div
              ref={draggableProvided.innerRef}
              {...draggableProvided.draggableProps}
            >
              <ReactTableWrapper.defaultProps.TrComponent
                style={{ width: '100%' }}
                className={`relative`}
              >
                {children}
                <span
                  {...draggableProvided.dragHandleProps}
                  className={`absolute ${
                    i18n.dir() === 'ltr' ? 'right-0' : 'left-0'
                  }`}
                  style={{ top: 'calc(50% - 10px)' }}
                >
                  <FaBars
                    title={i18n.t('DragToReorder')}
                    className={`fill-current text-gray-500`}
                  />
                </span>
              </ReactTableWrapper.defaultProps.TrComponent>
            </div>
          )}
        </Draggable>
      )
    } else
      return (
        <ReactTableWrapper.defaultProps.TrComponent>
          {children}
        </ReactTableWrapper.defaultProps.TrComponent>
      )
  }
}

class DropTbodyComponent extends React.Component {
  render() {
    const { children = null } = this.props

    return (
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div ref={droppableProvided.innerRef}>
            <ReactTableWrapper.defaultProps.TbodyComponent>
              {children}
            </ReactTableWrapper.defaultProps.TbodyComponent>
          </div>
        )}
      </Droppable>
    )
  }
}

export class DynamicTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pageSize: 20,
      columns: this.setColumns(),
      data:
        this.props.value && this.props.value.length
          ? this.props.value
          : [this.getNewRow()],
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({ data: this.props.value })
    }

    if (this.state.data.length >= this.state.pageSize) {
      this.setState((state, props) => {
        return {
          pageSize: state.pageSize + 20,
        }
      })
    }

    if (prevProps.columns.length !== this.props.columns.length) {
      this.setColumns(true)
    }
  }

  getNewRow = () => {
    const editableCells = this.props.columns.reduce((acc, curr) => {
      return { [curr.accessor]: '', ...acc }
    }, {})

    return {
      uuidv1: uuidv1(),
      ...editableCells,
    }
  }

  addRow = (row) => {
    // Remove nothing and insert the new row
    const data = [...this.state.data]
    data.splice(row.index + 1, 0, this.getNewRow())
    this.setState({ data }, () => {
      this.props.onChange(data)
    })
  }

  removeRow = (row) => {
    const data = [...this.state.data]

    // From index remove one item
    data.splice(row.index, 1)

    this.setState({ data }, () => {
      this.props.onChange(data)
    })
  }

  renderEditable = (cellInfo) => {
    let value = ''
    try {
      value =
        this.state.data && this.state.data.length
          ? this.state.data[cellInfo.index][cellInfo.column.accessor]
          : ''
    } catch (error) {}

    return (
      <input
        value={value}
        className="w-full"
        onChange={(e) => {
          const data = [...this.state.data]
          data[cellInfo.index][cellInfo.column.accessor] = e.target.value
          this.setState({ data }, () => {
            this.props.onChange(data)
          })
        }}
      />
    )
  }

  onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const data = reorder(
      this.state.data,
      result.source.index,
      result.destination.index
    )

    this.setState(
      {
        data,
      },
      () => {
        this.props.onChange(data)
      }
    )
  }

  setColumns = (set = false) => {
    const cls =
      this.props.columns && this.props.columns.length
        ? this.props.columns.map((c) => {
            c.Cell = this.renderEditable
            return c
          })
        : []

    const columns = [
      ...cls,
      {
        Header: '',
        accessor: 'renove',
        sortable: false,
        Cell: (row) => {
          return (
            <div className={`flex justify-center`}>
              <span
                className="text-green-400 cursor-pointer"
                onClick={() => this.addRow(row)}
                title={this.props.t('AddRowBelow')}
              >
                <FaPlus />
              </span>
              <span
                title={this.props.t('RemoveThisRow')}
                className="text-red-600 cursor-pointer mx-3"
                onClick={() => this.removeRow(row)}
              >
                <FaMinus />
              </span>
            </div>
          )
        },
      },
    ]

    if (set) {
      this.setState({ columns })
    } else {
      return columns
    }
  }

  getTrProps = (state, rowInfo) => {
    return { rowInfo }
  }

  render() {
    /**
     * The render method of the DynamicTable just started executing.
     *
     * @hook
     * @name DynamicTableBeforeRender
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The DynamicTable component.
     */
    aventum.hooks.doActionSync('DynamicTableBeforeRender', this)

    const validationMessage = this.props.errors ? (
      <p className={`text-red-600 mt-2 text-sm`}>
        {this.props.errors.join(', ') + '!'}
      </p>
    ) : null

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <ReactTableWrapper
          data={this.state.data.length ? this.state.data : [this.getNewRow()]}
          columns={this.state.columns}
        >
          {({ data, columns }) => {
            return (
              <Droppable droppableId="droppable">
                {(droppableProvided, droppableSnapshot) => (
                  <div
                    ref={droppableProvided.innerRef}
                    className="tbody flex flex-col"
                  >
                    {data.map((row, index) => {
                      const specialId = row.id || row.uuidv1 || uuidv1()
                      return (
                        <Draggable
                          key={specialId}
                          index={index}
                          draggableId={specialId + ''}
                        >
                          {(draggableProvided, draggableSnapshot) => (
                            <TrComponent
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              className="relative"
                              columns={columns}
                              row={row}
                              index={index}
                            >
                              <span
                                {...draggableProvided.dragHandleProps}
                                className={`absolute ${
                                  i18n.dir() === 'ltr' ? 'right-0' : 'left-0'
                                }`}
                                style={{ top: 'calc(50% - 10px)' }}
                              >
                                <FaBars
                                  title={i18n.t('DragToReorder')}
                                  className={`fill-current text-gray-500`}
                                />
                              </span>
                            </TrComponent>
                          )}
                        </Draggable>
                      )
                    })}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          }}
        </ReactTableWrapper>
        {validationMessage}
      </DragDropContext>
    )
    // return (
    //   <DragDropContext onDragEnd={this.onDragEnd}>
    //     <ReactTableWrapper
    //       data={this.state.data.length ? this.state.data : [this.getNewRow()]}
    //       columns={this.state.columns}
    //       showPagination={false}
    //       TrComponent={DragTrComponent}
    //       TbodyComponent={DropTbodyComponent}
    //       getTrProps={this.getTrProps}
    //       // defaultPageSize={1000}
    //       pageSize={this.state.pageSize}
    //       // minRows={0}
    //       noDataText={this.props.t('noDataText')}
    //     />
    //     {validationMessage}
    //   </DragDropContext>
    // )
  }
}

export default withTranslation()(DynamicTable)
