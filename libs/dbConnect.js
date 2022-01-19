import mongoose from 'mongoose'

import { ThrowError } from './errors'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    ThrowError('Erro Interno do Servidor', 'Por favor, defina a variável de ambiente MONGODB_URI dentro de .env.local', 500)
}

// é necessário criar um cache para manter a conexão aberta durante o hot reload
// isso evita que as conexões cresçam exponencialmente
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxIdleTimeMS: 10000,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 20000,
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected')
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect