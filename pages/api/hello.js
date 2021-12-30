import UserService from "../../services/user.service"

const handler = async (req, res) => {
    try {
        const uid = req?.query?.uid
        if (uid) {
            const user = await UserService.findPermissionByUid(uid)
            return res.status(200).json(user)
        }
        res.status(404).json({
            status: 404,
            error: 'Not Found',
            message: 'Usuário Não Encontrado.'
        })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({
            status,
            error: error.title,
            message: error.message
        })
    }
}

export default handler