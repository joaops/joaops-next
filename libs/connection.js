import mongoose from 'mongoose'

// readystate 0 === disconnected, 1 === connected, 2 === connecting, 3 === disconnecting
if (mongoose.connection.readyState === 0) {
    console.log("Connecting to database...")
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log("Connected to database.")
    }, (err) => {
        console.log(err)
    })
}

console.log('Mongoose Connections Length:', mongoose.connections.length)

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

const TaskSchema = new Schema({
    text: {
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
        type: String,
        ref: 'user.uid'
    }
}, { versionKey: false })

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

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Informe a Descrição.']
    },
    contents: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }],
    user_uid: {
        type: String
        // ref: 'user.uid'
    }
}, { versionKey: false, timestamps: true })

// Estou usando uma propriedade virtual para conseguir popular os dados do usuário usando o uid
// Faço isso pois eu não usei o uid do firebase como chave primária na tabela do usuário
// Pois o uid tinha tamanho de 28 caracteres e o MongoDB só aceita tamanho de 24 para a chave primária
ArticleSchema.virtual('user', {
    ref: 'user',
    foreignField: 'uid',
    localField: 'user_uid',
    justOne: true
})

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

// export const connection = mongoose
export const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)
export const TaskModel = mongoose.models.task || mongoose.model('task', TaskSchema)
export const TagModel = mongoose.models.tag || mongoose.model('tag', TagSchema)
export const ArticleModel = mongoose.models.article || mongoose.model('article', ArticleSchema)
export const FolderModel = mongoose.models.folder || mongoose.model('folder', FolderSchema)
export const NoteModel = mongoose.models.note || mongoose.model('note', NoteSchema)