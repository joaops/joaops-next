import { withAuth } from '../../../middlewares/withAuth'
import TaskService from '../../../services/task.service'

const handler = async (req, res) => {
    try {
        console.log('/api/task')
        switch (req.method) {
            case 'GET':
                return handleGet(req, res)
            case 'PUT':
                return handlePut(req, res)
            case 'POST':
                return handlePost(req, res)
            case 'DELETE':
                return handleDelete(req, res)
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

const handleGet = async (req, res) => {
    const tasks = await TaskService.findAll(req.uid)
    return res.status(200).json(tasks)
}

const handlePut = async (req, res) => {
    const { id = null, text = null, top = null, left = null } = req.body
    if (id === null) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O id é obrigatório.'
        })
    }
    if (text === null && top === null && left === null) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'Deve ser informado pelo menos um dos campos: text, top, left.'
        })
    }
    const task = await TaskService.update(req.uid, id, text, top, left)
    return res.status(200).json(task)
}

const handlePost = async (req, res) => {
    const { text = null, top = null, left = null } = req.body
    if (text === null || top === null || left === null) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'Deve ser Informado um Texto, um Top e um Left.'
        })
    }
    const task = await TaskService.create(req.uid, text, top, left)
    return res.status(201).json(task)
}

const handleDelete = async (req, res) => {
    const { id = null } = req.body
    if (id === null) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'O id é obrigatório.'
        })
    }
    const task = await TaskService.deleteOne(req.uid, id)
    return res.status(200).json(task)
}

export default withAuth(handler)