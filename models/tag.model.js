import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    }
}, { versionKey: false })

const TagModel = mongoose.models.tag || mongoose.model('tag', TagSchema)

export default TagModel