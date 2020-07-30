let watson = require('./watson')
function getEnv(serverId) {
    return new Promise(function (resolve, reject) {

        if (!process.env.configEnv) resolve(false)
        let configEnv = JSON.parse(process.env.configEnv)

        //converte o config json e filtra
        let config = configEnv.filter(x => x.serverId == serverId)[0]

        if (!config || !config.expiration || !config.access_token || config.access_token == "" || config.expiration == "") {
            resolve(false)
        }

        //verifica se retorno na lista
        if (Date.now().toString().substring(0, 10) < config.expiration) {
            resolve({
                access_token: config.access_token,
                expiration: config.expiration
            })
        } else {
            resolve(false)
        }
    })
}

function saveConfig(expiration, access_token, serverId) {
    return new Promise(function (resolve, reject) {
        if (process.env.configEnv) {

            let configEnv = JSON.parse(process.env.configEnv)
            let config = configEnv.filter(x => x.serverId == serverId)[0]

            if (!config) config = {}

            config.expiration = expiration
            config.access_token = access_token

            process.env.configEnv = JSON.stringify(configEnv)
        } else {
            process.env.configEnv = JSON.stringify([{
                "serverId": serverId,
                "expiration": expiration,
                "access_token": access_token
            }])
        }
        resolve(true)
    })
}

//exports.handler = async (event) => {
exports.index = async function (event) {

    console.log("NLP event: ", JSON.stringify(event))

    if (!event || !event.serverId || !event.workspace || !event.apikey || (!event.message && !event.context)) {
        console.error("NLP watson ERRO no event sem parametros: serverId, workspace, apikey, message, context ", event)
        return "ERRO no event sem parametros: serverId, workspace, apikey, message, context"
    }

    let retornoConfig = await getEnv(event.serverId)

    //se tiver o env
    if (!retornoConfig || !retornoConfig.expiration || !retornoConfig.access_token) {
        retornoConfig = await watson.getToken(event.apikey)
        if (!retornoConfig || !retornoConfig.expiration || !retornoConfig.access_token) {
            console.error("NLP watson getToken ", retornoConfig, event.apikey)
            return "ERRO TOKEN"
        }

        await saveConfig(retornoConfig.expiration, retornoConfig.access_token, event.serverId)
    }
    let retornoDetectIntent = await watson.detectIntent(event.message, event.context, retornoConfig.access_token, event.workspace, event.urlWatson)

    if (!retornoDetectIntent || retornoDetectIntent == false) {
        console.error("NLP watson detectIntent ", retornoDetectIntent, event)
        return "ERRO detectIntent"
    }

    return retornoDetectIntent
}