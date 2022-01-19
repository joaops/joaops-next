import { useEffect, useState } from 'react'
import hljs from 'highlight.js'
import Head from 'next/head'
import Router from 'next/router'

import { useAuth } from '../../contexts/auth'
import ArticleService from '../../services/article.service'
import styles from '../../styles/Article.module.scss'
import dbConnect from '../../libs/dbConnect'

export default function Article({ article }) {
    const { loading, user } = useAuth()
    const [checkedDeletePost, setCheckedDeletePost] = useState(false)

    useEffect(() => {
        hljs.highlightAll()
    }, [])

    const handleUpdate = async () => {
        Router.push(`/editor?slug=${article.slug}`)
    }

    const handleDelete = async () => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${user.token}`)
        const body = JSON.stringify({ id: article.id })
        const options = {
            method: 'DELETE',
            headers,
            body
        }
        const response = await fetch(`/api/article`, options)
        const status = response.status
        if (status === 200) {
            Router.replace(`/blog`)
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{article.title}</title>
                <meta name="description" content={article.description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <img src={article.image} alt="Imagem de Capa" />
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <p>By {article.username} At {article.createdAt}</p>
            {user && user.uid === article.user_uid &&
                <div>
                    <button onClick={handleUpdate}>Atualizar</button>
                    <input type="checkbox" checked={checkedDeletePost} onChange={e => setCheckedDeletePost(!checkedDeletePost)} />
                    <button onClick={handleDelete} disabled={!checkedDeletePost}>Deletar</button>
                </div>
            }
            <div>
                {article.tags.map(tag => (<span key={tag.id}>#{tag.name} </span>))}
            </div>
            <div className='ck-content' dangerouslySetInnerHTML={{ __html: article.contents }} />
        </div>
    )
}

export async function getStaticPaths() {
    // consultar todos os slugs para montar o paths
    // tem que ter pelo menos 1, ou ocasionará um erro durante o build
    await dbConnect()
    const slugs = await ArticleService.getSlugs()
    // console.log(slugs)
    const paths = slugs.map(slug => ({
        params: { slug: slug.slug }
    }))
    // console.log(paths)
    return { paths, fallback: 'blocking' }
}

export async function getStaticProps(context) {
    const { params } = context
    const { slug } = params // consulta os dados do artigo usando o slug
    await dbConnect()
    const article = await ArticleService.getOneBySlug(slug)
    // console.log('article', article)
    if (!article) {
        return {
            notFound: true,
            revalidate: 60
        }
    }
    return {
        props: {
            article
        },
        revalidate: 60 // 1 minutos para recriar o artigo
    }
}