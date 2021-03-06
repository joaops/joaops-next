import Editor from 'ckeditor5-inline'
import { CKEditor } from '@ckeditor/ckeditor5-react'
// import { useEffect, useState } from 'react'

export default function NoteEditor({ data, onReady, onChange, onBlur, onFocus }) {
    
    const editorConfiguration = {
        toolbar: {
            items: [
                'heading',
                'alignment',
                'bold',
                'italic',
                'strikethrough',
                'link',
                'imageInsert',
                'code',
                'codeBlock',
                'blockQuote',
                'bulletedList',
                'numberedList',
                'todoList',
                'outdent',
                'indent',
                'removeFormat',
                'undo',
                'redo'
            ],
            shouldNotGroupWhenFull: true
        },
        /*ui: {
            viewportOffset: { top: 10 },
        },*/
        language: 'pt-br',
        heading: {
            options: [
                { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Título 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Título 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Título 6', class: 'ck-heading_heading6' },
            ]
        },
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                'linkImage'
            ]
        }
    }

    const handleReady = (editor) => {
        // console.log('onReady')
        // Desativar o Upload de Imagens em Base64 por enquanto
        // TODO: Implementar o Upload de Imagens no Firebase
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            // return new MyUploadAdapter(loader)
            return null
        }
        onReady(editor)
    }

    return (
        <CKEditor
            editor={Editor}
            config={editorConfiguration}
            data={data}
            onReady={handleReady}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus} />
    )
}