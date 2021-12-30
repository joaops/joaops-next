import { auth } from '../libs/firebase-admin'

export function withAuth(handler) {
    return async (req, res) => {
        const authorization = req.headers.authorization
        if (!authorization) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Credencial de Autenticação Inválida.'
            })
        }
        const token = authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Credencial de Autenticação Inválida.'
            })
        }
        try {
            const decodedToken = await auth.verifyIdToken(token)
            if (!decodedToken || !decodedToken.uid) {
                return res.status(401).json({
                    status: 401,
                    error: 'Unauthorized',
                    message: 'Credencial de Autenticação Inválida.'
                })
            }
            req.uid = decodedToken.uid
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: 'Internal Server Error',
                message: error.message
            })
        }
        return handler(req, res)
    }
}