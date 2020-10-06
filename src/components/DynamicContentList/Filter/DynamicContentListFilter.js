import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import { format, formatISO } from 'date-fns'
import aventum from '../../../aventum'
import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'
import Dropdown from '../../UI/Dropdown/Dropdown'
import { withTranslation } from 'react-i18next'
import { v1 as uuidv1 } from 'uuid'
import * as actions from '../../../store/actions/index'
import {
  FaFilter,
  FaSortAmountUpAlt,
  FaSortAmountDownAlt,
  FaSortNumericUp,
  FaSortNumericDown,
  FaPlus,
  FaMinus,
} from 'react-icons/fa'
import { getObjectById } from '../../../shared/utility'
import SelectContentModal from '../../UI/SelectContentModal/SelectContentModal'
import SelectUploadsModal from '../../UI/SelectUploadsModal/SelectUploadsModal'

export class DynamicContentListFilter extends Component {
  getNewRow = () => {
    return {
      uuidv1: uuidv1(),
      name: '',
      type: '',
      repeatable: false,
      condition: '',
      content: '',
      value: '',
    }
  }

  initialState = {
    sortBy: 'id',
    sortOrder: 'DESC',
    conditions: [this.getNewRow()],
    sortableFields: [
      'bigInteger',
      'decimal',
      'string',
      'textarea',
      'select',
      'date',
      'time',
      'dateTime',
    ],
    fieldsOptions: [],
    wantedFields: [],
  }

  state = {
    ...this.initialState,
  }

  setConditionValue = (condition, value) => {
    let newConditions = [...this.state.conditions].map((c) => {
      if (condition.uuidv1 === c.uuidv1) {
        c.value = value
        return {
          ...c,
        }
      }
      return c
    })

    this.setState({ conditions: newConditions })
  }

  reset = () => {
    this.setState({
      ...this.initialState,
    })
  }

  setUp() {
    let wantedFields =
      this.props.schema && this.props.schema.fields
        ? this.props.schema.fields.filter((f) => !['custom'].includes(f.type))
        : []

    wantedFields = wantedFields.map((f) => {
      let obj = {
        label: f.fields.find((o) => o.name === 'label').value,
        value: f.fields.find((o) => o.name === 'name').value,
        type: f.type,
      }

      if (f.type === 'select') {
        obj['options'] = f.fields.find((o) => o.name === 'options').value
      }

      if (f.type === 'relation') {
        const reference = f.fields.find((o) => o.name === 'reference').value
        if (reference) {
          obj['content'] = getObjectById(this.props.schemas, reference).name
        } else {
          obj['content'] = ''
        }
      }

      if (f.type !== 'boolean') {
        obj['repeatable'] = f.fields.find(
          (o) => o.name === 'repeatable'
        ).checked
      }

      return obj
    })

    this.setState({
      wantedFields: wantedFields,
      fieldsOptions: wantedFields.map((y) => {
        return { label: y.label, value: y.value }
      }),
    })
  }

  componentDidMount() {
    if (this.props.schema) {
      this.setUp()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (!prevProps.schema && this.props.schema) ||
      prevProps.schema.id !== this.props.schema.id
    ) {
      this.reset()
      this.setUp()
    }
  }

  addCondition = (data) => {
    if (this.state.conditions.length === this.state.fieldsOptions.length) {
      return
    }

    // Remove nothing and insert the new row
    const newConditions = [...this.state.conditions]
    newConditions.splice(data.index + 1, 0, this.getNewRow())

    this.setState({ conditions: newConditions }, () => {
      //   this.props.onChange(data)
    })
  }

  removeCondition = (data) => {
    let newConditions = [...this.state.conditions]

    if (newConditions.length === 1) {
      return
    }

    // From index remove one item
    newConditions.splice(data.index, 1)

    this.setState({ conditions: newConditions }, () => {
      //   this.props.onChange(newConditions)
    })
  }

  condSelected = (condition, value) => {
    let newConditions = [...this.state.conditions].map((c) => {
      if (condition.uuidv1 === c.uuidv1) {
        c.condition = value
      }
      return c
    })

    this.setState({ conditions: newConditions })
  }

  getConOptions = (condition = null) => {
    switch (condition.type) {
      case 'string':
      case 'textarea':
      case 'relation':
      case 'select':
      case 'upload':
      default:
        return [
          { label: this.props.t('contains'), value: 'eq' },
          { label: this.props.t(`doesnotcontain`), value: 'ne' },
        ]
      case 'bigInteger':
      case 'date':
      case 'time':
      case 'dateTime':
      case 'decimal':
        return [
          { label: this.props.t('EqualTo'), value: 'eq' },
          { label: this.props.t('NotEqualTo'), value: 'ne' },
        ]
      case 'boolean':
        return [
          { label: this.props.t('is'), value: 'eq' },
          { label: this.props.t('isnot'), value: 'ne' },
        ]
    }
  }

