import { AuthProvider } from '../contexts/auth'

import Navbar from '../components/Navbar'

import '../styles/globals.scss'
import 'highlight.js/styles/vs.css'
import '../styles/CKEditor.css'

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
        </AuthProvider>
    )
}

export default MyApp
