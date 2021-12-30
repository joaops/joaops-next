import Head from 'next/head'
import { useState } from 'react'

import styles from '../styles/Signup.module.scss'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        // desativo o comportamento padrão do formulário para não recarregar a página
        event.preventDefault()
        // envio os dados para a API
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        const body = JSON.stringify({ name, email, password })
        const options = {
            method: 'POST',
            headers,
            body
        }
        const response = await fetch('/api/user/signup', options)
        const status = response.status
        if (status === 201) {
            const user = await response.json()
            console.log(user)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Cadastro</title>
                <meta name="description" content="Página de Cadastro do Site https://joaops.com.br" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Cadastre-se</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nome:</label>
                <input name="name" type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                <label htmlFor="email">E-mail:</label>
                <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                <label htmlFor="password">Password:</label>
                <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="submit">Cadastre-se</button>
            </form>
        </div>
    )
}