import Link from 'next/link'
import Head from 'next/head'

import ArticleService from '../../services/article.service'

import Pagination from '../../components/Pagination'
import styles from '../../styles/Blog.module.scss'

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
                        <Link href={`/blog/${article.slug}`}>
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
    const { query } = context
    const { page = 1 } = query
    const limit = 8
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