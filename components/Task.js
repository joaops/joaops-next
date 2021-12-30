import { useState } from "react"

// estou usando props para não precisar renomear as variáveis
const Task = (props) => {
    const id = props.id
    // top e left precisam ser do tipo useState para poderem alterar a posição da tarefa
    const [top, setTop] = useState(props.top)
    const [left, setLeft] = useState(props.left)
    let offsetTop = 0, offsetLeft = 0
    // mas text não pode ser do tipo useState, ocorre um bug ao digitar
    let text = props.text

    const dragMouseDown = (event) => {
        event.preventDefault()
        offsetLeft = event.clientX - left
        offsetTop = event.clientY - top
        // document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
        // console.log('id:', props.id)
    }

    const elementDrag = (event) => {
        event.preventDefault()
        setTop(event.clientY - offsetTop)
        setLeft(event.clientX - offsetLeft)
        // console.log('top:', top, 'left:', left)
        // setTop(event.clientY - offsetTop)
        // setLeft(event.clientX - offsetLeft)
    }

    const closeDragElement = () => {
        document.onmouseup = null
        document.onmousemove = null
        // atualiza apenas a posição da tarefa
        // console.log('id:', id, 'top:', top, 'left:', left)
        props.update({ id, top, left })
    }

    const handleInput = (event) => {
        text = event.target.innerText
    }

    const handleBlur = () => {
        // atualiza apenas o texto da tarefa
        console.log('id:', id, 'text:', text)
        if (props.text !== text) {
            props.update({ id, text })
        }
    }

    const deletarTask = () => {
        // deleta a tarefa do banco de dados
        // console.log('id:', id)
        props.delete({ id })
    }

    const styleContainer = {
        top,
        left,
        position: 'absolute',
        // border: '1px solid #3C3C3C',
        border: '1px solid #CACACA',
        // backgroundColor: '#191919',
        backgroundColor: '#FCFCFC',
        width: 300
    }

    const containerHeader = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const styleHeader = {
        padding: 10,
        paddingLeft: 42,
        cursor: 'move',
        zIndex: 10,
        backgroundColor: '#2196F3',
        color: '#FFF',
        textAlign: 'center',
        width: '100%',
    }

    const styleButton = {
        margin: 10
    }

    const styleParagraph = {
        outline: '0px solid transparent',
        margin: 8
    }

    return (
        <div style={styleContainer}>
            <div style={containerHeader}>
                <div style={styleHeader} onMouseDown={dragMouseDown} onMouseUp={closeDragElement}>
                    Click Here To Move
                </div>
                <div style={{ backgroundColor: '#2196F3' }}>
                    <button style={styleButton} onClick={deletarTask}>x</button>
                </div>
            </div>
            <div>
                <p
                    style={styleParagraph}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onBlur={handleBlur}>{text}</p>
            </div>
        </div>
    )
}

export default Task