import React, { useEffect } from 'react'
import SelectUploadsModal from '../SelectUploadsModal/SelectUploadsModal'
import { useTranslation } from 'react-i18next'
import aventum from '../../../aventum'
import { Editor } from '@tinymce/tinymce-react'
import 'prismjs'

const TinyEditor = (props) => {
  const { t, i18n } = useTranslation()
  var langDir = props.dir || i18n.dir()
  var language = props.lang || i18n.language

  useEffect(() => {
    const selectedUploadsModalDoneClickedSubscription = (selectedUploads) => {
      let uploads = ''
      for (const i of selectedUploads) {
        uploads = `<img src="${i.path}" alt="" />` + uploads
      }
      window.tinymce.activeEditor.insertContent(uploads)
    }

    aventum.hooks.addAction(
      `selectedUploadsModalDoneClicked${props.id}`,
      'Aventum/core/TinyEditor/DidMount',
      selectedUploadsModalDoneClickedSubscription
    )

    return () => {
      aventum.hooks.removeAction(
        `selectedUploadsModalDoneClicked${props.id}`,
        'Aventum/core/TinyEditor/DidMount'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEditorChange = (content, editor) => {
    props.onChange(content)
  }

  const validationMessage = props.errors ? (
    <p className={'text-red-600 mt-2 text-sm'}>
      {props.errors.join(', ') + '!'}
    </p>
  ) : null

  const config = {
    height: 500,
    branding: false,
    image_advtab: true,
    codesample_content_css: `${process.env.PUBLIC_URL}/prism.css`,
    directionality: langDir || 'ltr', // Possible Values: ltr, rtl
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'insertdatetime media nonbreaking save table contextmenu directionality',
      'emoticons template paste textcolor colorpicker textpattern codesample toc',
    ],
    toolbar1:
      'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    toolbar2:
      'ltr rtl | print preview media | forecolor backcolor emoticons | codesample',
  }

  if (language !== 'en_US') {
    config.language = language
  }

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <div>
          <label className="block text-sm font-medium leading-5 text-gray-700">
            {props.label}{' '}
            {props.required && <span style={{ color: 'red' }}>*</span>}
          </label>
        </div>
        <div>
          <SelectUploadsModal
            multiple
            size="small"
            icon="image"
            labelPosition="left"
            btnLabel={t('InsertImages')}
            id={props.id}
          />
        </div>
      </div>
      <div>
        <div>
          <Editor
            value={props.value || ''}
            id={props.id}
            init={config}
            onEditorChange={handleEditorChange}
          />
        </div>
      </div>
      {validationMessage}
    </>
  )
}

export default TinyEditor
