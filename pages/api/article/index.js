import { withAuth } from "../../../middlewares/withAuth"
import ArticleService from "../../../services/article.service"

const handler = async (req, res) => {
    try {
        console.log('/api/article')
        switch (req.method) {
            case 'GET':
                return handleGet(req, res)
            case 'POST':
                return handlePost(req, res)
            case 'DELETE':
                return handleDelete(req, res)
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas os métodos GET, POST e DELETE são Permetidos Nesse Endpoint.'
                })
        }
    } catch (error) {
        const status = error.status || 500
        const title = error.title || 'Internal Server Error'
        return res.status(status).json({
            status: status,
            error: title,
            message: error.message
        })
    }
}

// essa função não precisa de autenticação
const handleGet = async (req, res) => {
    return res.status(200).json({})
}

// essa função usa o middleware withAuth para verificar se o usuário está autenticado
const handlePost = withAuth(async (req, res) => {
    const { title = null, description = null, contents = null, image = null, tags = [] } = req.body
    if (title === null) {
        var error = new Error('title é obrigatório.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }
    if (description === null) {
        var error = new Error('description é obrigatório.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }
    if (contents === null) {
        var error = new Error('contents é obrigatório.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }
    if (image === null) {
        image = 'http://mpmco.com/wp-content/uploads/2018/02/placeholder.jpg'
    }
    const uid = req.uid
    const article = await ArticleService.create(uid, title, description, contents, image, tags)
    return res.status(201).json(article)
})

const handleDelete = withAuth(async (req, res) => {
    const { id = null } = req.body
    if (id === null) {
        var error = new Error('id é obrigatório.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }
    const uid = req.uid
    await ArticleService.deleteOne(uid, id)
    return res.status(200).json()
})

export default handler