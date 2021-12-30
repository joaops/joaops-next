import Head from 'next/head'
import Router from 'next/router'
import { useState } from 'react'

import { useAuth } from '../contexts/auth'

import styles from '../styles/Login.module.scss'

export default function Login() {
    const { loading, user, signinWithEmail } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        try {
            event.preventDefault()
            signinWithEmail(email, password)
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Loading...</h1>
            </div>
        )
    }

    if (user) {
        Router.replace('/')
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Login</title>
                <meta name="description" content="Página de Login do Site https://joaops.com.br" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-mail:</label>
                <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                <label htmlFor="password">Password:</label>
                <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}