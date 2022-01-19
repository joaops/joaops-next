import dbConnect from "../../../libs/dbConnect"
import { withAuth } from "../../../middlewares/withAuth"
import FolderService from "../../../services/folder.service"
import NoteService from "../../../services/note.service"

const handler = async (req, res) => {
    try {
        await dbConnect()
        switch (req.method) {
            case 'GET':
                return handleGet(req, res)
            case 'PUT':
                return handlePut(req, res)
            case 'DELETE':
                return handleDelete(req, res)
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas os métodos GET, PUT e DELETE são Permetidos Nesse Endpoint.'
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

// Retornar uma pasta com suas subpastas e arquivos e o breadcrumb
const handleGet = withAuth(async (req, res) => {
    console.log('/api/folder/:id GET')
    const { id } = req.query
    if (!id) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O ID da pasta é obrigatório.'
        })
    }
    // console.log(req.uid)
    const folder = await FolderService.findOne(req.uid, id)
    // consultar as notas
    const notes = await NoteService.findAll(req.uid, folder.id)
    // consultar as subpastas
    const subfolders = await FolderService.findAll(req.uid, folder.id)
    // consultar o breadcrumb
    const breadcrumb = await FolderService.findBreadcrumb(req.uid, folder.id)
    return res.status(200).json({ folder, subfolders, notes, breadcrumb })
})

const handlePut = withAuth(async (req, res) => {
    console.log('/api/folder/:id PUT')
    const { id } = req.query
    const { name = null, top = null, left = null } = req.body
    if (!id) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O ID da pasta é obrigatório.'
        })
    }
    if (name === null && top === null && left === null) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'Deve ser informado pelo menos um dos campos: name, top, left.'
        })
    }
    const folder = await FolderService.updateOne(req.uid, id, name, top, left)
    return res.status(200).json(folder)
})

const handleDelete = withAuth(async (req, res) => {
    console.log('/api/folder/:id DELETE')
    const { id } = req.query
    if (!id) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O ID da pasta é obrigatório.'
        })
    }
    await FolderService.deleteOne(req.uid, id)
    return res.status(200).json({})
})

export default handler