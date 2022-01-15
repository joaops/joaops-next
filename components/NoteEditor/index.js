import Editor from 'ckeditor5-inline'
import { CKEditor } from '@ckeditor/ckeditor5-react'

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
            ]
        },
        language: 'pt-br',
        heading: {
            options: [
                { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
                // { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                // { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                // { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
                // { model: 'heading4', view: 'h4', title: 'Título 4', class: 'ck-heading_heading4' },
                // { model: 'heading5', view: 'h5', title: 'Título 5', class: 'ck-heading_heading5' },
                // { model: 'heading6', view: 'h6', title: 'Título 6', class: 'ck-heading_heading6' },
                {
                    model: 'titulo_1',
                    view: {
                        name: 'h1',
                        classes: 'titulo_1'
                    },
                    title: 'Título 1',
                    class: 'ck-heading_heading1',
                    converterPriority: 'high',
                },
                {
                    model: 'titulo_2',
                    view: {
                        name: 'h2',
                        classes: 'titulo_2'
                    },
                    title: 'Título 2',
                    class: 'ck-heading_heading2',
                    converterPriority: 'high'
                },
                {
                    model: 'titulo_3',
                    view: {
                        name: 'h3',
                        classes: 'titulo_3'
                    },
                    title: 'Título 3',
                    class: 'ck-heading_heading3',
                    converterPriority: 'high'
                },
                {
                    model: 'titulo_4',
                    view: {
                        name: 'h4',
                        classes: 'titulo_4'
                    },
                    title: 'Título 4',
                    class: 'ck-heading_heading4',
                    converterPriority: 'high'
                },
                {
                    model: 'titulo_5',
                    view: {
                        name: 'h5',
                        classes: 'titulo_5'
                    },
                    title: 'Título 5',
                    class: 'ck-heading_heading5',
                    converterPriority: 'high'
                },
                {
                    model: 'titulo_6',
                    view: {
                        name: 'h6',
                        classes: 'titulo_6'
                    },
                    title: 'Título 6',
                    class: 'ck-heading_heading6',
                    converterPriority: 'high'
                }
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

    return (
        <CKEditor
            editor={Editor}
            config={editorConfiguration}
            data={data}
            onReady={onReady}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus} />
    )
}