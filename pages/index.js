import Head from 'next/head'

import styles from '../styles/Home.module.scss'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>joaops.com.br</title>
                <meta name="description" content="Site de Tutoriais para Desenvolvedores" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Home</h1>
        </div>
    )
}
