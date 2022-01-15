import { useEffect } from 'react'
import { AuthProvider } from '../contexts/auth'

import Navbar from '../components/Navbar'

import '../styles/globals.scss'
import 'highlight.js/styles/vs.css'
import '../styles/CKEditor.css'

function MyApp({ Component, pageProps }) {

    useEffect(() => {
        document.documentElement.lang = 'pt-br'
    })

    return (
        <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
        </AuthProvider>
    )
}

export default MyApp
