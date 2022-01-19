// import connect from "../libs/database"
// import TagModel from "../models/tag.model"
// import { TagModel } from "../libs/connection"

import TagModel from "../models/tag.model"

const create = async (name) => {
    console.log('TagService.create()')
    // await connect()
    const tag = {
        name
    }
    const tagModel = new TagModel(tag)
    const newTag = await tagModel.save()
    return {
        id: newTag._id,
        name: newTag.name
    }
}

const findAll = async () => {
    console.log('TagService.findAll()')
    // await connect()
    const tags = await TagModel.find()
    return tags.map(tag => {
        return {
            id: tag._id,
            name: tag.name
        }
    })
}

const TagService = {
    create,
    findAll
}

export default TagService