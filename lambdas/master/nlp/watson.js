const https = require('https')
var querystring = require('querystring')

exports.getToken = function (apikey) {
    return new Promise(function (resolve, reject) {

        if (!apikey) {
            console.error("NLP watson getToken", apikey)
            resolve(false)
        }

        var body = querystring.stringify({
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": apikey
        })

        let options = {
            hostname: 'iam.bluemix.net',
            path: '/identity/token',
            headers: {
                'Content-Type': 'x-www-form-urlencoded'
            },
            rejectUnauthorized: false
        }
        options.method = 'POST'

        const req = https.request(options, res => {
            var str = ''
            res.on('data', d => {
                str += d
            })
            res.on('end', () => {
                if (res.statusCode != 200) {
                    console.error('getToken request: ', str)
                    resolve(res.statusCode)
                } else {
                    let obj = JSON.parse(str)
                    resolve({
                        access_token: obj.access_token,
                        expiration: obj.expiration
                    })
                }
            })
        })
        req.write(body)
        req.end()
        req.on('error', function (e) {
            console.error("NLP watson getToken ", e)
            resolve(false)
        });
    })
}

exports.detectIntent = function (message, context, authorization, workspace, urlWatson) {
    return new Promise(function (resolve, reject) {

        if (!authorization || !workspace || !urlWatson) {
            console.error("NLP watson detectIntent ", authorization, workspace, urlWatson)
            resolve(false)
        }

        let body = {
            alternate_intents: true
        }
        if (message) {
            body.input = {
                text: message.replace(/\n/g, " ")
            }
        }
        if (context) {
            body.context = context
        }

        let options = {
            hostname: urlWatson,
            port: 443,
            path: '/assistant/api/v1/workspaces/' + workspace + '/message?version=2019-02-28&nodes_visited_details=true',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + authorization
            },
            rejectUnauthorized: false
        }
        options.method = 'POST'

        console.log("NLP request watson body: ", JSON.stringify(body))

        const req = https.request(options, (res) => {
            var str = ''
            res.on('data', d => {
                str += d
            })
            res.on('end', () => {
                if (res.statusCode != 200) {
                    console.error("NLP watson body statusCode: ", JSON.stringify(body))
                    console.error('assistant request: ', str)
                    resolve(res.statusCode)
                } else {
                    console.log("NLP watson str: ", str)

                    let data = JSON.parse(str)
                    let intents = ""
                    let titulo = "SEM TITULO"

                    if (data.intents && data.intents[0] && data.intents[0].intent) {
                        intents = data.intents[0].intent
                    }

                    if (data.output && data.output.nodes_visited_details && data.output.nodes_visited_details[0] && data.output.nodes_visited_details[0].title) {
                        titulo = data.output.nodes_visited_details[0].title.trim()
                    }

                    let messages = data.output.generic ? data.output.generic : ""

                    //adiciona novo tipo de conteudo
                    if (data.output.customized) {
                        messages = messages.concat(data.output.customized)
                    }

                    let retornoWatson = {
                        messages: messages,
                        context: data.context,
                        actions: data.actions,
                        intent: intents,
                        titulo: titulo,
                        dataHora: new Date().toLocaleString('en-us', {
                            timeZone: 'America/Sao_Paulo'
                        })
                    }

                    console.log("NLP watson retornoWatson: ", retornoWatson)

                    resolve(retornoWatson)
                }
            })
        })
        req.write(JSON.stringify(body))
        req.end()
        req.on('error', function (e) {
            console.error("NLP watson body e: ", JSON.stringify(body))
            console.error("NLP watson detectIntent ", e)
            resolve(false)
        });
    })
}