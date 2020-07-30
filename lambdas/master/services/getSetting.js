exports.getconfig = function (serverId) {
    return new Promise(function (resolve, reject) {
        if (!serverId) resolve(false);
        const arquivosSettings = require("./settings.json")
        const server = arquivosSettings.filter(item => item.serverId == serverId)[0]
        if (!server){
            console.error("master getSetting getconfig server: ", server, " arquivosSettings ", arquivosSettings)
            resolve(false);
        }
        resolve(server);
    })
}