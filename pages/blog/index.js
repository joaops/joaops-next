import Link from 'next/link'
import Head from 'next/head'

import ArticleService from '../../services/article.service'

import Pagination from '../../components/Pagination'
import styles from '../../styles/Blog.module.scss'
import dbConnect from '../../libs/dbConnect'

export default function Blog({ articles, total, page, limit }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Blog</title>
                <meta name="description" content="Página do Blog com as últimas postagens do site https://joaops.com.br" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Blog</h1>
            <div>
                {articles.map(article => (
                    <div key={article.id}>
                        <Link href={`/blog/${article.slug}`} prefetch={false}>
                            <a>
                                <h2>{article.title}</h2>
                            </a>
                        </Link>
                        <p>{article.description}</p>
                    </div>
                ))}
            </div>
            <Pagination currentPage={page} pageSize={limit} totalCount={total} />
        </div>
    )
}

export async function getServerSideProps(context) {
    // console.log('blog/index.js getServerSideProps')
    const { page = 1, limit = 8 } = context.query
    try {
        console.log('Tentando consultar a API');
        const protocol = context.req.headers['x-forwarded-proto'] || 'http'
        console.log('Protocolo: ', protocol)
        const host = context.req.headers.host
        const response = await fetch(`${protocol}://${host}/api/article?page=${page}&limit=${limit}`)
        const data = await response.json()
        const articles = data.articles
        const total = data.total
        console.log('Consulta a API realizada com sucesso')
        return {
            props: {
                articles,
                total,
                page,
                limit,
            }
        }
    } catch (error) {
        console.log('Erro ao consultar a API, consultando banco de dados')
        await dbConnect()
        const total = await ArticleService.getTotalOfArticles()
        const articles = await ArticleService.getArticlesByPage(page, limit)
        return {
            props: {
                articles,
                total,
                page,
                limit,
            }
        }
    }
}