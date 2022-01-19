import mongoose from 'mongoose'
// tenho que adicionar a importação do Model para resolver o erro: Schema hasn't been registered for model "folder"
import FolderModel from './folder.model'

const Schema = mongoose.Schema

const NoteSchema = new Schema({
    contents: {
        type: String,
        default: ''
    },
    top: {
        type: Number,
        default: 0
    },
    left: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    parent: { type: Schema.Types.ObjectId, ref: 'folder' }
}, { versionKey: false, timestamps: true })

const NoteModel = mongoose.models.note || mongoose.model('note', NoteSchema)

export default NoteModel