import { auth } from '../libs/firebase-admin'
// import connect from "../libs/database"
// import UserModel from '../models/user.model'
// import { UserModel } from '../libs/connection'

import UserModel from '../models/user.model'

const createUser = async (name, email, password, permission, photoURL, disabled) => {
    console.log('UserService.createUser()')
    // conecta ao banco de dados
    // await connect()
    const rawUser = await auth.createUser({ displayName: name, email, password, photoURL, disabled })
    // console.log(rawUser.uid)
    const user = {
        uid: rawUser.uid,
        name: rawUser.displayName,
        email,
        permission,
        photoURL: rawUser.photoURL,
        provider: rawUser.providerData[0].providerId,
        disabled: rawUser.disabled
    }
    // cria um novo usuário
    const userModel = new UserModel(user)
    // salva o usuário no banco de dados
    const newUser = await userModel.save()
    // retorna o novo usuário
    return newUser
}

const findOneByUid = async (uid) => {
    console.log('UserService.findUser()')
    // conecta ao banco de dados
    // await connect()
    // busca o usuário no banco de dados
    const user = await UserModel.findOne({ uid })
    // retorna o usuário
    return user
}

const findPermissionByUid = async (uid) => {
    console.log('UserService.findPermissionByUid()')
    // conecta ao banco de dados
    // await connect()
    // busca o usuário no banco de dados
    const doc = await UserModel.findOne({ uid }).select('-_id permission')
    if (!doc) {
        var error = new Error('Usuário Não Encontrado.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    // retorna a permissão do usuário
    return doc
}

const UserService = {
    createUser,
    findOneByUid,
    findPermissionByUid
}

export default UserService