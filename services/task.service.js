// import connect from "../libs/database"
// import TaskModel from "../models/task.model"
import { TaskModel } from "../libs/connection"

const create = async (uid, text, top, left) => {
    console.log('TaskService.create()')
    // await connect()
    const task = {
        text,
        top,
        left,
        user_uid: uid
    }
    const taskModel = new TaskModel(task)
    const newTask = await taskModel.save()
    return {
        id: newTask._id,
        text: newTask.text,
        top: newTask.top,
        left: newTask.left
    }
}

const findAll = async (uid) => {
    console.log('TaskService.findAll()')
    // await connect()
    const tasks = await TaskModel.find({ user_uid: uid })
    return tasks.map(task => {
        return {
            id: task._id,
            text: task.text,
            top: task.top,
            left: task.left
        }
    })
}

const update = async (uid, id, text, top, left) => {
    console.log('TaskService.update()')
    // await connect()
    const task = await TaskModel.findOne({ _id: id, user_uid: uid })
    if (task) {
        if (text) {
            task.text = text
        }
        if (top) {
            task.top = top
        }
        if (left) {
            task.left = left
        }
        await task.save()
        return {
            id: task._id,
            text: task.text,
            top: task.top,
            left: task.left
        }
    }
    let error = new Error('Tarefa Não Encontrada.')
    error.status = 404
    error.title = 'Not Found'
    throw error
}

const deleteOne = async (uid, id) => {
    console.log('TaskService.delete()')
    // await connect()
    const task = await TaskModel.findOne({ _id: id, user_uid: uid })
    if (task) {
        await task.remove()
        return {
            id: task._id,
            text: task.text,
            top: task.top,
            left: task.left
        }
    }
    var error = new Error('Tarefa Não Encontrada.')
    error.status = 404
    error.title = 'Not Found'
    throw error
}

const TaskService = {
    create,
    findAll,
    update,
    deleteOne
}

export default TaskService