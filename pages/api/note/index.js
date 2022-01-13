import { withAuth } from "../../../middlewares/withAuth"
import NoteService from "../../../services/note.service"

const handler = async (req, res) => {
    try {
        switch (req.method) {
            case 'POST':
                return handlePost(req, res)
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

const handlePost = withAuth(async (req, res) => {
    console.log('/api/note POST')
    const { contents = '', top = 100, left = 100, width = 200, height = 400, parent = null } = req.body
    const note = await NoteService.createOne(req.uid, contents, top, left, width, height, parent)
    return res.status(201).json(note)
})

export default handler