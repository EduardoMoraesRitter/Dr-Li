let aws = require('aws-sdk')
aws.config.region = 'us-east-1';

let documentClient = new aws.DynamoDB.DocumentClient();

exports.getContext = function (userId, table) {
    return new Promise(function (resolve, reject) {
        if (!userId || !table) {
            console.error("data document getContext ", userId, table)
            resolve(false)
        } else {
            var params = {
                Key: {
                    "userId": userId
                },
                TableName: table
            };
            documentClient.get(params, function (err, data) {
                if (err) {
                    console.error("data document getcontext erro ", err);
                    console.error("data document getcontext params ", params);
                    resolve(false)
                } else {
                    console.log("data document getcontext: ", data)
                    resolve(data)
                }
            });
        }
    })
}

exports.putContext = function (userId, context, table) {
    return new Promise(function (resolve, reject) {
        if (!userId || !context || !table) {
            console.error("data document putContext ", userId, context, table)
            resolve(false)
        } else {
            var params = {
                Item: {
                    "userId": userId,
                    "context": context,
                    "data": new Date().toLocaleString('en-us', {
                        timeZone: 'America/Sao_Paulo'
                    })
                },
                TableName: table
            };
            console.log("data document putcontext: ", params)
            documentClient.put(params, function (err, data) {
                if (err) {
                    console.error("data document putcontext erro ", err);
                    console.error("data document putcontext params ", params);
                    resolve(false)
                } else {
                    resolve(params)
                }
            })
        }
    })
}

exports.updateContext = function (userId, context, table) {
    return new Promise(function (resolve, reject) {
        if (!userId || !context || !table) {
            console.error("data document updateContext ", userId, context, table)
            resolve(false)
        } else {
            var params = {
                Key: {
                    "userId": userId
                },
                UpdateExpression: "set #context = :context, #data = :data",
                ExpressionAttributeNames: {
                    "#context": "context",
                    "#data": "data",
                },
                ExpressionAttributeValues: {
                    ":context": context,
                    ":data": new Date().toLocaleString('en-us', {
                        timeZone: 'America/Sao_Paulo'
                    })
                },
                ReturnValues: 'UPDATED_NEW',
                TableName: table
            };
            console.log('data document updatecontext : ', JSON.stringify(params))
            documentClient.update(params, function (err, data) {
                if (err) {
                    console.error("data document updatecontext params ", params);
                    console.error("data document updatecontext erro ", err);
                    resolve(false)
                } else {
                    resolve(data)
                }
            });
        }
    })
};

exports.All = function () {
    return new Promise(function (resolve, reject) {
        var params = {
            TableName: 'dados'
        };
        documentClient.scan(params, function (err, data) {
            if (err) {
                console.error("data document getcontext erro ", err);
                console.error("data document getcontext params ", params);
                resolve(false)
            } else {
                console.log("data document getcontext: ", data)
                resolve(data.Items)
            }
        });
    })
}

exports.inserir = function (telefone, dados) {
    return new Promise(function (resolve, reject) {

        let table = "dados"

        var params = {
            Key: {
                "telefone": telefone
            },
            TableName: table
        };
        documentClient.get(params, function (err, data) {
            if (err) {
                console.error("data inserir getcontext erro ", err);
                console.error("data inserir getcontext params ", params);
                resolve(false)
            } else {
                console.log("data inserir getcontext: ", data)
                resolve(data)


                console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:", dados)

                if(data.Item){
                    dados = Object.assign(data.Item, dados);
                }




                var params = {
                    TableName: table
                }

                params.Item = dados

                params.Item.telefone = telefone,
                    params.Item.data = new Date().toLocaleString('pt-br', {
                        timeZone: 'America/Sao_Paulo'
                    })

                console.log("data inserir putcontext: ", params)
                documentClient.put(params, function (err, data) {
                    if (err) {
                        console.error("data document putcontext erro ", err);
                        console.error("data document putcontext params ", params);
                        resolve(false)
                    } else {
                        resolve(params)
                    }
                })



            }
        })
    })

}