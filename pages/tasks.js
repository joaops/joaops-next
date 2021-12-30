import Head from 'next/head'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import Task from '../components/Task'

import { useAuth } from '../contexts/auth'

import styles from '../styles/Tasks.module.scss'

export default function Tasks() {
    const { loading, user } = useAuth()
    const [tarefas, setTarefas] = useState([])

    useEffect(() => {
        const loadTarefas = async () => {
            const headers = new Headers()
            headers.append('Content-Type', 'application/json')
            headers.append('Authorization', `Bearer ${user.token}`)
            const options = {
                method: 'GET',
                headers
            }
            const response = await fetch('/api/task', options)
            const status = response.status
            if (status === 200) {
                const data = await response.json()
                setTarefas(data)
            }
        }
        if (user) {
            loadTarefas()
        }
    }, [user])

    const adicionarTarefa = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify({ text: '', top: 83, left: 703 })
        const options = {
            method: 'POST',
            headers,
            body
        }
        const response = await fetch('/api/task', options)
        const status = response.status
        if (status === 201) {
            const task = await response.json()
            console.log(task)
            setTarefas([...tarefas, task])
        }
    }

    const atualizarTarefa = async (task) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify(task)
        const options = {
            method: 'PUT',
            headers,
            body
        }
        const response = await fetch(`/api/task`, options)
        const status = response.status
        if (status === 200) {
            const data = await response.json()
            setTarefas(tarefas.map(t => t.id === data.id ? data : t))
        }
    }

    const removerTarefa = async (task) => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify(task)
        const options = {
            method: 'DELETE',
            headers,
            body
        }
        const response = await fetch(`/api/task`, options)
        const status = response.status
        if (status === 200) {
            setTarefas(tarefas.filter(t => t.id !== task.id))
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

    return (
        <div className={styles.container}>
            <Head>
                <title>Tasks</title>
                <meta name="description" content="Tasks" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Tasks</h1>
            <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
            <div>
                {tarefas && tarefas.map(t => (<Task key={t.id} id={t.id} text={t.text} top={t.top} left={t.left} update={atualizarTarefa} delete={removerTarefa} />))}
            </div>
        </div>
    )
}