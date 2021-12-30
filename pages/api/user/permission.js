import { withAuth } from '../../../middlewares/withAuth'
import UserService from '../../../services/user.service'

const handler = async (req, res) => {
    console.log('/api/user/permission')
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
}

export default withAuth(handler)