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
            default:
                return res.status(405).json({
                    status: 405,
                    error: 'Method Not Allowed',
                    message: 'Apenas o método GET é Permetido Nesse Endpoint.'
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
    console.log('/api/folder/trash-can GET')
    // consultar todas as pastas que podem ser usadas como pai para restaurar os itens da lixeira
    const foldersToRestore = await FolderService.findFoldersToRestore(req.uid)
    // consulta a lixeira
    const trash = await FolderService.findTrash(req.uid)
    // consulta a pasta home
    const home = await FolderService.findRoot(req.uid)
    // consulta todas as pastas excluídas
    const folders = await FolderService.findAll(req.uid, trash.id)
    // consulta as notas excluídas
    const notes = await NoteService.findAll(req.uid, trash.id)
    return res.status(200).json({ foldersToRestore, home, folders, notes })
})

export default handler