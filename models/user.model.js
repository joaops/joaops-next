import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
    },
    permission: {
        type: String,
    },
    photoURL: {
        type: String,
    },
    provider: {
        type: String,
    },
    disabled: {
        type: Boolean,
    },
}, { versionKey: false })

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)

export default UserModel