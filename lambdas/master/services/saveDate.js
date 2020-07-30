exports.saveDash = function (objSetting, objBot, objUser) {
    return new Promise(function (resolve, reject) {

        if (!objSetting || !objBot || !objUser || !objUser.userId) {
            console.error("master saveDate sem parametro ", objSetting, objBot, objUser)
            resolve(false)
        }

        let objHistorico = []

        if (objBot.messages) {
            objBot.messages.forEach(element => {
                objHistorico.push({
                    "send": "bot",
                    "userId": objUser.userId,
                    "text": element.text || "",
                    "time": objBot.dataHora
                })
            });
        }

        if (objUser.message && objUser.context) {

            let interacao = objUser.context.interacao ? objUser.context.interacao : 0

            objHistorico.push({
                "send": "client",
                "userId": objUser.userId,
                "text": objUser.message,
                "time": objUser.dataHora,
                "intent": objBot.intent,
                "interacao": interacao,
                "titulo": objBot.titulo,
                "origem": interacao + " - " + objUser.context.titulo,
                "destino": interacao + 1 + " - " + objBot.titulo,
                "session": objUser.context.session ? objUser.context.session : "",
                "nome": objUser.context.nome
            })
        }

        let options = {
            hostname: 'api.powerbi.com',
            path: '/beta/' + objSetting.keyPowerBIbeta,
            headers: {
                'Content-Type': 'application/json'
            },
            rejectUnauthorized: false
        }
        options.method = 'POST'

        const req = global.https.request(options, (res) => {
            var str = '';
            res.on('data', d => {
                str += d
            })
            res.on('end', () => {
                if (res.statusCode != 200) {
                    console.error("master saveDate statusCode: ", res.statusCode)
                    console.error("master saveDate str: ", str)
                    console.error("master saveDate options: ", options)
                    console.error("master saveDate objHistorico: ", JSON.stringify(objHistorico))
                    resolve(false)
                } else {
                    console.log("master saveDate str: ", str)
                    resolve(true)
                }

            });
        })
        req.write(JSON.stringify(objHistorico))
        req.end()
        req.on('error', function (e) {
            console.error("master saveDate saveDash ", e)
            resolve(false)
        });
    })
}