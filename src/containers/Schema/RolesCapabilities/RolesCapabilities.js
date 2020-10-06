import React, { useState, useEffect } from 'react'
import { v1 as uuidv1 } from 'uuid'
import cloneDeep from 'lodash/cloneDeep'
import { useSelector } from 'react-redux'
import Dropdown from '../../../components/UI/Dropdown/Dropdown'
import Checkbox from '../../../components/UI/Checkbox/Checkbox'
import Tabs from '../../../components/UI/Tabs/Tabs'
import { useTranslation } from 'react-i18next'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import aventum from '../../../aventum'
import { usePrevious } from '../../../shared/react-hooks'
import { arrayUniqueByID } from '../../../shared/utility'
import { FaBars, FaPlus, FaMinus } from 'react-icons/fa'

const PlusMinusButtonsWrapper = ({
  children,
  vertical,
  id,
  innerIndex,
  outerIndex,
  dragHandleProps,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div className={`flex items-center ${!vertical ? 'flex-col' : ''}`}>
        <div
          {...dragHandleProps}
          className={'m-1 text-gray-500 opacity-25 hover:opacity-100'}
        >
          <FaBars className={'fill-current'} title={t('DragToReorder')} />
        </div>
        <div className={'m-1 text-green-400 opacity-25 hover:opacity-100'}>
          <span
            onClick={(e) =>
              aventum.hooks.doActionSync('schemaAclPlusClicked', {
                id,
                innerIndex,
                outerIndex,
              })
            }
            className={'cursor-pointer'}
          >
            <FaPlus />
          </span>
        </div>
        <div className={'m-1 text-red-600 opacity-25 hover:opacity-100'}>
          <span
            onClick={(e) =>
              aventum.hooks.doActionSync('schemaAclMinusClicked', {
                id,
                innerIndex,
                outerIndex,
              })
            }
            className={'cursor-pointer'}
          >
            <FaMinus />
          </span>
        </div>
      </div>
      {children}
    </>
  )
}

const ValueRenderer = ({ type, value, innerIndex, outerIndex, id }) => {
  const roles = useSelector((state) =>
    state.role.roles ? state.role.roles : []
  )
  const { t } = useTranslation()

  const capabilities = arrayUniqueByID(
    roles.reduce(
      (accumulator, currentValue) => [
        ...accumulator,
        ...currentValue.capabilities,
      ],
      []
    )
  ).map((c) => {
    return { label: c.name, value: c.id }
  })

  const transformedRoles = roles.map((e) => {
    return { label: e.label, value: e.id }
  })

  switch (type) {
    default:
    case 'auth':
      return null

    case 'owner':
      return null

    case 'operator':
      return (
        <Dropdown
          value={value}
          fluid
          search
          selection
          onChange={(e, d) =>
            aventum.hooks.doActionSync('schemaAclValueChanged', {
              value: d.value,
              id,
              innerIndex,
              outerIndex,
            })
          }
          options={[
            { label: t('AND'), value: 'and' },
            { label: t('OR'), value: 'or' },
          ]}
        />
      )

    case 'haveAllCaps':
    case 'haveAnyCap':
      return (
        <Dropdown
          value={value || []}
          fluid
          multiple
          clearable
          search
          selection
          onChange={(e, d) =>
            aventum.hooks.doActionSync('schemaAclValueChanged', {
              value: d.value,
              id,
              innerIndex,
              outerIndex,
            })
          }
          options={capabilities}
        />
      )

    case 'haveAllRoles':
    case 'haveAnyRoles':
      return (
        <Dropdown
          value={value || []}
          fluid
          search
          clearable
          selection
          multiple
          onChange={(e, d) =>
            aventum.hooks.doActionSync('schemaAclValueChanged', {
              value: d.value,
              id,
              innerIndex,
              outerIndex,
            })
          }
          options={transformedRoles}
        />
      )
  }
}

const AclField = ({ type, value, id, innerIndex, outerIndex, currentTab }) => {
  const { t } = useTranslation()

  const generalOptions = [
    {
      value: 'auth',
      label: t('Authenticate'),
    },
    {
      value: 'operator',
      label: t('Operator'),
    },
    {
      value: 'haveAnyCap',
      label: t('HAC'),
    },
    {
      value: 'haveAllCaps',
      label: t('HAllC'),
    },
    {
      value: 'haveAnyRoles',
      label: t('HAR'),
    },
    {
      value: 'haveAllRoles',
      label: t('HAllR'),
    },
  ]

  if (['update', 'delete'].includes(currentTab)) {
    generalOptions.unshift({
      value: 'owner',
      label: t('Owner'),
    })
  }

  if (currentTab === 'read') {
    generalOptions.push(
      ...[
        {
          value: 'ownedData',
          label: t('GetOwDa'),
        },
        {
          value: 'allData',
          label: t('GetAlDa'),
        },
      ]
    )
  }

  return (
    <Draggable key={id} draggableId={id} index={innerIndex}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          key={innerIndex}
          className="flex-1 bg-white mx-3 p-5 flex flex-col justify-between items-center rounded"
        >
          <PlusMinusButtonsWrapper
            id={id}
            outerIndex={outerIndex}
            innerIndex={innerIndex}
            dragHandleProps={draggableProvided.dragHandleProps}
            vertical
          >
            <div className="text-center w-11/12">
              <Dropdown
                className="my-3"
                onChange={(e, d) =>
                  aventum.hooks.doActionSync('schemaAclTypeChanged', {
                    value: d.value,
                    id,
                    innerIndex,
                    outerIndex,
                  })
                }
                value={type}
                options={generalOptions}
              />
              <ValueRenderer
                id={id}
                outerIndex={outerIndex}
                innerIndex={innerIndex}
                type={type}
                value={value}
              />
            </div>
          </PlusMinusButtonsWrapper>
        </div>
      )}
    </Draggable>
  )
}

