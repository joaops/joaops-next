import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CustomEditor = dynamic(() => import('../components/CustomEditor'), { ssr: false })

import styles from '../styles/Editor.module.scss'
import { useAuth } from '../contexts/auth'
import Router, { useRouter } from 'next/router'

export default function Editor() {
    const { loading, user } = useAuth()
    const router = useRouter()

    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState([])
    const [selectedTag, setSelectedTag] = useState('')
    const [tagsArtigo, setTagsArtigo] = useState([])
    const [contents, setContents] = useState('')

    useEffect(() => {
        if (user) {
            const loadTags = async () => {
                const headers = new Headers()
                headers.append('Content-Type', 'application/json')
                const options = {
                    method: 'GET',
                    headers
                }
                const response = await fetch('/api/tag', options)
                const status = response.status
                if (status === 200) {
                    const data = await response.json()
                    setTags(data)
                }
            }
            loadTags()
        }
    }, [user])

    useEffect(() => {
        if (router.query.slug && user) {
            // console.log('router.query.slug:', router.query.slug)
            const loadArticle = async (slug) => {
                const headers = new Headers()
                headers.append('Content-Type', 'application/json')
                const options = {
                    method: 'GET',
                    headers
                }
                const response = await fetch(`/api/article/${slug}`, options)
                const status = response.status
                if (status === 200) {
                    const data = await response.json()
                    if (user.uid === data.user_uid) {
                        setId(data.id)
                        setTitle(data.title)
                        setDescription(data.description)
                        setImage(data.image)
                        setTagsArtigo(data.tags)
                        setContents(data.contents)
                    }
                }
            }
            loadArticle(router.query.slug)
        }
    }, [router.query.slug, user])

    const criarTag = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify({ name: tag })
        const options = {
            method: 'POST',
            headers,
            body
        }
        const response = await fetch('/api/tag', options)
        const status = response.status
        if (status === 201) {
            // const tag = await response.json()
            await loadTags()
            setTag('')
        }
    }

    const adicionarTag = async () => {
        tags.some(t => {
            if (t.name === selectedTag) {
                if (!tagsArtigo.includes(t)) {
                    setTagsArtigo([...tagsArtigo, t])
                }
                setSelectedTag('')
                return true
            }
        })
    }

    const salvarArtigo = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify({
            title,
            description,
            image,
            tags: tagsArtigo.map(t => t.id),
            contents
        })
        const options = {
            method: 'POST',
            headers,
            body
        }
        const response = await fetch('/api/article', options)
        const status = response.status
        if (status === 201) {
            const article = await response.json()
            console.log(article.slug)
            Router.push(`/blog/${article.slug}`)
        }
    }

    const atualizarArtigo = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify({
            id,
            title,
            description,
            image,
            tags: tagsArtigo.map(t => t.id),
            contents
        })
        const options = {
            method: 'PUT',
            headers,
            body
        }
        const response = await fetch('/api/article', options)
        const status = response.status
        if (status === 200) {
            const article = await response.json()
            console.log(article.slug)
            Router.push(`/blog/${article.slug}`)
        }
    }

    const handleReady = (editor) => {
        // console.log('onReady')
    }

    const handleChange = (event, editor) => {
        // console.log('onChange')
        const data = editor.getData()
        setContents(data)
    }

    const handleBlur = (event, editor) => {
        // console.log('onBlur')
    }

    const handleFocus = (event, editor) => {
        // console.log('onFocus')
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
                <title>Editor</title>
                <meta name="description" content="Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.editor}>
                <div>
                    <label>Título</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Descrição</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>URL da Imagem de Capa</label>
                    <input type="text" value={image} onChange={e => setImage(e.target.value)} />
                </div>
                <div>
                    <label>Criar Tags</label>
                    <input type='text' value={tag} onChange={(e) => setTag(e.target.value.toLowerCase())} />
                    <button onClick={criarTag}>Criar</button>
                </div>
                <div>
                    <label>Pesquisar Tags:</label>
                    <input list="tags" name="tags" value={selectedTag} onChange={e => setSelectedTag(e.target.value)} />
                    <datalist id='tags'>
                        {tags.map(tag => (
                            <option key={tag.id} value={tag.name} />
                        ))}
                    </datalist>
                    <button onClick={adicionarTag}>Adicionar</button>
                    <ul>
                        {tagsArtigo.map(tag => (
                            <li key={tag.id}>{tag.name}</li>
                        ))}
                    </ul>
                </div>
                <CustomEditor data={contents} onReady={handleReady} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} />
                <div>
                    {
                        id ? <button onClick={atualizarArtigo}>Atualizar</button> : <button onClick={salvarArtigo}>Salvar</button>
                    }
                </div>
            </div>
        </div>
    )
}