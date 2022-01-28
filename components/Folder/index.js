import Image from 'next/image'
import { useEffect, useState } from 'react'

import styles from './Folder.module.scss'

const Folder = ({ folder, update, enter, select }) => {
    const [display, setDisplay] = useState('none')
    const [top, setTop] = useState(0)
    const [left, setLeft] = useState(0)
    const [selected, setSelected] = useState(false)
    let offsetTop = 0, offsetLeft = 0

    useEffect(() => {
        if (folder) {
            setDisplay('flex')
            setTop(folder.top)
            setLeft(folder.left)
            const folder_id = document.getElementById("folder_" + folder.id)
            if (folder_id) {
                folder_id.innerText = folder.name
            }
        }
    }, [folder])

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
        if (newTop !== folder.top || newLeft !== folder.left) {
            update(folder.id, { top: newTop, left: newLeft})
        }
    }

    const roundNumber = (input) => {
        const number = 10
        return Math.round(input / number) * number
    }

    const atualizarNome = async () => {
        let innerText = document.getElementById("folder_" + folder.id)?.innerText
        if (!innerText) {
            innerText = 'Nova Pasta'
            document.getElementById("folder_" + folder.id).innerText = innerText
        }
        if (innerText !== folder.name) {
            update(folder.id, { name: innerText })
        }
    }

    const handleSelected = () => {
        if (selected) {
            handleUnselected()
        } else {
            setSelected(true)
            select(folder.id)
            document.onmousedown = handleUnselected
        }
    }

    const handleUnselected = (event) => {
        setSelected(false)
        document.onmousedown = null
        select('')
    }

    const handleDoubleClick = () => {
        // handleUnselected()
        enter(folder.id)
    }

    const styleContainer = {
        display,
        top,
        left,
        position: 'absolute',
        backgroundColor: selected ? 'rgba(128, 128, 128, 0.91)' : null,
    }

    return (
        <div className={styles.container} style={styleContainer}>
            <div className={styles.header}
                onClick={handleSelected}
                onBlur={handleUnselected}
                onDoubleClick={handleDoubleClick}
                onMouseDown={dragMouseDown}
                onMouseUp={closeDragElement}>
                <Image src="/FolderIcon.svg" alt="Folder Icon" width={55} height={100} />
            </div>
            <p
                id={'folder_' + folder.id}
                className={styles.paragraph}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={atualizarNome}>
            </p>
        </div>
    )
}

export default Folder