const AclBuilder = ({ groups, currentTab }) => {
  if (!groups) {
    return null
  }

  return groups.map((group, index) => {
    let result

    result = group.fields.map((c, i) => (
      <AclField
        currentTab={currentTab}
        id={c.id}
        innerIndex={i}
        outerIndex={index}
        key={c.id}
        {...c}
      />
    ))

    const ooo = (
      <Droppable
        droppableId={group.id}
        type={'innerGroup'}
        key={group.id}
        direction="horizontal"
      >
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            className="flex flex-row w-11/12"
          >
            {result}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    )

    return (
      <Draggable key={group.id} draggableId={group.id} index={index}>
        {(draggableProvided, draggableSnapshot) => (
          <div
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            key={index}
            className="bg-cool-gray-100 flex flex-row-reverse mb-3 p-3 items-center rounded"
          >
            <PlusMinusButtonsWrapper
              dragHandleProps={draggableProvided.dragHandleProps}
              id={group.id}
              outerIndex={index}
            >
              {ooo}
            </PlusMinusButtonsWrapper>
          </div>
        )}
      </Draggable>
    )
  })
}

const getDefaultAcl = () => {
  return {
    create: {
      enable: false,
      fields: [
        {
          id: uuidv1(),
          fields: [
            {
              id: uuidv1(),
            },
          ],
        },
      ],
    },
    read: {
      enable: false,
      fields: [
        {
          id: uuidv1(),
          fields: [
            {
              id: uuidv1(),
            },
          ],
        },
      ],
    },
    update: {
      enable: false,
      fields: [
        {
          id: uuidv1(),
          fields: [
            {
              id: uuidv1(),
            },
          ],
        },
      ],
    },
    delete: {
      enable: false,
      fields: [
        {
          id: uuidv1(),
          fields: [
            {
              id: uuidv1(),
            },
          ],
        },
      ],
    },
  }
}

