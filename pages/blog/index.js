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
                        <div>
                            <a href={`/blog/${article.slug}`}>
                                <h2>{article.title}</h2>
                            </a>
                        </div>
                        <p>{article.description}</p>
                    </div>
                ))}
            </div>
            <Pagination currentPage={page} pageSize={limit} totalCount={total} />
        </div>
    )
}

export async function getServerSideProps(context) {
    console.log('blog/index.js getServerSideProps')
    const { page = 1, limit = 8 } = context.query
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