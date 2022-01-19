import dbConnect from '../../../libs/dbConnect'
import { withAuth } from '../../../middlewares/withAuth'
import UserService from '../../../services/user.service'

const handler = async (req, res) => {
    try {
        console.log('/api/user/permission GET')
        await dbConnect()
        // consultar no banco de dados o usuário usando o uid
        const permission = await UserService.findPermissionByUid(req.uid)
        if (permission) {
            return res.status(200).json(permission)
        } else {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Credencial de Autenticação Inválida.'
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

export default withAuth(handler)