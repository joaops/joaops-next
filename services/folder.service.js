// import { FolderModel, NoteModel } from '../libs/connection'
import FolderModel from '../models/folder.model'
import NoteModel from '../models/note.model'

// Retorna a pasta Raiz ou Cria uma nova
const findRoot = async (uid) => {
    let root = await FolderModel.findOne({ user_uid: uid, parent: null })
    if (root) {
        return formatFolder(root)
    }
    const model = new FolderModel({ name: 'Home', user_uid: uid, parent: null })
    root = await model.save()
    return formatFolder(root)
}

// Retorna a Lixeira ou Cria uma nova
const findTrash = async (user_uid) => {
    // a lixeira é uma pasta que não tem pai e que se chama Lixeira
    let trash = await FolderModel.findOne({ user_uid, parent: null, name: 'Lixeira' })
    if (trash) {
        return formatFolder(trash)
    }
    const model = new FolderModel({ name: 'Lixeira', user_uid, parent: null })
    trash = await model.save()
    return formatFolder(trash)
}

// Retorna uma pasta
const findOne = async (uid, id) => {
    const folderExists = await FolderModel.exists({ user_uid: uid, _id: id })
    if (!folderExists) {
        let error = new Error('Pasta Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const folder = await FolderModel.findOne({ user_uid: uid, _id: id })
    return formatFolder(folder)
}

// Retorna todas as subpastas de uma pasta
const findAll = async (uid, parent) => {
    const rootExists = await FolderModel.exists({ user_uid: uid, _id: parent })
    if (!rootExists) {
        let error = new Error('Pasta Raiz Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const folders = await FolderModel.find({ user_uid: uid, parent })
    if (!folders) {
        return []
    }
    return folders.map(folder => {
        return formatFolder(folder)
    })
}

const create = async (uid, name, top, left, parent) => {
    const rootExists = await FolderModel.exists({ user_uid: uid, _id: parent })
    if (!rootExists) {
        let error = new Error('Pasta Raiz Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const model = new FolderModel({ name, user_uid: uid, top, left, parent })
    const folder = await model.save()
    return formatFolder(folder)
}

const updateOne = async (uid, id, name, top, left, parent) => {
    const folderExists = await FolderModel.exists({ user_uid: uid, _id: id })
    if (!folderExists) {
        let error = new Error('Pasta Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const update = {}
    if (name) {
        update.name = name
    }
    if (top !== null && top !== undefined) {
        update.top = top
    }
    if (left !== null && left !== undefined) {
        update.left = left
    }
    if (parent !== null) {
        if (id === parent) {
            let error = new Error('A Pasta Não Pode Ser Pai Dela Mesma.')
            error.status = 400
            error.title = 'Bad Request'
            throw error
        }
        const parentExists = await FolderModel.exists({ user_uid: uid, _id: parent })
        if (!parentExists) {
            let error = new Error('Pasta Pai Não Encontrada.')
            error.status = 404
            error.title = 'Not Found'
            throw error
        }
        update.parent = parent
    }
    const folder = await FolderModel.findOneAndUpdate({ user_uid: uid, _id: id }, update, { new: true })
    return formatFolder(folder)
}

const deleteOne = async (uid, id) => {
    // verifica se a pasta existe e se ela não é a pasta raiz e nem a lixeira
    const folderExists = await FolderModel.exists({ user_uid: uid, _id: id, parent: { $ne: null } })
    if (!folderExists) {
        let error = new Error('Pasta Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    // se não é o diretório raiz e nem a lixeira
    /*const isHomeOrTrashCan = await FolderModel.exists({ _id: id, parent: null })
    if (isHomeOrTrashCan) {
        let error = new Error('Não é possível excluir o diretório raiz ou a lixeira.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }*/
    // pega a lixeira
    // const trashCan = await findTrash(uid)
    // reparenta a pasta para a lixeira
    // await FolderModel.findOneAndUpdate({ user_uid: uid, _id: id }, { parent: trashCan.id, top: 30, left: 10 }, { new: true })
    // deleta todos os arquivos da pasta
    await NoteModel.deleteMany({ parent: id })
    // pega todos os id's das subpastas
    const folders_id = await FolderModel.find({ parent: id }).select('_id')
    // chama essa função de forma recursiva para deletar todas as subpastas
    for (const folder_id of folders_id) {
        await deleteOne(uid, folder_id)
    }
    // por fim exclui a pasta
    await FolderModel.deleteOne({ _id: id })
}

// TODO: Optimizar a busca do breadcrumb, talvez criar o breadcrumb no momento da criação da pasta
const findBreadcrumb = async (uid, id) => {
    let next_id = id
    let breadcrumb = []
    do {
        let folder = await FolderModel.findOne({ user_uid: uid, _id: next_id }).select('_id name parent')
        breadcrumb.unshift({ id: folder._id, name: folder.name })
        next_id = folder.parent
    } while (next_id)
    return breadcrumb
}

const formatFolder = (folder) => {
    return {
        id: folder._id,
        name: folder.name,
        top: folder.top,
        left: folder.left,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        user_uid: folder.user_uid,
        parent: folder.parent
    }
}

const FolderService = {
    findRoot,
    findTrash,
    findOne,
    findAll,
    create,
    updateOne,
    deleteOne,
    findBreadcrumb
}

export default FolderService