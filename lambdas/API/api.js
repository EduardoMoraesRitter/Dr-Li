async function cepParaLatude(cep) {
    return new Promise(async function (resolve, reject) {

        //https://maps.googleapis.com/maps/api/geocode/json?address=08230010&key=AIzaSyC6jqvnHByyO0r-KEOpyeU6LMsCNDkQMVQ&language=pt-BR
        let retornoResquest = await global.utils.httpsRequest(
            'maps.googleapis.com',
            '/maps/api/geocode/json?address=' + cep + '&key=AIzaSyC6jqvnHByyO0r-KEOpyeU6LMsCNDkQMVQ&language=pt-BR',
            'POST', {
            'Content-Type': 'application/json'
        });

        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA, cep:", retornoResquest)

        if (retornoResquest >= 300 || retornoResquest < 200) {
            console.error("API salvaTopico erro status: ", retornoResquest)
            resolve(false)
        } else {
            let data = JSON.parse(retornoResquest)
            if (data.results && data.results.length == 0) {
                console.error("API salvaTopico erro: ", retornoResquest)
                resolve(false)
            } else {
                data = data.results[0]
                cep = data.address_components[0].long_name.replace('-', '')

                if (data.address_components[1].types[0] == "route") {//"types" : [ "route" ]
                    bairro = data.address_components[2].long_name
                    cidade = data.address_components[3].long_name
                    estado = data.address_components[4].long_name
                    uf = data.address_components[4].short_name
                    pais = data.address_components[5].long_name
                    pais_sigla = data.address_components[5].short_name
                } else {
                    bairro = data.address_components[1].long_name
                    cidade = data.address_components[2].long_name
                    estado = data.address_components[3].long_name
                    uf = data.address_components[3].short_name
                    pais = data.address_components[4].long_name
                    pais_sigla = data.address_components[4].short_name
                }

                lat = data.geometry.location.lat
                lng = data.geometry.location.lng

                let retorno = {
                    cep: cep,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado,
                    uf: uf,
                    pais: pais,
                    pais_sigla: pais_sigla,
                    lat: lat,
                    lng: lng,
                }
                console.log("BBBBBBBBBBBBBBBBBBBBBB ", retorno)
                resolve(retorno)
            }
        }
    })
}

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

exports.a = function (parameters, context, config) {
    return new Promise(async function (resolve, reject) {

        // if (!parameters.CEP) {
        //     await b(parameters.caseId, parameters.title.replace(/_/g, ""), parameters.description, config.API.APIM_API_URL, config.API.APIM_API_KEY)
        // }

        let retorno = {
            events: {},
            context: {}
        }

        //https://maps.googleapis.com/maps/api/geocode/json?address=08230010&key=AIzaSyC6jqvnHByyO0r-KEOpyeU6LMsCNDkQMVQ&language=pt-BR
        let retornoResquest = await global.utils.httpsRequest('maps.googleapis.com',
            '/maps/api/geocode/json?address=' + parameters.CEP + '&key=AIzaSyC6jqvnHByyO0r-KEOpyeU6LMsCNDkQMVQ&language=pt-BR',
            'GET', {
            'Content-Type': 'application/json'
        });

        if (retornoResquest >= 300 || retornoResquest < 200) {
            retorno.events = {
                "contexto": "erro_consulta_cep"
            };
        } else {
            let data = JSON.parse(retornoResquest)

        }
        resolve(retorno)
    })
}

exports.salvaDados = function (parameters, context, config) {
    return new Promise(async function (resolve, reject) {

        let retorno = {
            events: {},
            context: {}
        }

        console.log("PARAMETROS: ", parameters)

        if (parameters.cep) {
            let returnocepParaLatude = await cepParaLatude(parameters.cep)
            parameters.dados = returnocepParaLatude
        }

        await ivocation("data", {
            methods: "inserir",
            telefone: context.telefone,
            dados: parameters.dados
        });

        resolve(retorno)
    })
}

exports.som = function (parameters, context, config) {
    return new Promise(async function (resolve, reject) {

        // if (!parameters.CEP) {
        //     await b(parameters.caseId, parameters.title.replace(/_/g, ""), parameters.description, config.API.APIM_API_URL, config.API.APIM_API_KEY)
        // }

        let retorno = {
            events : {
                "contexto": "sem_resultado"
            },
            context: {}
        }

        //https://maps.googleapis.com/maps/api/geocode/json?address=08230010&key=AIzaSyC6jqvnHByyO0r-KEOpyeU6LMsCNDkQMVQ&language=pt-BR
        let retornoResquest = await global.utils.httpsRequest('fba999a87083.ngrok.io',
            '/?media=' + parameters.voice,
            'GET', {
            'Content-Type': 'application/json'
        });

        if (retornoResquest >= 300 || retornoResquest < 200) {
            retorno.events = {
                "contexto": "erro_resultado"
            };
        } else {
            let data = JSON.parse(retornoResquest)
        
            if(data.images[0] && data.images[0].classifiers[0] && data.images[0].classifiers[0].classes[0]){
                retorno.events = {
                    "contexto": "resultado"
                };
                retorno.context = {
                    "data": data.images[0].classifiers[0].classes[0]
                };
            }else{
                retorno.events = {
                    "contexto": "sem_resultado"
                };
            }
        }
        console.log(retorno)
        resolve(retorno)
    })
}
