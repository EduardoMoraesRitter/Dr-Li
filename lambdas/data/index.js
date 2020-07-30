const document = require("./model");
exports.handler = async (event, context, callback) => {

    if (!event.methods) {
        console.error("Repository index ", event)
        return false
    }

    if (event.methods == 'getAll') {
        return await document.All(event.userId, event.table)
    }

    if (event.methods == 'inserir') {
        return await document.inserir(event.telefone, event.dados)
    }

    if (event.methods == 'get') {
        return await document.getContext(event.userId, event.table)
    }
    if (event.methods == 'put') {
        return await document.putContext(event.userId, event.context, event.table)
    }
    if (event.methods == 'update') {
        for (let key in event.context) {
            if (event.context[key] === "" || event.context[key] === " ")
                delete event.context[key]
        }
        return await document.updateContext(event.userId, event.context, event.table)
    }
}