  fieldSelected = (condition, value) => {
    let newConditions = [...this.state.conditions].map((c) => {
      if (condition.uuidv1 === c.uuidv1) {
        let field = this.state.wantedFields.find((f) => f.value === value)
        c.name = value
        c.value = ''
        c.condition = ''
        c.type = field.type
        c.options = field.options
        c.repeatable = field.repeatable
        c.content = field.content
        return {
          ...c,
        }
      }
      return c
    })

    this.setState({ conditions: newConditions })
  }

  changeSort = (condition = null) => {
    this.setState((state, props) => {
      if (!condition) {
        if (state.sortBy === 'id') {
          return {
            sortOrder: state.sortOrder === 'ASC' ? 'DESC' : 'ASC',
          }
        } else {
          return {
            sortBy: 'id',
          }
        }
      } else {
        if (state.sortBy === condition.name) {
          return {
            sortOrder: state.sortOrder === 'ASC' ? 'DESC' : 'ASC',
          }
        } else {
          return {
            sortBy: condition.name,
          }
        }
      }
    })
  }

  filter = () => {
    let query = {
      where: [],
      whereIn: [],
      whereNotIn: [],
      whereNot: [],
      like: [],
      notLike: [],
    }

    for (const condition of this.state.conditions) {
      if (condition.type === 'boolean') {
        if (condition.condition === 'eq') {
          query.where.push({ [condition.name]: condition.value })
        } else {
          query.whereNot.push({
            column: condition.name,
            values: condition.value,
          })
        }
      }

      if (
        ['upload', 'relation', 'select', 'bigInteger', 'decimal'].includes(
          condition.type
        )
      ) {
        if (condition.repeatable) {
          if (condition.condition === 'eq') {
            query.whereIn.push({
              column: condition.name,
              values: Array.isArray(condition.value)
                ? condition.value
                : [condition.value],
            })
          } else {
            query.whereNotIn.push({
              column: condition.name,
              values: Array.isArray(condition.value)
                ? condition.value
                : [condition.value],
            })
          }
        } else {
          if (condition.condition === 'eq') {
            query.where.push({ [condition.name]: condition.value })
          } else {
            query.whereNotIn.push({
              column: condition.name,
              values: Array.isArray(condition.value)
                ? condition.value
                : [condition.value],
            })
          }
        }
      }

      if (['date', 'time', 'dateTime'].includes(condition.type)) {
        let val = condition.value
        if (aventum.db.type !== 'mongodb') {
          switch (condition.type) {
            case 'time':
              val = format(condition.value, 'HH:mm:ss')
              break

            case 'dateTime':
            case 'date':
            default:
              val = formatISO(condition.value)
              break
          }
        }
        if (condition.repeatable) {
          if (condition.condition === 'eq') {
            query.where.push({ [condition.name]: val })
          } else {
            query.whereNot.push({
              column: condition.name,
              values: val,
            })
          }
        } else {
          if (condition.condition === 'eq') {
            query.where.push({ [condition.name]: val })
          } else {
            query.whereNot.push({
              column: condition.name,
              values: val,
            })
          }
        }
      }

      if (['textarea', 'string'].includes(condition.type)) {
        if (condition.repeatable) {
          if (condition.condition === 'eq') {
            query.like.push({ column: condition.name, value: condition.value })
          } else {
            query.notLike.push({
              column: condition.name,
              value: condition.value,
            })
          }
        } else {
          if (condition.condition === 'eq') {
            query.like.push({ column: condition.name, value: condition.value })
          } else {
            query.notLike.push({
              column: condition.name,
              value: condition.value,
            })
          }
        }
      }
    }

    query.sortBy = this.state.sortBy
    query.sortOrder = this.state.sortOrder

    this.props.onFilter({
      query,
    })
  }

