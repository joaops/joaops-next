import { FolderModel, NoteModel } from '../libs/connection'

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

const updateOne = async (uid, id, name, top, left) => {
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
    const folder = await FolderModel.findOneAndUpdate({ user_uid: uid, _id: id }, update, { new: true })
    return formatFolder(folder)
}

const deleteOne = async (uid, id) => {
    const folderExists = await FolderModel.exists({ user_uid: uid, _id: id })
    if (!folderExists) {
        let error = new Error('Pasta Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    // se não é o diretório raiz
    const isHome = await FolderModel.exists({ _id: id, parent: null })
    if (isHome) {
        let error = new Error('Não é possível excluir o diretório raiz.')
        error.status = 400
        error.title = 'Bad Request'
        throw error
    }
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
    findOne,
    findAll,
    create,
    updateOne,
    deleteOne,
    findBreadcrumb
}

export default FolderService