import Link from 'next/link'

import { useAuth } from '../../contexts/auth'

import styles from './Navbar.module.scss'

export default function Navbar() {
    const { user, signout } = useAuth()

    return (
        <div className={styles.navbar}>
            <Link href={`/`}>
                <a>Home</a>
            </Link>
            <Link href={`/blog`}>
                <a>Blog</a>
            </Link>
            {user &&
                <Link href={`/editor`}>
                    <a>Editor</a>
                </Link>
            }
            {user &&
                <Link href={`/tasks`}>
                    <a>Tasks</a>
                </Link>
            }
            {user && user.permission === 'admin' &&
                <Link href={`/dashboard`}>
                    <a>Dashboard</a>
                </Link>
            }
            {!user &&
                <Link href={`/login`}>
                    <a>Entrar</a>
                </Link>
            }
            {!user &&
                <Link href={`/signup`}>
                    <a>Cadastrar</a>
                </Link>
            }
            {user &&
                <Link href={`/`}>
                    <a onClick={signout}>Sair</a>
                </Link>
            }
        </div>
    )
}