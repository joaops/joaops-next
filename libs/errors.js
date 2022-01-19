export function ThrowError(title = 'Internal Server Error', message = 'Internal Server Error', status = 500) {
    const error = new Error(message)
    error.status = status
    error.title = title
    throw error
}
