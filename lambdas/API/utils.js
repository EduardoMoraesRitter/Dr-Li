const https = require('https');

function httpsRequest(hostname, path, method, headers, body = {}) {
    return new Promise(function (resolve, reject) {
        const options = {
            hostname: hostname,
            path: path,
            method: method,
            headers: headers,
            rejectUnauthorized: false
        }
        const req = https.request(options, (res) => {
            var str = '';
            res.on('data', d => {
                str += d
            })
            res.on('end', () => {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    console.error("API utils res.statusCode: ", res.statusCode)
                    console.error("API utils httpsRequest: ", str)
                    console.error("API utils options: ", options)
                    console.error("API utils body: ", JSON.stringify(body))
                    resolve(res.statusCode)
                } else if (res.statusCode != 200) {
                    console.warn("API utils res.statusCode: ", res.statusCode)
                    console.warn("API utils httpsRequest: ", str)
                    console.warn("API utils options: ", options)
                    console.warn("API utils body: ", JSON.stringify(body))
                    resolve(res.statusCode)
                } else {
                    console.log("API utils request: ", path)
                    resolve(str)
                }
            })
        })
        req.write(JSON.stringify(body))
        req.end()
        req.on('error', function (e) {
            console.error("API utils httpsRequest: ", e)
            resolve(0)
        });
    })
}

module.exports = {
    httpsRequest
}