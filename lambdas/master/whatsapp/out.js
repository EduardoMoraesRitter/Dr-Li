let http = require('http')

exports.send = async (event) => {

    for (let msg of event.messages) {
        let body = {
            userId: event.userId,
        }
        if (msg.response_type == "text" && msg.text) {
            body.message = msg.text
        } else {
            body.message = msg.text
        }
        let retornoSendToWa = await sendToWa(event.URL, body)
        if(!retornoSendToWa){
            console.error("retornoSendToWa:", retornoSendToWa)
            return false
        }
    }
    return true
}

function sendToWa(URLWA, body) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {

            let options = {
                hostname: URLWA,
                port: 8000,
                path: '/sendMessage',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                encoding: "utf8",
                rejectUnauthorized: false
            }
            options.method = 'POST'
            
            const req = http.request(options, (res) => {
                var str = '';
                res.on('data', d => {
                    str += d
                })
                res.on('end', () => {
                    if (res.statusCode >= 300 || res.statusCode < 200) {
                        console.error("Callback inWhatsapp body end ", body)
                        console.error("Callback inWhatsapp sendToWa end ", str)
                        resolve(false)
                    } else {
                        resolve(JSON.parse(str))
                    }
                });
            })
            req.end(JSON.stringify(body))
            req.on('error', function (e) {
                console.error("Callback inWhatsapp body ", body)
                console.error("Callback inWhatsapp sendToWa ", e)
                resolve(false)
            });
        }, 300);        
    });
}