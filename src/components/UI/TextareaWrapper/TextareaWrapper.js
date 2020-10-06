import React from 'react'
import TinyEditor from '../TinyEditor/TinyEditor'
import TextareaField from '../TextareaField/TextareaField'

export default function Textarea (props) {
  let textAreaField

  switch (props.textareaType) {
    default:
    case 'textarea':
      textAreaField = <TextareaField {...props} />
      break

    case 'wysiwyg':
      textAreaField = <TinyEditor {...props} />
      break
  }

  return textAreaField
}
