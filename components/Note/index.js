import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import styles from './Note.module.scss'

const NoteEditor = dynamic(() => import('../NoteEditor'), { ssr: false })

const Note = ({ note, update, exclude, select }) => {
    const [display, setDisplay] = useState('none')
    const [contents, setContents] = useState('')
    const [top, setTop] = useState(0)
    const [left, setLeft] = useState(0)
    const [selected, setSelected] = useState(false)
    let offsetTop = 0, offsetLeft = 0

    useEffect(() => {
        if (note) {
            setDisplay('block')
            setTop(note.top)
            setLeft(note.left)
        }
    }, [note])

    const dragMouseDown = (event) => {
        event.preventDefault()
        // Pega a Posição do Mouse
        offsetLeft = event.clientX - left
        offsetTop = event.clientY - top
        document.onmousemove = elementDrag
    }

    const elementDrag = (event) => {
        event.preventDefault()
        setTop(event.clientY - offsetTop)
        setLeft(event.clientX - offsetLeft)
    }

    const closeDragElement = async () => {
        document.onmouseup = null
        document.onmousemove = null
        const newTop = roundNumber(top)
        const newLeft = roundNumber(left)
        setTop(newTop)
        setLeft(newLeft)
        if (newTop !== note.top || newLeft !== note.left) {
            update(note.id, { top: newTop, left: newLeft})
        }
    }

    const roundNumber = (input) => {
        const number = 10
        return Math.round(input / number) * number
    }

    const updateNoteHeight = () => {
        const note_height_ = document.getElementById('note_height_' + note.id)
        if (note_height_) {
            // completa o tamanho do container para ficar padronizado
            const height = note_height_?.offsetHeight
            // console.log('height', height)
            setCompleteHeight(ceilNumber(height) + 5)
        }
    }

    const ceilNumber = (input) => {
        const number = 10
        let temp = (Math.ceil(input / number) * number) - input
        if (temp === 0) {
            temp = number
        }
        temp -= 1
        return temp
    }

    const deleteNote = () => {
        // delete é palavra reservada -_-
        exclude(note.id)
    }

    const handleReady = (editor) => {
        // Carrega o conteúdo da nota após carregar o editor
        setContents(note.contents)
    }

    const handleChange = (event, editor) => {
        editor.ui.viewportOffset = { top: top + 56 }
        const data = editor.getData()
        setContents(data)
        // colocar um tempo para salvar a nota depois de editar?
    }

    const handleFocus = (event, editor) => {
        editor.ui.viewportOffset = { top: top + 56 }
    }

    const handleBlur = () => {
        // se houve alteração, salvar a nota
        if (contents !== note.contents) {
            // Atualiza o conteúdo da nota
            update(note.id, { contents })
            // Atualizar o tamanho da nota ao salvar
            // updateNoteHeight()
        }
    }

    const handleSelected = () => {
        if (selected) {
            handleUnselected()
        } else {
            setSelected(true)
            if (select) {
                select(note.id)
            }
            document.onmousedown = handleUnselected
        }
    }

    const handleUnselected = (event) => {
        setSelected(false)
        document.onmousedown = null
        if (select) {
            select('')
        }
    }

    const styleContainer = {
        display,
        top,
        left,
        position: 'absolute'
    }

    const styleHeader = {
        backgroundColor: selected ? '#333' : '#000',
    }

    return (
        <div className={styles.container} style={styleContainer} onClick={handleSelected}>
            <div className={styles.header} style={styleHeader} onMouseDown={dragMouseDown} onMouseUp={closeDragElement}>
                <div className={styles.move}></div>
                <button className={styles.button} onClick={deleteNote}>X</button>
            </div>
            <div id={'note_height_' + note.id} className={styles.scrollbar}>
                <NoteEditor data={contents} onReady={handleReady} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} />
            </div>
        </div>
    )
}

export default Note