import slugify from 'slugify'

import { ArticleModel } from '../libs/connection'
import UserService from './user.service'

const create = async (uid, title, description, contents, image, tags) => {
    console.log('ArticleService.create()')
    const slug = slugify(title, { lower: true })
    const article = {
        user_uid: uid,
        title,
        description,
        contents,
        slug,
        image,
        tags
    }
    const articleModel = new ArticleModel(article)
    const newArticle = await articleModel.save()
    const user = await UserService.findOneByUid(uid)
    return {
        id: newArticle._id,
        slug: newArticle.slug,
        title: newArticle.title,
        description: newArticle.description,
        contents: newArticle.contents,
        image: newArticle.image,
        tags: newArticle.tags,
        createdAt: newArticle.createdAt,
        updatedAt: newArticle.updatedAt,
        username: user.name
    }
}

const getSlugs = async () => {
    console.log('ArticleService.getSlugs()')
    return await ArticleModel.find({}).select('slug -_id')
}

const getOneBySlug = async (slug) => {
    console.log('ArticleService.getOneBySlug()')
    // user populate('user') para popular todos os dados do usuário ou populate({ path: 'user', select: 'name' }) para selecionar alguns dados
    const article = await ArticleModel.findOne({ slug }).populate('tags').populate({ path: 'user', select: 'name -_id' })
    // console.log(article)
    // console.log(article.user)
    if (!article) {
        return null
        /*var error = new Error('Artigo Não Encontrado.')
        error.status = 404
        error.title = 'Not Found'
        throw error*/
    }
    return {
        id: article._id.toString(),
        slug: article.slug,
        title: article.title,
        description: article.description,
        contents: article.contents,
        image: article.image,
        tags: article.tags.map(t => { return { id: t._id.toString(), name: t.name } }),
        createdAt: article.createdAt.toString(),
        updatedAt: article.updatedAt.toString(),
        user_uid: article.user_uid,
        username: article.user.name
    }
}

const getArticlesByPage = async (page, limit) => {
    console.log('ArticleService.getArticlesByPage()')
    const articles = await ArticleModel.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('tags').populate({ path: 'user', select: 'name -uid -_id' }).select('-contents')
    return articles.map(article => {
        return {
            id: article._id.toString(),
            slug: article.slug,
            title: article.title,
            description: article.description,
            // contents: article.contents,
            image: article.image,
            tags: article.tags.map(t => { return { id: t._id.toString(), name: t.name } }),
            createdAt: article.createdAt.toString(),
            updatedAt: article.updatedAt.toString(),
            username: article.user.name
        }
    })
}

const getTotalOfArticles = async () => {
    console.log('ArticleService.getTotalOfArticles()')
    return await ArticleModel.countDocuments()
}

const deleteOne = async (uid, id) => {
    console.log('ArticleService.deleteOne()')
    const article = await ArticleModel.findOne({ _id: id, user_uid: uid })
    if (!article) {
        var error = new Error('Artigo Não Encontrado.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    await ArticleModel.deleteOne({ _id: id, user_uid: uid })
}

const ArticleService = {
    create,
    getSlugs,
    getOneBySlug,
    getArticlesByPage,
    getTotalOfArticles,
    deleteOne
}

export default ArticleService