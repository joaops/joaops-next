import { withAuth } from "../../../middlewares/withAuth"
import NoteService from "../../../services/note.service"

const handler = async (req, res) => {
    try {
        switch (req.method) {
            case 'PUT':
                return handlePut(req, res)
            case 'DELETE':
                return handleDelete(req, res)
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas os métodos PUT e DELETE são Permetidos Nesse Endpoint.'
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

const handlePut = withAuth(async (req, res) => {
    console.log('/api/note/:id PUT')
    const { id } = req.query
    const { contents = null, top = null, left = null } = req.body
    if (!id) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O ID da pasta é obrigatório.'
        })
    }
    if (contents === null && top === null && left === null) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'Deve ser informado pelo menos um dos campos: contents, top, left.'
        })
    }
    const note = await NoteService.updateOne(req.uid, id, contents, top, left)
    return res.status(200).json(note)
})

const handleDelete = withAuth(async (req, res) => {
    console.log('/api/note/:id DELETE')
    const { id } = req.query
    if (!id) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O ID da nota é obrigatório.'
        })
    }
    await NoteService.deleteOne(req.uid, id)
    return res.status(200).json({})
})

export default handler