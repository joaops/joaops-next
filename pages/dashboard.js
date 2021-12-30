import Head from 'next/head'
import Router from 'next/router'

import { useAuth } from '../contexts/auth'

import styles from '../styles/Login.module.scss'

export default function Dashboard() {
    const { loading, user } = useAuth()
    
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

    if (user?.permission !== 'admin') {
        Router.replace('/')
        return <div className={styles.container}><h1>Redirecting...</h1></div>
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Dashboard</h1>
        </div>
    )
}