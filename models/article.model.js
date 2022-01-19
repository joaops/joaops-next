import mongoose from 'mongoose'
// tenho que adicionar a importação do Model para resolver o erro: Schema hasn't been registered for model "tag"
import TagModel from './tag.model'

const Schema = mongoose.Schema

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
// Pois o uid do firebase tinha tamanho de 28 caracteres e o MongoDB só aceita tamanho de 24 para a chave primária
ArticleSchema.virtual('user', {
    ref: 'user',
    foreignField: 'uid',
    localField: 'user_uid',
    justOne: true
})

const ArticleModel = mongoose.models.article || mongoose.model('article', ArticleSchema)

export default ArticleModel