// import { withAuth } from "../../../middlewares/withAuth"
import dbConnect from "../../../libs/dbConnect"
import ArticleService from "../../../services/article.service"

const handler = async (req, res) => {
    try {
        await dbConnect()
        switch (req.method) {
            case 'GET':
                return handleGet(req, res)
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas os métodos GET, POST são Permetidos Nesse Endpoint.'
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

const handleGet = async (req, res) => {
    console.log('/api/article/:slug GET')
    const { slug } = req.query
    const article = await ArticleService.getOneBySlug(slug)
    return res.status(200).json(article)
}

export default handler