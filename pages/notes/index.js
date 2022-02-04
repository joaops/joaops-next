import Router from 'next/router'
import { useEffect, useState } from 'react'

import { useAuth } from '../../contexts/auth'

import Breadcrumb from '../../components/Breadcrumb'
import Folder from '../../components/Folder'
import Note from '../../components/Note'

import styles from '../../styles/Notes.module.scss'

export default function Notes() {
    const { loading, user } = useAuth()
    const [folder, setFolder] = useState({})
    const [trash, setTrash] = useState({})
    const [subfolders, setSubfolders] = useState([])
    const [notes, setNotes] = useState([])
    const [breadcrumb, setBreadcrumb] = useState([])
    const [selected, setSelected] = useState('')

    useEffect(() => {
        // canceling async function
        let isSubscribed = true
        // carregar a pasta raiz
        if (user) {
            const findRootFolder = async () => {
                const headers = new Headers()
                headers.append('Content-Type', 'application/json')
                headers.append('Authorization', `Bearer ${user.token}`)
                const options = {
                    method: 'GET',
                    headers
                }
                const response = await fetch('/api/folder', options)
                const status = response.status
                if (status === 200 && isSubscribed) {
                    const data = await response.json()
                    setFolder(data.folder)
                    setTrash(data.trash)
                    setSubfolders(data.subfolders)
                    setNotes(data.notes)
                    setBreadcrumb(data.breadcrumb)
                }
            }

            findRootFolder()
        }
        return () => { (isSubscribed = false) }
    }, [user])

    const goToTrash = async () => {
        Router.push('/notes/trash')
    }

    const createNewFolder = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = {
            name: 'Nova Pasta', top: 50, left: 260, parent: folder.id
        }
        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch('/api/folder', options)
        const status = response.status
        if (status === 201) {
            const data = await response.json()
            setSubfolders([...subfolders, data])
        }
    }

    const updateFolder = async (id, update) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        let body = {}
        if (update.name) {
            body = {
                name: update.name
            }
        }
        if (update.top || update.left) {
            body = {
                top: update.top,
                left: update.left
            }
        }
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch('/api/folder/' + id, options)
        if (response.status === 200) {
            const data = await response.json()
            setSubfolders(subfolders.map(folder => folder.id === id ? data : folder))
        }
    }

    const moverPastaParaLixeira = async (id) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        let body = {
            parent: trash.id
        }
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch(`/api/folder/${id}`, options)
        const status = response.status
        if (status === 200) {
            const data = await response.json()
            setSubfolders(subfolders.filter(subfolder => subfolder.id !== data.id))
        }
    }

    const enterTheFolder = async (id) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const options = {
            method: 'GET',
            headers
        }
        const response = await fetch(`/api/folder/${id}`, options)
        const status = response.status
        if (status === 200) {
            const data = await response.json()
            setFolder(data.folder)
            setTrash(data.trash)
            setSubfolders(data.subfolders)
            setNotes(data.notes)
            setBreadcrumb(data.breadcrumb)
        }
    }

    const createNewNote = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = {
            contents: '', top: 50, left: 170, width: 322, height: 67, parent: folder.id
        }
        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch('/api/note', options)
        const status = response.status
        if (status === 201) {
            const data = await response.json()
            setNotes([...notes, data])
        }
    }

    const updateNote = async (id, update) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        let body = {}
        if (update.contents) {
            body = {
                contents: update.contents
            }
        }
        if (update.top || update.left) {
            body = {
                top: update.top,
                left: update.left
            }
        }
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch('/api/note/' + id, options)
        if (response.status === 200) {
            const data = await response.json()
            setNotes(notes.map(note => note.id === id ? data : note))
        }
    }

    const moverNotaParaLixeira = async (id) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        let body = {
            parent: trash.id
        }
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch(`/api/note/${id}`, options)
        const status = response.status
        if (status === 200) {
            const data = await response.json()
            setNotes(notes.filter(note => note.id !== data.id))
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

    // função para ordernar as pastas ou notas pelo campo updatedAt, assim o mais recente fica no topo
    const sortByUpdatedAt = (a, b) => {
        if (a.updatedAt > b.updatedAt) {
            return 1
        }
        if (a.updatedAt < b.updatedAt) {
            return -1
        }
        return 0
    }

    // Renderiza as pastas e notas na ordem de atualização
    const renderFoldersNotes = () => {
        const list = []
        list = [...notes, ...subfolders]
        return list.sort(sortByUpdatedAt).map(item => {
            if (item.name != null) {
                return (
                    <Folder key={item.id} folder={item} update={updateFolder} enter={enterTheFolder} select={setSelected} />
                )
            } else {
                return (
                    <Note key={item.id} note={item} update={updateNote} exclude={moverNotaParaLixeira} />
                )
            }
        })
    }

    return (
        <div className={styles.container}>
            <Breadcrumb breadcrumb={breadcrumb} goTo={enterTheFolder} />
            <button onClick={goToTrash}>Lixeira</button>
            <button onClick={createNewFolder}>Criar Pasta</button>
            {
                selected &&
                <button onMouseDown={() => moverPastaParaLixeira(selected)}>Excluir</button>
            }
            <button onClick={createNewNote}>Criar Nota</button>
            {
                renderFoldersNotes()
            }
        </div>
    )
}
