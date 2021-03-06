// import { NoteModel, FolderModel } from '../libs/connection'
import NoteModel from '../models/note.model'
import FolderModel from '../models/folder.model'
import FolderService from './folder.service'

const createOne = async (uid, contents, top, left, width, height, parent) => {
    const folderExists = await FolderModel.exists({ user_uid: uid, _id: parent })
    if (!folderExists) {
        let error = new Error('Pasta Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const model = new NoteModel({ contents, user_uid: uid, top, left, width, height, parent })
    const note = await model.save()
    return formatNote(note)
}

const findOne = async (uid, id) => {
    const note = await NoteModel.findOne({ user_uid: uid, _id: id })
    if (!note) {
        let error = new Error('Nota Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    return formatNote(note)
}

const findAll = async (uid, parent) => {
    const folderExists = await FolderModel.exists({ user_uid: uid, _id: parent })
    if (!folderExists) {
        let error = new Error('Pasta Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const notes = await NoteModel.find({ user_uid: uid, parent })
    if (!notes) {
        return []
    }
    return notes.map(note => formatNote(note))
}

const updateOne = async (uid, id, contents, top, left, parent) => {
    const noteExists = await NoteModel.exists({ user_uid: uid, _id: id })
    if (!noteExists) {
        let error = new Error('Nota Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    const update = {}
    if (contents) {
        update.contents = contents
    }
    if (top !== null && top !== undefined) {
        update.top = top
    }
    if (left !== null && left !== undefined) {
        update.left = left
    }
    if (parent !== null) {
        const parentExists = await FolderModel.exists({ user_uid: uid, _id: parent })
        if (!parentExists) {
            let error = new Error('Pasta Pai Não Encontrada.')
            error.status = 404
            error.title = 'Not Found'
            throw error
        }
        update.parent = parent
    }
    const note = await NoteModel.findOneAndUpdate({ user_uid: uid, _id: id }, update, { new: true })
    return formatNote(note)
}

const deleteOne = async (uid, id) => {
    const noteExists = await NoteModel.exists({ user_uid: uid, _id: id })
    if (!noteExists) {
        let error = new Error('Nota Não Encontrada.')
        error.status = 404
        error.title = 'Not Found'
        throw error
    }
    await NoteModel.deleteOne({ _id: id })
    // consulta a lixeira
    // const trash = await FolderService.findTrash(uid)
    // reparenta a nota para a lixeira
    // await NoteModel.findOneAndUpdate({ _id: id }, { parent: trash.id, top: 30, left: 10 }, { new: true })
}

const formatNote = (note) => {
    return {
        id: note._id,
        contents: note.contents,
        top: note.top,
        left: note.left,
        width: note.width,
        height: note.height,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        user_uid: note.user_uid,
        parent: note.parent
    }
}

const NoteService = {
    createOne,
    findOne,
    findAll,
    updateOne,
    deleteOne
}

export default NoteService