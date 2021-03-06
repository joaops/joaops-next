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
            case 'POST':
                return handlePost(req, res)
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas os métodos GET e POST são Permetidos Nesse Endpoint.'
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

// Retornar a pasta raiz com suas subpastas e arquivos e o breadcrumb
const handleGet = withAuth(async (req, res) => {
    console.log('/api/folder GET')
    // console.log(req.uid)
    const folder = await FolderService.findRoot(req.uid)
    // consulta a lixeira
    const trash = await FolderService.findTrash(req.uid)
    // consulta as subpastas
    const subfolders = await FolderService.findAll(req.uid, folder.id)
    // consulta as notas
    const notes = await NoteService.findAll(req.uid, folder.id)
    // consulta o breadcrumb
    const breadcrumb = await FolderService.findBreadcrumb(req.uid, folder.id)
    return res.status(200).json({ folder, trash, subfolders, notes, breadcrumb })
})

const handlePost = withAuth(async (req, res) => {
    console.log('/api/folder POST')
    const { name = 'New Folder', top = 100, left = 100, parent = null } = req.body
    const folder = await FolderService.create(req.uid, name, top, left, parent)
    return res.status(201).json(folder)
})

export default handler