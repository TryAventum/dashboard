import React, { Component } from 'react'
import Panel from '../../../components/UI/Panel/Panel'
import Button from '../../../components/UI/Button/Button'
import {
  FaPencilRuler,
  FaCalculator,
  FaHourglassHalf,
  FaRegCalendarAlt,
  FaDna,
  FaRegCalendar,
  FaClock,
  FaItalic,
  FaCheckSquare,
  FaCloudUploadAlt,
  FaListAlt,
  FaICursor,
} from 'react-icons/fa'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import aventum from '../../../aventum'

const iconClasses =
  'flex-shrink-0 ltr:-ml-1 rtl:-mr-1 ltr:mr-3 rtl:ml-3 h-6 w-6 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150'

const FieldButton = ({ name, icon, onClick, id }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className="w-full mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"
    >
      {icon}
      <span className="truncate">{name}</span>
    </button>
  )
}

// import classes from './FieldsButtons.module.css'

/**
 * Render the fields buttons in the schema editor for example
 */
class FieldsButtons extends Component {
  /**
   * The state of the FieldsButtons component.
   *
   * @hook
   * @name FieldsButtonsSate
   * @type applyFiltersSync
   * @since 1.0.0
   *
   * @param {Object} state The state.
   * @param {Object} $this The FieldsButtons component.
   */
  state = aventum.hooks.applyFiltersSync('FieldsButtonsSate', {}, this)

  handleItemClick = (name) => (e) => {
    this.props.onAddItem(name)
  }

  render() {
    /**
     * The render method of the FieldsButtons component just started.
     *
     * @hook
     * @name FieldsButtonsRenderStarted
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The FieldsButtons component.
     */
    aventum.hooks.doActionSync('FieldsButtonsRenderStarted', this)

    let customFields = null

    if (this.props.showAll) {
      customFields = this.props.fields.map((e) => {
        return (
          <FieldButton
            key={e.name}
            name={e.name}
            id={e.name}
            onClick={this.handleItemClick(e.name)}
            icon={<FaPencilRuler className={iconClasses} />}
          />
        )
      })
    }

    /**
     * The custom fields buttons.
     *
     * @hook
     * @name FieldsButtonsCustomFields
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Array} customFields The custom fields buttons that will be filtered
     * @param {Object} $this The FieldsButtons component.
     */
    customFields = aventum.hooks.applyFiltersSync(
      'FieldsButtonsCustomFields',
      customFields,
      this
    )

    let defaultButtons = [
      {
        name: 'string',
        label: 'string',
        icon: <FaICursor className={iconClasses} />,
      },
      {
        name: 'date',
        label: 'Date',
        icon: <FaRegCalendar className={iconClasses} />,
      },
      {
        name: 'time',
        label: 'Time',
        icon: <FaClock className={iconClasses} />,
      },
      {
        name: 'dateTime',
        label: 'DateTime',
        icon: <FaRegCalendarAlt className={iconClasses} />,
      },
      {
        name: 'decimal',
        label: 'decimal',
        icon: <FaCalculator className={iconClasses} />,
      },
      {
        name: 'bigInteger',
        label: 'bigInteger',
        icon: <FaHourglassHalf className={iconClasses} />,
      },
      {
        name: 'boolean',
        label: 'Boolean',
        icon: <FaCheckSquare className={iconClasses} />,
      },
      {
        name: 'relation',
        label: 'Relation',
        icon: <FaDna className={iconClasses} />,
      },
      {
        name: 'select',
        label: 'Select',
        icon: <FaListAlt className={iconClasses} />,
      },
      {
        name: 'upload',
        label: 'Upload',
        icon: <FaCloudUploadAlt className={iconClasses} />,
      },
      {
        name: 'textarea',
        label: 'Textarea',
        icon: <FaItalic className={iconClasses} />,
      },
    ]

    /**
     * The default buttons like the string and number buttons.
     *
     * @hook
     * @name FieldsButtonsDefault
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Array} defaultButtons The buttons that will be filtered.
     * @param {Object} $this The FieldsButtons component.
     */
    defaultButtons = aventum.hooks.applyFiltersSync(
      'FieldsButtonsDefault',
      defaultButtons,
      this
    )

    defaultButtons = defaultButtons.map((b) => {
      return (
        <FieldButton
          key={b.name}
          id={b.name}
          name={this.props.t(b.label)}
          onClick={this.handleItemClick(b.name)}
          icon={b.icon}
        />
      )
    })

    return (
      <Panel className={`sticky`} style={{ top: '4rem' }}>
        <Panel.Content>
          <nav>
            {defaultButtons}
            {customFields}
          </nav>
          <div className="w-full flex mt-6 items-center">
            <Button id="save" className="mx-1" onClick={this.props.saveSchema}>
              {this.props.saveText}
            </Button>
            <span
              className="mx-1 cursor-pointer text-cool-gray-400"
              onClick={this.props.onCancel}
            >
              {this.props.t('Cancel')}
            </span>
          </div>
        </Panel.Content>
      </Panel>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loadingFields: state.field.loadingFields,
    loading: state.shared.loading,
    fields: state.field.fields,
  }
}

export default connect(mapStateToProps)(withTranslation()(FieldsButtons))
