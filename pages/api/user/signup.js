import UserService from "../../../services/user.service"

const handler = async (req, res) => {
    switch (req.method) {
        case 'POST':
            return await handlePost(req, res)
        default:
            return res.status(405).json({
                status: 405,
                error: 'Method Not Allowed',
                message: 'Apenas o método POST é Permetido Nesse Endpoint.'
            })
    }
}

const handlePost = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: 'Deve ser Informado um Nome, um endereço de E-mail e uma Senha.'
        })
    }
    const permission = (email === process.env.EMAIL_ADMIN) ? 'admin' : 'user'
    const photoURL = 'https://uploads.disquscdn.com/images/acd62c6fdaf5dbdda6a0141695dd9a2b34ff3c23d6c4828e69a738861fa72a83.png'
    const disabled = false
    const user = await UserService.createUser(name, email, password, permission, photoURL, disabled)
    // console.log(user)
    return res.status(201).json(user)
}

export default handler