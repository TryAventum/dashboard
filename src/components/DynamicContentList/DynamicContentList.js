import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import isEqual from 'lodash/isEqual'
import ReactTableWrapper from '../UI/TableGenerator/TableGenerator'
import { connect } from 'react-redux'
import { v1 } from 'uuid'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import aventum from '../../aventum'
import * as actions from '../../store/actions/index'
import { getObjectByName } from '../../shared/utility'
import acl from '../../shared/acl'
import Undo from '../UI/Undo/Undo'
import DataModal from '../UI/DataModal/DataModal'
import ValueRenderer from './ValueRenderer/ValueRenderer'
import Filter from './Filter/DynamicContentListFilter'
import { usePrevious, useUndo } from '../../shared/react-hooks'
import axios from '../../axios'

/**
 * Generate the content list dynamically that differentiate per content type and fields.
 */
function DynamicContentList({
  selected: selectedProp,
  schemas,
  content,
  show,
  filter = true,
  selectable,
  multiple,
  onChange,
  items,
  deleteContent,
  resetCurrentContentList,
  getContentPage,
  perPage = 20,
  currentUser,
  roles,
  loading,
}) {
  // console.log(useTable)
  const { t } = useTranslation()

  const firstUpdate = useRef(true)

  const [pagination, setPagination] = useState({})
  const [uuidv1, setUuidv1] = useState(() => `d${v1()}`)
  const [query, setQuery] = useState({ sortOrder: 'DESC', sortBy: 'id' })
  const [schema, setSchema] = useState(null)
  const [currentContentList, setCurrentContentList] = useState([])
  const [uploads, setUploads] = useState([])
  const [columns, setColumns] = useState([])
  const [selectedState, setSelectedState] = useState(() =>
    selectedProp
      ? Array.isArray(selectedProp)
        ? selectedProp
        : [selectedProp]
      : []
  )

  const prevCurrentContentList = usePrevious(currentContentList)
  const prevItems = usePrevious(items)
  const prevSchema = usePrevious(schema)
  const prevSchemas = usePrevious(schemas)
  const prevUploads = usePrevious(uploads)
  const prevSelectedState = usePrevious(selectedState)

  const deleteItem = (item) => {
    deleteContent({ id: item.id, uuidv1: uuidv1 }, content)
  }

  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteItem
  )
  const prevUndo = usePrevious(undoList)

  const select = (event, item) => {
    let newSelected
    setSelectedState((selected) => {
      if (selected.includes(item)) {
        newSelected = selected.filter((e) => e !== item)
      } else {
        if (multiple) {
          newSelected = [...selected, item]
        } else {
          newSelected = [item]
        }
      }

      return newSelected
    })

    onChange(event, newSelected)
  }

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    getContentPage(
      {
        page: 1,
        perPage: perPage,
        url: `query=${encodeURIComponent(JSON.stringify(query))}`,
        id: uuidv1,
      },
      content
    )
  }, [content])

  const setListPage = (response) => {
    if (response.status === 200) {
      setCurrentContentList(response.data.contents)
      setPagination(response.data.pagination)
    }
  }

  useEffect(() => {
    // const onDeleteContent = (response, payload) => {
    // if (response.status === 200) {
    //   let newCurrentContentList = currentContentList.filter(
    //     (i) => i.id !== payload.id
    //   )
    //   setCurrentContentList(newCurrentContentList)
    // }
    // }

    const columnsSetUp = () => {
      if (!schema) {
        return null
      }

      let HeaderCellsFields = []

      // Remove the "relation" and "custom" fields and keep only three fields
      HeaderCellsFields =
        schema && schema.fields
          ? schema.fields
              .filter((field) => {
                let isOk = !(
                  field.type === 'relation' || field.type === 'custom'
                )

                /**
                 * Whether to keep this field or remove it from the list.
                 *
                 * @hook
                 * @name HeaderCellsFieldsCondition
                 * @type applyFiltersSync
                 * @since 1.0.0
                 *
                 * @param {boolean} isOk Whether to keep the field or no.
                 * @param {Object} field The field object from the schema model.
                 * @param {Object} $this The DynamicContentList component.
                 */
                isOk = aventum.hooks.applyFiltersSync(
                  'HeaderCellsFieldsCondition',
                  isOk,
                  field,
                  this
                )

                return isOk
              })
              .slice(0, 3)
          : []

      /**
       * The header cells(the table header cells) fields of the table.
       *
       * @hook
       * @name HeaderCellsFields
       * @type applyFiltersSync
       * @since 1.0.0
       *
       * @param {Array} HeaderCellsFields The header cells fields that will be filtered.
       * @param {Object} $this The DynamicContentList component.
       */
      HeaderCellsFields = aventum.hooks.applyFiltersSync(
        'HeaderCellsFields',
        HeaderCellsFields,
        this
      )

      const reactTableDynamicHeaders = HeaderCellsFields.map((p) => {
        return {
          id: p.id,
          Header: p.fields.find((h) => h.name === 'label').value,
          accessor: (a) => a,
          Cell: (props) => (
            <div className={'text-center'}>
              <ValueRenderer field={p} values={props.value} uploads={uploads} />
            </div>
          ),
        }
      })

      if (selectable) {
        reactTableDynamicHeaders.unshift({
          id: 'SelectItem',
          accessor: (c) => c,
          Cell: (props) => {
            return (
              <div className={'text-center'}>
                <input
                  onChange={(e) => select(e, props.value.id)}
                  checked={selectedState.includes(props.value.id)}
                  type="checkbox"
                />
              </div>
            )
          },
        })
      }

      const colums = [
        ...reactTableDynamicHeaders,
        {
          id: 'DataPreview',
          Header: t('DataPreview'),
          accessor: (c) => c,
          Cell: (props) => {
            return (
              <div className={'text-center'}>
                <DataModal
                  json
                  trigger
                  data={props.value}
                  headerContent={t('DataInDBLooksLike')}
                  headingTitle={t('DataPreview')}
                />
              </div>
            )
          },
        },
        {
          id: 'Edit',
          Header: t('Edit'),
          accessor: (a) => a,
          Cell: (props) => {
            const canUpdate = acl.canUpdateContent(
              currentUser,
              schema,
              false,
              roles,
              props.value
            )

            const editIcon = (
              <FaEdit
                className={`${
                  canUpdate ? 'cursor-pointer text-indigo-400' : 'text-gray-500'
                } inline`}
              />
            )

            return (
              <div className={'text-center'}>
                {canUpdate ? (
                  <Link
                    className="edit-content"
                    to={`/contents/${content}/${props.value.id}/edit`}
                  >
                    {editIcon}
                  </Link>
                ) : (
                  editIcon
                )}
              </div>
            )
          },
        },
        {
          id: 'Delete',
          Header: t('Delete'),
          accessor: (a) => a,
          Cell: (props) => {
            const canDelete = acl.canDeleteContent(
              currentUser,
              schema,
              false,
              roles,
              props.value
            )

            return (
              <div className={'text-center'}>
                <FaTrash
                  onClick={(e) => {
                    e.stopPropagation()
                    if (canDelete) {
                      removeWithUndo(props.value)
                    }
                  }}
                  className={`${
                    canDelete ? 'cursor-pointer text-red-400' : 'text-gray-500'
                  } inline`}
                />
              </div>
            )
          },
        },
      ]

      setColumns(colums)
    }

    const setUploadsFields = () => {
      if (!schema) {
        return
      }

      const uploadFields =
        schema && schema.fields
          ? schema.fields.filter((f) => f.type === 'upload')
          : []
      const uploadFieldsNames = uploadFields.map(
        (f) => f.fields.find((s) => s.name === 'name').value
      )

      let ids = []
      if (items || currentContentList) {
        ids = (items || currentContentList)
          .map((t) => {
            let cids = []
            for (const prop in t) {
              if (uploadFieldsNames.includes(prop)) {
                const temp = Array.isArray(t[prop]) ? t[prop] : [t[prop]]
                cids = [...cids, ...temp]
              }
            }
            return cids
          })
          .reduce((accumulator, currentValue) => {
            return [...accumulator, ...currentValue]
          }, [])
      }

      // Remove duplicate
      ids = [...new Set(ids)]

      if (ids.length) {
        const query = { whereIn: { column: 'id', values: ids } }

        axios
          .get(
            `uploads?page=1&query=${encodeURIComponent(JSON.stringify(query))}`
          )
          .then(
            (response) => {
              setUploads(response.data.uploads)
            },
            () => {}
          )
      }
    }

    const getSchema = () => {
      let schema = getObjectByName(schemas, content)
      /**
       * The schema of the content that DynamicContentList component will render.
       *
       * @hook
       * @name DynamicContentListSchema
       * @type applyFiltersSync
       * @since 1.0.0
       *
       * @param {Object} schema The schema model.
       * @param {Object} $this The DynamicContentList component.
       */
      schema = aventum.hooks.applyFiltersSync(
        'DynamicContentListSchema',
        schema,
        this
      )

      setSchema(schema)
    }

    columnsSetUp()
    setUploadsFields()
    getSchema()

    // We use dynamic unique namespace here because sometimes we have
    // a popup of this component above the already opened one.
    aventum.hooks.addAction(`gCP${uuidv1}`, uuidv1, setListPage)
    // aventum.hooks.addAction(`cD${uuidv1}`, uuidv1, onDeleteContent)
    return () => {
      if (!show) {
        resetCurrentContentList()
      }

      aventum.hooks.removeAction(`gCP${uuidv1}`, uuidv1)
      // aventum.hooks.removeAction(`cD${uuidv1}`, uuidv1)
    }
  }, [
    content,
    isEqual(prevSchemas, schemas),
    isEqual(prevSelectedState, selectedState),
    isEqual(prevSchema, schema),
    isEqual(currentContentList, prevCurrentContentList),
    isEqual(items, prevItems),
    isEqual(prevUploads, uploads),
    isEqual(undoList, prevUndo),
    show,
  ])

  const onFilter = (options) => {
    const newQuery = options.query
    setQuery(newQuery)
    getContentPage(
      {
        page: 1,
        perPage: perPage,
        url: `query=${encodeURIComponent(JSON.stringify(newQuery))}`,
        id: uuidv1,
      },
      content
    )
  }

  const getContents = ({ page }) => {
    if (!show) {
      getContentPage(
        {
          page: page,
          perPage: perPage,
          url: `query=${encodeURIComponent(JSON.stringify(query))}`,
          id: uuidv1,
        },
        content
      )
    }
  }

  useEffect(() => {
    getContents({ page: 1 })
  }, [])

  /**
   * The render method of the DynamicContentList component just called.
   *
   * @hook
   * @name DynamicContentListRenderStarted
   * @type doActionSync
   * @since 1.0.0
   *
   * @param {Object} $this The DynamicContentList component.
   */
  aventum.hooks.doActionSync('DynamicContentListRenderStarted', this)

  if (!schema) {
    return null
  }

  let itemsToRender = items || currentContentList

  /**
   * The items that willbe rendered in the table.
   *
   * @hook
   * @name DynamicContentListItems
   * @type applyFiltersSync
   * @since 1.0.0
   *
   * @param {Array} itemsToRender The items that will be rendered.
   * @param {Object} $this The DynamicContentList component.
   */
  itemsToRender = aventum.hooks.applyFiltersSync(
    'DynamicContentListItems',
    itemsToRender,
    this
  )

  const data = itemsToRender

  return (
    <div>
      {!show && filter && <Filter schema={schema} onFilter={onFilter} />}
      <ReactTableWrapper
        loading={loading}
        className={`${!data.length ? 'h-72' : ''} bg-white`}
        pages={pagination.totalPages}
        pagination={pagination}
        onPageChange={getContents}
        manual
        sortable={false}
        data={data}
        columns={columns}
        onFetchData={getContents}
        showPageSizeOptions={false}
        showPagination={!show}
        pageSize={data ? data.length : null}
        // className={`${selectable ? 'cursor-pointer' : ''}`}
        // Text
        previousText={t('Previous')}
        nextText={t('Next')}
        loadingText={t('Loading...')}
        noDataText={t('Noitemsfound')}
        pageText={t('Page')}
        ofText={t('of')}
        rowsText={t('rows')}
        // Accessibility Labels
        pageJumpText={t('jumptopage')}
        rowsSelectorText={t('rowsperpage')}
        // getNoDataProps={() => ({
        //   className: 'bg-green-100',
        // })}
        getTbodyProps={({ props }) => {
          return {
            ...props,
            className: props.className + ' contents',
          }
        }}
        getTrGroupProps={({ row, props }) => {
          if (row) {
            return {
              ...props,
              className: allUndoLists.find((i) => row.id == i.id)
                ? props.className + ' h-0 border-0 overflow-hidden'
                : selectedState.includes(row.id)
                ? props.className + ' bg-green-200 selected'
                : props.className,
            }
          } else {
            return props
          }
        }}
      />
      <Undo
        onUndo={onUndo}
        onDismiss={onDismiss}
        undoList={undoList}
        time={3000}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schema.schemas,
    loading: state.content.loadingContent,
    currentUser: state.auth.currentUser,
    roles: state.role.roles,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteContent: (payload, content) =>
      dispatch(actions.deleteContent(payload, content)),
    getContentPage: (payload, content) =>
      dispatch(actions.getContentPage(payload, content)),
    resetCurrentContentList: () => dispatch(actions.resetCurrentContentList()),
    getUploads: (payload) => dispatch(actions.getUploads(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicContentList)
