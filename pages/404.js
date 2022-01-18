import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'

import styles from '../styles/NotFound.module.scss'

export default function NotFound() {

    useEffect(() => {
        // redirecionar para a página inicial depois de 3 segundos
        const timer = setTimeout(() => {
            Router.push('/')
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>Página Não Encontrada.</title>
                <meta name="description" content="Página Não Encontrada." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Página Não Encontrada.</h1>
            <h2>Redirecionando para Home...</h2>
        </div>
    )
}
