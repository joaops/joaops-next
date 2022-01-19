import dbConnect from "../../../libs/dbConnect"
import { withAuth } from "../../../middlewares/withAuth"
import TagService from "../../../services/tag.service"

const handler = async (req, res) => {
    try {
        await dbConnect()
        switch (req.method) {
            case 'POST':
                // withAuth(req, res)
                return handlePost(req, res)
            case 'GET':
                return handleGet(req, res)
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas o método POST é Permetido Nesse Endpoint.'
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

// é necessário um usuário logado para criar uma tag
const handlePost = withAuth(async (req, res) => {
    console.log('/api/tag POST')
    // console.log(req.uid)
    const { name = null } = req.body
    if (name === null) {
        var error = new Error('Nome é obrigatório.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }
    const tag = await TagService.create(name)
    return res.status(201).json(tag)
})

const handleGet = async (req, res) => {
    console.log('/api/tag GET')
    const tags = await TagService.findAll()
    return res.status(200).json(tags)
}

export default handler