  render() {
    let sortByIdColor =
      this.state.sortBy === 'id' ? 'text-teal-400' : 'text-gray-500'
    let SortByIdIcon =
      this.state.sortOrder === 'ASC' ? FaSortAmountDownAlt : FaSortAmountUpAlt

    return (
      <div className={`flex flex-col mb-5`}>
        <div className={`justify-between flex`}>
          <FaFilter
            title={this.props.t('Filter')}
            className="text-cool-gray-600"
          />
          <span className="flex justify-center items-center">
            <span className="px-3">
              <SortByIdIcon
                title={this.props.t('Sortbydate')}
                onClick={() => this.changeSort()}
                className={`cursor-pointer ${sortByIdColor}`}
              />
            </span>
            <Button color="red" onClick={this.filter} size="small">
              {this.props.t('Apply')}
            </Button>
          </span>
        </div>
        {this.state.conditions.map((c, index) => {
          const sortColor =
            this.state.sortBy === c.name ? 'text-teal-400' : 'text-gray-500'
          const SortIcon =
            this.state.sortOrder === 'ASC' ? FaSortNumericDown : FaSortNumericUp
          const iconTitle = this.props.t('Sortbythisfieldin', {
            order:
              this.state.sortOrder === 'ASC'
                ? this.props.t('ASC')
                : this.props.t('DESC'),
          })

          return (
            <div key={c.uuidv1} className={`flex`}>
              <div className={`flex w-11/12`}>
                <div className={`flex items-center p-3 w-2/6`}>
                  <Dropdown
                    placeholder={this.props.t('SelectField')}
                    className="w-full"
                    options={this.state.fieldsOptions.filter((o) => {
                      if (o.value === c.name) {
                        return true
                      }

                      if (
                        !this.state.conditions
                          .map((ii) => ii.name)
                          .includes(o.value)
                      ) {
                        return true
                      }

                      return false
                    })}
                    onChange={(event, data) =>
                      this.fieldSelected(c, data.value)
                    }
                  />
                </div>
                <div className={`flex items-center p-3 w-2/6`}>
                  {c.name && (
                    <Dropdown
                      placeholder={this.props.t('Condition')}
                      className="w-full"
                      value={c.condition}
                      options={this.getConOptions(c)}
                      onChange={(event, data) =>
                        this.condSelected(c, data.value)
                      }
                    />
                  )}
                </div>
                <div className={`flex items-center p-3 w-2/6`}>
                  {['string', 'bigInteger', 'decimal', 'textarea'].includes(
                    c.type
                  ) && (
                    <Input
                      value={c.value}
                      className={`w-full`}
                      placeholder="..."
                      onChange={(event) =>
                        this.setConditionValue(c, event.target.value)
                      }
                    />
                  )}
                  {c.type === 'relation' && (
                    <SelectContentModal
                      multiple={c.repeatable}
                      onChange={(event, data) =>
                        this.setConditionValue(c, data)
                      }
                      content={c.content}
                      selected={c.value}
                    />
                  )}
                  {c.type === 'time' && (
                    <DatePicker
                      selected={c.value}
                      customInput={<Input />}
                      onChange={(date) => this.setConditionValue(c, date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                    />
                  )}
                  {c.type === 'date' && (
                    <DatePicker
                      selected={c.value}
                      customInput={<Input />}
                      onChange={(date) => this.setConditionValue(c, date)}
                    />
                  )}
                  {c.type === 'dateTime' && (
                    <DatePicker
                      selected={c.value}
                      customInput={<Input />}
                      onChange={(date) => this.setConditionValue(c, date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  )}
                  {c.type === 'upload' && (
                    <SelectUploadsModal
                      size="mini"
                      icon="image"
                      labelPosition="left"
                      id={c.uuidv1}
                      onChange={(data) => {
                        c.repeatable
                          ? this.setConditionValue(
                              c,
                              data.map((u) => u.id)
                            )
                          : this.setConditionValue(c, data[0].id)
                      }}
                      onOpen={() =>
                        this.props.setSelectedUploads(
                          Array.isArray(c.value)
                            ? c.value.map((u) => ({ id: u }))
                            : c.value
                            ? [{ id: c.value }]
                            : []
                        )
                      }
                      multiple={c.repeatable}
                    />
                  )}
                  {c.type === 'select' && (
                    <Dropdown
                      placeholder="..."
                      value={c.repeatable && c.value === '' ? [] : c.value}
                      className="w-full"
                      multiple={c.repeatable}
                      options={c.options}
                      onChange={(event, data) =>
                        this.setConditionValue(c, data.value)
                      }
                    />
                  )}
                  {c.type === 'boolean' && (
                    <Dropdown
                      placeholder="..."
                      value={c.value}
                      className="w-full"
                      options={[
                        { label: this.props.t('Checked'), value: true },
                        { label: this.props.t('Unchecked'), value: false },
                      ]}
                      onChange={(event, data) =>
                        this.setConditionValue(c, data.value)
                      }
                    />
                  )}
                </div>
              </div>
              <div className={`p-3 flex justify-center items-center w-1/12`}>
                {this.state.sortableFields.includes(c.type) && (
                  <div className={`px-3 ${sortColor}`}>
                    <SortIcon
                      title={iconTitle}
                      onClick={() => this.changeSort(c)}
                      className={`fill-current cursor-pointer`}
                    />
                  </div>
                )}
                <div className={`px-3 text-green-400`}>
                  <span
                    onClick={() => this.addCondition({ ...c, index })}
                    className={`cursor-pointer`}
                  >
                    <FaPlus />
                  </span>
                </div>
                <div className={`px-3 text-red-600`}>
                  <span
                    onClick={() => this.removeCondition({ ...c, index })}
                    className={`cursor-pointer`}
                  >
                    <FaMinus />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
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
)(withTranslation()(DynamicContentListFilter))
