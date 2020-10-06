import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import SelectContentModal from '../../../UI/SelectContentModal/SelectContentModal'
import axios from '../../../../axios'
import { getObjectById, cleanArray } from '../../../../shared/utility'
import DynamicContentList from '../../../DynamicContentList/DynamicContentList'
import aventum from '../../../../aventum'

export class Relation extends Component {
  constructor(props) {
    super(props)
    let schema = {}
    schema =
      props.schemas && props.schemas.length
        ? getObjectById(props.schemas, props.reference)
        : null

    /**
     * The schema of the content  that will be used in the Relation field.
     *
     * @hook
     * @name RelationSchema
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} schema The schema object.
     * @param {Object} $this The Relation component.
     */
    schema = aventum.hooks.applyFiltersSync('RelationSchema', schema, this)

    this.schema = schema
  }

  getIds() {
    return Array.isArray(this.props.value)
      ? cleanArray(this.props.value)
      : cleanArray([this.props.value])
  }

  state = {
    itemsIds: this.getIds(),
    items: [],
  }

  resetLocalItems = () => {
    this.setState({ items: [] })
  }

  contentListItemsSetup() {
    if (this.state.itemsIds.length) {
      let query = { whereIn: { column: 'id', values: this.state.itemsIds } }
      axios
        .get(
          `${this.schema.name}/all?query=${encodeURIComponent(
            JSON.stringify(query)
          )}`
        )
        .then(
          (response) => {
            this.setState({ items: response.data.contents })
          },
          (error) => {}
        )
    } else {
      this.resetLocalItems()
    }
  }

  componentDidMount() {
    this.contentListItemsSetup()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({ itemsIds: this.getIds() }, () => {
        this.contentListItemsSetup()
      })
    }

    if (prevProps.schemas.length !== this.props.schemas.length) {
      this.schema = getObjectById(this.props.schemas, this.props.reference)
    }
  }

  render() {
    /**
     * The render method of the Relation just started executing.
     *
     * @hook
     * @name RelationBeforeRender
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The Relation component.
     */
    aventum.hooks.doActionSync('RelationBeforeRender', this)

    let validationMessage = this.props.errors ? (
      <p className={`text-red-600 mt-2 text-sm`}>
        {this.props.errors.join(', ') + '!'}
      </p>
    ) : null

    // const error = !!this.props.errors

    return (
      <div>
        <div className="flex justify-between my-4">
          <div>
            <label className="block text-sm font-medium leading-5 text-gray-700">
              {this.props.label}{' '}
              {this.props.required && <span style={{ color: 'red' }}>*</span>}
            </label>
          </div>
          <div>
            <SelectContentModal
              multiple={this.props.multiple}
              onChange={this.props.onChange}
              content={this.schema.name}
              selected={this.props.value ? this.props.value : ''}
            />
          </div>
        </div>
        {this.state.items.length ? (
          <div>
            <div>
              <DynamicContentList
                show
                items={this.state.items}
                content={this.schema.name}
              />
            </div>
          </div>
        ) : null}
        {validationMessage}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schema.schemas,
  }
}

export default connect(mapStateToProps)(withTranslation()(Relation))