const SectionTemplate = ({ enableAcl, enable, currentTab, fields }) => {
  const { t } = useTranslation()

  return (
    <div>
      <Checkbox
        onChange={(e, d) => enableAcl(d.checked)}
        checked={enable}
        label={t('Restrict')}
        className="font-bold mb-4 mt-6 text-sm"
      />
      <br />
      {/* <p className="my-4 underline">The user must:</p> */}
      {/* <p className="my-4 text-gray-600">
        Apply some rules to restrict the {currentTab} operation.
      </p> */}

      <Droppable droppableId={currentTab} type={currentTab}>
        {(droppableProvided, droppableSnapshot) => (
          <div ref={droppableProvided.innerRef}>
            <AclBuilder currentTab={currentTab} groups={fields} />
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>

      {/* <p className="text-right underline">
        to be able to make {currentTab} operations.
      </p> */}
    </div>
  )
}

export const RolesCapabilities = ({
  roles,
  acl,
  handleChange,
  addNotification,
}) => {
  const { i18n, t } = useTranslation()
  const [currentTab, setCurrentTab] = useState('create')
  const [localAcl, setLocalAcl] = useState(getDefaultAcl())
  const prevAcl = usePrevious(acl)

  useEffect(() => {
    if (!prevAcl && acl) {
      setLocalAcl(acl)
    }
  }, [prevAcl, acl])

  // let conditionsGroups = localAcl || getDefaultAcl()

  const enableAcl = (_val) => {
    const newAlc = cloneDeep(localAcl)
    newAlc[currentTab].enable = _val
    setLocalAcl(newAlc)
    handleChange(newAlc)
  }

  useEffect(() => {
    const onPlusClicked = (_data) => {
      const newAlc = cloneDeep(localAcl)
      if (_data.innerIndex === undefined) {
        newAlc[currentTab].fields.splice(_data.outerIndex + 1, 0, {
          id: uuidv1(),
          fields: [
            {
              id: uuidv1(),
            },
          ],
        })
        newAlc[currentTab].fields.push()
      } else {
        newAlc[currentTab].fields[_data.outerIndex].fields.splice(
          _data.innerIndex + 1,
          0,
          {
            id: uuidv1(),
          }
        )
      }

      setLocalAcl(newAlc)
      handleChange(newAlc)
    }

    const onMinusClicked = (_data) => {
      const newAlc = cloneDeep(localAcl)
      if (_data.innerIndex === undefined) {
        if (newAlc[currentTab].fields.length > 1) {
          newAlc[currentTab].fields = newAlc[currentTab].fields.filter(
            (f) => f.id !== _data.id
          )
        }
      } else {
        if (newAlc[currentTab].fields[_data.outerIndex].fields.length > 1) {
          newAlc[currentTab].fields[_data.outerIndex].fields = newAlc[
            currentTab
          ].fields[_data.outerIndex].fields.filter((f) => f.id !== _data.id)
        }
      }

      setLocalAcl(newAlc)
      handleChange(newAlc)
    }

    const onTypeChanged = (_data) => {
      const newAlc = cloneDeep(localAcl)
      newAlc[currentTab].fields[_data.outerIndex].fields[
        _data.innerIndex
      ].type = _data.value
      newAlc[currentTab].fields[_data.outerIndex].fields[
        _data.innerIndex
      ].value = null

      setLocalAcl(newAlc)
      handleChange(newAlc)
    }

    const onValueChanged = (_data) => {
      const newAlc = cloneDeep(localAcl)
      newAlc[currentTab].fields[_data.outerIndex].fields[
        _data.innerIndex
      ].value = _data.value
      setLocalAcl(newAlc)
      handleChange(newAlc)
    }

    const orderChanged = (_data) => {
      const ourDropables = ['read', 'create', 'update', 'delete', 'innerGroup']
      if (!ourDropables.includes(_data.type)) {
        return
      }

      const { destination, source, draggableId } = _data

      if (!destination) {
        return
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return
      }

      const newAlc = cloneDeep(localAcl)

      let sourceList, destList
      if (_data.type === 'innerGroup') {
        sourceList = newAlc[currentTab].fields.find(
          (i) => i.id === source.droppableId
        ).fields
        destList = newAlc[currentTab].fields.find(
          (i) => i.id === destination.droppableId
        ).fields
      } else {
        sourceList = destList = newAlc[currentTab].fields
      }

      if (sourceList.length === 1) {
        addNotification(
          {},
          {
            errorHeader: t('TRMHMTOIIOTTIFI'),
            error: true,
          }
        )
        return
      }

      const draggableElement = sourceList.find((i) => i.id === draggableId)

      // From source.index remove one item
      sourceList.splice(source.index, 1)

      // Remove nothing and insert the draggableId
      destList.splice(destination.index, 0, draggableElement)

      setLocalAcl(newAlc)
      handleChange(newAlc)
    }

    aventum.hooks.addAction(
      'schemaAclPlusClicked',
      'RolesCapabilities',
      onPlusClicked
    )
    aventum.hooks.addAction(
      'schemaAclMinusClicked',
      'RolesCapabilities',
      onMinusClicked
    )
    aventum.hooks.addAction(
      'schemaAclValueChanged',
      'RolesCapabilities',
      onValueChanged
    )
    aventum.hooks.addAction(
      'schemaAclTypeChanged',
      'RolesCapabilities',
      onTypeChanged
    )
    aventum.hooks.addAction(
      'SchemaNFieldsOnDragEnd',
      'RolesCapabilities',
      orderChanged
    )
    return () => {
      aventum.hooks.removeAction('schemaAclPlusClicked', 'RolesCapabilities')
      aventum.hooks.removeAction('schemaAclMinusClicked', 'RolesCapabilities')
      aventum.hooks.removeAction('schemaAclValueChanged', 'RolesCapabilities')
      aventum.hooks.removeAction('schemaAclTypeChanged', 'RolesCapabilities')
      aventum.hooks.removeAction('SchemaNFieldsOnDragEnd', 'RolesCapabilities')
    }
  }, [localAcl, currentTab, handleChange, t])

  return (
    <div>
      <h3 className="text-center text-base mb-8 font-bold text-cool-gray-500">
        {t('AccessControlList')}
      </h3>
      <Tabs
        tabs={[
          {
            title: t('CREATE'),
            name: 'create',
            content: (
              <SectionTemplate
                enableAcl={enableAcl}
                enable={localAcl.create.enable}
                currentTab={currentTab}
                fields={localAcl.create.fields}
              />
            ),
          },
          {
            title: t('READ'),
            name: 'read',
            content: (
              <SectionTemplate
                enableAcl={enableAcl}
                enable={localAcl.read.enable}
                currentTab={currentTab}
                fields={localAcl.read.fields}
              />
            ),
          },
          {
            title: t('UPDATE'),
            name: 'update',
            content: (
              <SectionTemplate
                enableAcl={enableAcl}
                enable={localAcl.update.enable}
                currentTab={currentTab}
                fields={localAcl.update.fields}
              />
            ),
          },
          {
            title: t('DELETE'),
            name: 'delete',
            content: (
              <SectionTemplate
                enableAcl={enableAcl}
                enable={localAcl.delete.enable}
                currentTab={currentTab}
                fields={localAcl.delete.fields}
              />
            ),
          },
        ]}
        firstActiveTab={currentTab}
        onTabChange={setCurrentTab}
      />
    </div>
  )
}

function areEqual(prevProps, nextProps) {
  if (prevProps.acl && nextProps.acl) {
    return true
  }

  return false
}

export default React.memo(RolesCapabilities, areEqual)
