async function ivocation(functionName, payload) {
    return new Promise(function (resolve, reject) {
        lambda.invoke({
            FunctionName: functionName,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify(payload)
        }, function (err, data) {
            if (err) {
                console.error("ivocation erro: ", err);
            } else {
                console.log("ivocation data:", data);
                resolve(JSON.parse(data.Payload));
            }
        })
    });
}

exports.setSchedule = function (parameters, context, config) {
    return new Promise(function (resolve, reject) {

        let retorno = {
            events: {},
            context: {}
        }

        if (!parameters.dataHora || !parameters.Arn || !parameters.messages || !context.telefone) {
            console.error("sem parameters:", parameters)
            console.error("sem context:", context)
            console.error("sem config:", config)
            return false
        }

        //TODO:voltar aqui
        let userId = context.telefone
        let FunctionName = 'API'

        //verificar a data menor q a atual
        parameters.dataHora

        console.log("dataHoradataHoradataHoradataHoradataHora: ", parameters.dataHora)

        let minuto = parameters.dataHora.slice(14, 16);
        let hora = parseInt(parameters.dataHora.slice(11, 13));

        let dia = parameters.dataHora.slice(8, 10);
        let mes = parameters.dataHora.slice(5, 7);
        let ano = parameters.dataHora.slice(0, 4);

        //por conta do fuso horario
        let diferenca = 3
        if (hora > (23 - diferenca)) {
            dia = dia + 1
            hora = (hora + diferenca) - 23
        } else {
            hora = hora + diferenca
        }

        var NameRule = userId + '' + minuto + '' + hora + '' + dia + '' + mes + '' + ano

        console.log("NameRule: ", NameRule)

        var params = {
            Name: NameRule,
            Description: "enviar " + parameters.dataHora + " para " + userId + " o que " + parameters.template,
            ScheduleExpression: 'cron(' + minuto + ' ' + hora + ' ' + dia + ' ' + mes + ' ? ' + ano + ')',
            //ScheduleExpression: 'cron(23 20 6 11 ? 2019)',
            State: "ENABLED"
        };
        global.cwevents.putRule(params, function (err, data) {
            if (err) {
                console.error("Error", err);
            } else {
                console.log("sucesso putRule data: ", data)

                var lambdaParams = {
                    Action: "lambda:InvokeFunction",
                    FunctionName: FunctionName,
                    Principal: "events.amazonaws.com",
                    SourceArn: data.RuleArn,
                    StatementId: NameRule
                };
                lambda.addPermission(lambdaParams, function (err, data) {
                    if (err) {
                        console.error("addPermission err:", err);
                        console.error("addPermission err.stack:", err.stack);
                    } else {
                        //return data;
                        console.log("success addPermission data: ", data)
                        // successful response

                        var targetParams = {
                            Rule: NameRule, //name of the CloudWatch rule
                            Targets: [{
                                Arn: parameters.Arn,//'arn:aws:lambda:us-east-1:767577533190:function:API',
                                Id: FunctionName,
                                Input: JSON.stringify({
                                    api: {
                                        name: "notification",
                                        parameters: {
                                            FunctionName: FunctionName,
                                            NameRule: NameRule,
                                            userId: userId,
                                            messages: parameters.messages,
                                            contexto: parameters.contexto
                                        }
                                    },
                                    context: context,
                                    config: config
                                })
                            }]
                        };

                        global.cwevents.putTargets(targetParams, function (err, data) {
                            if (err) {
                                console.error("Error", err);
                            } else {
                                console.log("success putTargets data: ", data)

                                console.log("OKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", retorno)
                                resolve(retorno)
                                //context("Success ", "FunctionName:", FunctionName, "NameRule:", NameRule, data);
                            }
                        });
                    }
                });
            }
        })
    });
}

exports.removeSchedule = function (parameters, context, config) {
    return new Promise(async function (resolve, reject) {

        if (!parameters.NameRule || !parameters.FunctionName) {
            console.error("removeSchedule sem parameters:", parameters)
        }
        //deleta o schedule
        var params = {
            Ids: [ /* required */
                parameters.FunctionName,
            ],
            Rule: parameters.NameRule,
            /* required true || false*/
            Force: false
        };
        global.cwevents.removeTargets(params, function (err, data) {
            if (err) console.error("ERRO removeTargets ", err, err.stack); // an error occurred
            else {
                console.log("removeTargets sucesso")
                var params = {
                    Name: parameters.NameRule,
                    /* required */
                    Force: false
                };
                global.cwevents.deleteRule(params, function (err, data) {
                    if (err) console.error("ERRO deleteRule ", err, err.stack); // an error occurred
                    else {
                        console.log("deleteRule sucesso")
                        resolve(data)
                    }
                });
            }
        });
    })
}

exports.notification = function (parameters, context, config) {
    return new Promise(async function (resolve, reject) {

        console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN parameters: ", parameters)

        context.contexto = parameters.contexto
        delete context.system

        await ivocation("data", {
            methods: "update",
            userId: parameters.userId,
            context: context,
            table: config.table
        });

        let objSendCallback = {
            URL: config.channel.URL,
            userId: parameters.userId,
            Authorization: config.channel.Authorization,
            recipient_type: context.recipient_type,
            serverId: config.serverId,
            messages: parameters.messages,
            preview_url: context.preview_url ? context.preview_url : false,
            namespace: config.channel.namespace
        }
        let retornoCallback = await ivocation("sendClient", objSendCallback);

        console.log(retornoCallback)
    })
}