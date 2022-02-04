import { useEffect, useState } from 'react'
import Folder from '../../components/Folder'
import Note from '../../components/Note'
import { useAuth } from '../../contexts/auth'

import styles from '../../styles/Trash.module.scss'

export default function Trash() {
    const { loading, user } = useAuth()
    const [selected, setSelected] = useState('')
    // const [trash, setTrash] = useState()
    const [restoreTo, setRestoreTo] = useState()
    const [foldersToRestore, setFoldersToRestore] = useState([])
    const [folders, setFolders] = useState([])
    const [notes, setNotes] = useState([])

    useEffect(() => {
        // canceling async function
        let isSubscribed = true
        // se tem um usuário logado
        if (user) {
            // consulta a lixeira
            const findTrash = async () => {
                const headers = new Headers()
                headers.append('Content-Type', 'application/json')
                headers.append('Authorization', `Bearer ${user.token}`)
                const options = {
                    method: 'GET',
                    headers
                }
                const response = await fetch('/api/folder/trash', options)
                const status = response.status
                if (status === 200 && isSubscribed) {
                    const data = await response.json()
                    setFoldersToRestore(data.foldersToRestore)
                    setRestoreTo(data.home.id)
                    setFolders(data.folders)
                    setNotes(data.notes)
                }
            }
            findTrash()
        }
        return () => { (isSubscribed = false) }
    }, [user])

    const deleteItem = async (id) => {
        // console.log('deleteItem', id)
        const isFolder = folders.find(folder => folder.id === id)
        const isNote = notes.find(note => note.id === id)
        if (isFolder) {
            await deleteFolder(id)
        } else if (isNote) {
            await deleteNote(id)
        } else {
            console.log('Item Não Encontrado')
        }
    }

    const deleteFolder = async (id) => {
        // console.log('deleteFolder', id)
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const options = {
            method: 'DELETE',
            headers
        }
        const response = await fetch(`/api/folder/${id}`, options)
        const status = response.status
        if (status === 200) {
            setFolders(folders.filter(folder => folder.id !== id))
        }
    }

    const deleteNote = async (id) => {
        // console.log('deleteNote', id)
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const options = {
            method: 'DELETE',
            headers
        }
        const response = await fetch(`/api/note/${id}`, options)
        const status = response.status
        if (status === 200) {
            setNotes(notes.filter(note => note.id !== id))
        }
    }

    const restoreItem = async (id) => {
        // console.log('restoreItem', id)
        const isFolder = folders.find(folder => folder.id === id)
        const isNote = notes.find(note => note.id === id)
        if (isFolder) {
            await restoreFolder(id)
        } else if (isNote) {
            await restoreNote(id)
        } else {
            console.log('Item Não Encontrado')
        }
    }

    const restoreFolder = async (id) => {
        // console.log('restoreFolder', id)
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        let body = {
            parent: restoreTo
        }
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch(`/api/folder/${id}`, options)
        const status = response.status
        if (status === 200) {
            setFolders(folders.filter(folder => folder.id !== id))
        }
    }

    const restoreNote = async (id) => {
        // console.log('restoreNote', id)
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        let body = {
            parent: restoreTo
        }
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch(`/api/note/${id}`, options)
        const status = response.status
        if (status === 200) {
            setNotes(notes.filter(note => note.id !== id))
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Loading...</h1>
            </div>
        )
    }

    if (!user) {
        Router.replace('/login')
        return <div className={styles.container}><h1>Redirecting...</h1></div>
    }

    // lógica que alinha os itens excluídos dentro da lixeira
    let proximaPosicaoPasta = { top: 80, left: 10 }
    const distanciaEntrePastas = { top: 120, left: 110 }
    let proximaPosicaoNota = { top: 80, left: 10 }
    const distanciaEntreNotas = { top: 480, left: 330 }
    const limiteHorizontal = { min: 10, max: 1220 }

    const adjustPosition = (item) => {
        if (item.name != null) {
            item.top = proximaPosicaoPasta.top
            item.left = proximaPosicaoPasta.left
            proximaPosicaoPasta.left += distanciaEntrePastas.left
            if (proximaPosicaoPasta.left > limiteHorizontal.max) {
                proximaPosicaoPasta.left = limiteHorizontal.min
                proximaPosicaoPasta.top += distanciaEntrePastas.top
            }
            // comece a alinhar as notas abaixo da última pasta
            proximaPosicaoNota.top = proximaPosicaoPasta.top + distanciaEntrePastas.top
        } else {
            item.top = proximaPosicaoNota.top
            item.left = proximaPosicaoNota.left
            proximaPosicaoNota.left += distanciaEntreNotas.left
            if (proximaPosicaoNota.left > limiteHorizontal.max) {
                proximaPosicaoNota.left = limiteHorizontal.min
                proximaPosicaoNota.top += distanciaEntreNotas.top
            }
        }
        return item
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Lixeira</div>
            <label>Restaurar Para ...</label>
            <select onChange={(e) => setRestoreTo(e.target.value)}>
                {
                    foldersToRestore.map(folder => {
                        return (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                        )
                    })
                }
            </select>
            {
                selected &&
                <>
                    <button onMouseDown={() => restoreItem(selected)}>Restaurar</button>
                    <button onMouseDown={() => deleteItem(selected)}>Excluir</button>
                </>
            }
            {
                folders && folders.map(folder => {
                    folder = adjustPosition(folder)
                    return (
                        <Folder key={folder.id} folder={folder} update={(id, data) => { }} enter={(id) => { }} select={setSelected} />
                    )
                })
            }
            {
                notes && notes.map(note => {
                    note = adjustPosition(note)
                    return (
                        <Note key={note.id} note={note} update={(id, data) => { }} exclude={deleteNote} select={setSelected} />
                    )
                })
            }
        </div>
    )
}