import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FolderSchema = new Schema({
    name: {
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
    user_uid: {
        type: String
    },
    parent: { type: Schema.Types.ObjectId, ref: 'folder' }
}, { versionKey: false, timestamps: true })

const FolderModel = mongoose.models.folder || mongoose.model('folder', FolderSchema)

export default FolderModel