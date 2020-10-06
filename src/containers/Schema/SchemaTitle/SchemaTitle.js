import React, { useState } from 'react'
import Input from '../../../components/UI/Input/Input'
import { useTranslation } from 'react-i18next'

const SchemaTitle = React.memo(
  ({
    name: propsName,
    icon: propsIcon,
    singularTitle: propsSingularTitle,
    title: propsTitle,
    nameErrors,
    titleLabel,
    titlePlaceholder,
    singularTitleLabel,
    singularTitlePlaceholder,
    nameLabel,
    namePlaceholder,
    showIcon,
    iconLabel,
    titleErrors,
    singularTitleErrors,
    onTitleChange,
    onSingularTitleChange,
    onNameChange,
    onIconChange
  }) => {
    const { t } = useTranslation()

    // const [touched, setTouched] = useState(false)
    const [name, setName] = useState(propsName)
    const [icon, setIcon] = useState(propsIcon)
    const [singularTitle, setSingularTitle] = useState(propsSingularTitle)
    const [title, setTitle] = useState(propsTitle)

    nameErrors =
      nameErrors && nameErrors.length ? nameErrors.join(', ') + '!' : null
    titleErrors =
      titleErrors && titleErrors.length ? titleErrors.join(', ') + '!' : null
    singularTitleErrors =
      singularTitleErrors && singularTitleErrors.length
        ? singularTitleErrors.join(', ') + '!'
        : null

    const inputClasses = 'w-full md:w-1/4 px-3 mb-4'

    return (
      <div className="flex mb-4 flex-col md:flex-row items-center">
        <Input
          required
          id="theTitle"
          label={titleLabel || t('ContentPluralTitle')}
          placeholder={titlePlaceholder || t('ForExamplePosts')}
          onChange={(e) => {
            setTitle(e.target.value)
            onTitleChange(e.target.value)
          }}
          value={title}
          error={!!titleErrors}
          className={inputClasses}
          help={titleErrors}
        />
        <Input
          required
          id="singularTitle"
          label={singularTitleLabel || t('ContentSingularTitle')}
          placeholder={singularTitlePlaceholder || t('ForExamplePost')}
          onChange={(e) => {
            setSingularTitle(e.target.value)
            onSingularTitleChange(e.target.value)
          }}
          value={singularTitle}
          error={!!singularTitleErrors}
          className={inputClasses}
          help={singularTitleErrors}
        />
        <Input
          required
          id="name"
          label={nameLabel || t('ContentPluralName')}
          placeholder={namePlaceholder || t('ForExampPosts')}
          onChange={(e) => {
            setName(e.target.value)
            onNameChange(e.target.value)
          }}
          value={name}
          error={!!nameErrors}
          className={inputClasses}
          help={nameErrors}
        />
        {showIcon && (
          <Input
            id="icon"
            label={iconLabel || t('SVGIcon')}
            placeholder={namePlaceholder || t('ForExampPosts')}
            onChange={(e) => {
              setIcon(e.target.value)
              onIconChange(e.target.value)
            }}
            value={icon}
            className={inputClasses}
          />
        )}
      </div>
    )
  }
)

export default SchemaTitle
