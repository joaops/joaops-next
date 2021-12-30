import { useContext, createContext, useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from '@firebase/auth'
import Router from 'next/router'

import { auth } from '../libs/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const authentication = useProvideAuth()
    return <AuthContext.Provider value={authentication}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}

function useProvideAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updateUser, setUpdateUser] = useState(false)

    useEffect(() => {
        // ATENÇÃO AQUI
        // esse método monitora as mudanças do tokem e pode ser chamado 2 ou 3 vezes em seguida
        // fazendo com que o usuário e as permissões sejam atualizadas ou consultadas várias vezes sem necessidade
        // para evitar esse problema, eu adicionei uma variável updateUser que é monitorada pelo useEffect
        // fazendo com que essa rotina seja executada uma única vez quando a página é carregada
        // mas ainda assim, esse método é chamado duas vezes durante o login
        // não que seja um problema grave, pois o login é feito poucas vezes pelo usuário
        // mas ainda assim, é um problema que precisa ser resolvido
        const unsubscribe = auth.onIdTokenChanged(async (rawUser) => {
            if (rawUser) {
                if (auth.currentUser) {
                    // manda atualizar o usuário uma única vez
                    setUpdateUser(true)
                }
            } else {
                await handleUser(false)
            }
        })
        // const unsubscribe = auth.onIdTokenChanged(handleUser)
        // const unsubscribe = auth.onAuthStateChanged(handleUser)
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (updateUser) {
            // console.log('Carregando o Usuário')
            const loadUser = async () => {
                await handleUser(auth.currentUser)
            }
            loadUser()
        }
    }, [updateUser])

    const handleUser = async (rawUser) => {
        if (rawUser) {
            const newUser = await formatUser(rawUser)
            const { token } = newUser
            // consultar a permissão do usuário usando o token
            const permission = await getPermission(token)
            // adiciona o usuário com token e permissão no AuthProvider
            setUser({ ...newUser, permission })
            setLoading(false)
            return newUser
        } else {
            setUser(null)
            setLoading(false)
            setUpdateUser(false)
            return null
        }
    }

    const signinWithEmail = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
            .then((response) => {
                handleUser(response.user)
                // Router.push('/')
                Router.replace('/')
            })
    }

    const signout = () => {
        return auth
            .signOut()
            .then(() => handleUser(false));
    }

    return {
        user,
        loading,
        signinWithEmail,
        signout
    }
}

// envio um token e recebo uma permissão de usuário
const getPermission = async (token) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', `Bearer ${token}`)
    const options = {
        method: 'GET',
        headers
    }
    const response = await fetch('/api/user/permission', options)
    const status = response.status
    if (status === 200) {
        const data = await response.json()
        return data.permission
    } else {
        return 'user'
    }
}

const formatUser = async (rawUser) => {
    // console.log(rawUser)
    // const token = await user.getIdToken(/* forceRefresh */ true);
    const decodedToken = await rawUser.getIdTokenResult(/*forceRefresh*/ true)
    // const { token, expirationTime } = decodedToken
    const { token } = decodedToken
    // console.log(token)
    return {
        uid: rawUser.uid,
        email: rawUser.email,
        name: rawUser.displayName,
        provider: rawUser.providerData[0].providerId,
        photoURL: rawUser.photoURL,
        disabled: rawUser?.reloadUserInfo?.disabled,
        token,
        // expirationTime,
        // stripeRole: await getStripeRole(),
    }
}