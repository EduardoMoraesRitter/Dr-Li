'use strict'

global.aws = require('aws-sdk')
global.aws.config.region = 'us-east-1'

let lambda = new global.aws.Lambda()

const saveDate = require("./services/saveDate")
const config = require("./services/getSetting")
const nlp = require("./nlp/index")

const inwhatsapp = require("./whatsapp/in")
const outwhatsapp = require("./whatsapp/out")

global.https = require('https')

function ivocation(functionName, payload) {
  return new Promise(function (resolve, reject) {
    lambda.invoke({
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(payload)
    }, function (err, data) {
      if (err) {
        console.error("master ivocation functionName ", functionName)
        console.error("master ivocation err ", err)
      } else {
        resolve(JSON.parse(data.Payload))
      }
    })
  })
}

exports.handler = async (event, context, callback) => {
  if (!event) {    
    console.error("master index event")
    return false
  }

  //Extração
  var objUser = await inwhatsapp.extract(event)
  console.log("master inwhatsapp.extract objUser:", objUser)
  if (!objUser) {    
    console.error("master index extract ", event)
    return false
  }

  callback(null, "ok")

  //PEGAS AS CONFIGURACOES
  let objSetting = JSON.parse(JSON.stringify(await config.getconfig(objUser.serverId)))
  if (!objSetting.serverId) {
    callback(Error("codigoRetorno -1 ", objUser.serverId))
    console.error("master index objSetting ", objUser.serverId)
    return false
  }

  console.log("master index ok config getconfig:", objSetting)

  //REPOSITORIO - pega contexto se nao tiver cria
  let retornoGetRepository = await ivocation("data", {
    methods: "get",
    userId: objUser.userId,
    table: objSetting.table
  })
  if (!retornoGetRepository) {
    
    console.error("master index getcontext")
    return false
  }

  //TIMER PARA DESLIGAR CONTEXTO se passar muito tempo da ultima interacao e nao estiver em transbordo zera o contexto
  let agora = new Date().toLocaleString('en-us', {
    timeZone: 'America/Sao_Paulo'
  })

  //se tiver em tranbordo ou a data for menor que o tempo determinado (retornoGetRepository.Item.context.transbordo) ||
  if (retornoGetRepository.Item && retornoGetRepository.Item.context && (Date.parse(agora) - Date.parse(retornoGetRepository.Item.data)) < objSetting.timeout) {
    //mudar a skill de acordo com a bot escolhido
    if (retornoGetRepository.Item && retornoGetRepository.Item.context && retornoGetRepository.Item.context.skill) {
      objSetting.nlp.workspace = retornoGetRepository.Item.context.skill
    }
    objUser.context = Object.assign(retornoGetRepository.Item.context, objUser.context)
  } else {
    objUser.context.interacao = 1
    objUser.context.titulo = "inicio"
    objUser.context.session = objUser.userId + "" + objUser.serverId + "" + new Date().getTime()

    let retornoPutRepository = await ivocation("data", {
      methods: "put",
      userId: objUser.userId,
      context: objUser.context,
      table: objSetting.table
    })

    if (!retornoPutRepository) {
      
      console.error("master index contexto")
      return "ERROR contexto"
    }
    objUser.context = retornoPutRepository.Item.context
  }

  //VERFICA SE VAI PRO TRANSBORDO
  if (objUser.context && objUser.context.transbordo) {
    console.log("master index transbordado: ", objUser)

  } else {

    let objSendNLP = {
      serverId: objUser.serverId,
      message: objUser.message,
      context: objUser.context,
      urlWatson: objSetting.nlp.urlWatson,
      workspace: objSetting.nlp.workspace,
      apikey: objSetting.nlp.apikey
    }

    console.log("master index objSendNLP: ", objSendNLP)

    //INVOCA O WATSON
    //var objBot = await ivocation("corporate-customer-conversation-nlp", objSendNLP)

    var objBot = await nlp.index(objSendNLP)


    if (!objBot || typeof (objBot) != "object" || !objUser.context) {
      callback(Error("codigoRetorno -1", objBot))
      console.error("master index NLP ", objSendNLP, " objBot: ", objBot)
      return "ERROR NLP"
    }

    objUser.context = objBot.context

    if (objBot.messages && objBot.messages.length > 0) {

      let objSendCallback = {
        URL: objSetting.channel.URL,
        userId: objUser.userId,
        Authorization: objSetting.channel.Authorization,
        recipient_type: objUser.context.recipient_type,
        serverId: objUser.serverId,
        messages: objBot.messages,
        preview_url: objUser.context.preview_url ? objUser.context.preview_url : false,
        namespace: objSetting.channel.namespace
      }

      var retornoCallback = await outwhatsapp.send(objSendCallback)
      if (!retornoCallback) {
        return false
      }
      // let retornoCallback = await ivocation("sendClient", objSendCallback)
      // if (!retornoCallback || typeof (retornoCallback) != "object") {
      //   console.error("master index callback ", objSendCallback)
      //   return "ERROR callback"
      // }
      // console.log("master index retornoCallback: ", retornoCallback)
    }

    //salva hitorico da mensagem
    //objUser.context.Historico = await montaHistorico(objBot, objUser)

    //salvar dashbord
    await saveDate.saveDash(objSetting, objBot, objUser)

    //altera para proxima interacao
    objUser.context.interacao = objUser.context.interacao ? objUser.context.interacao + 1 : 1
    objUser.context.titulo = objBot.titulo

    await ivocation("data", {
      methods: "update",
      userId: objUser.userId,
      context: objUser.context,
      table: objSetting.table
    })

    //chamada de API
    if (objBot.actions) {
      console.log("master index objBot.actions: ", objBot.actions)

      let retornoApi = await ivocation("API", {
        api: objBot.actions[0],
        context: objUser.context,
        config: objSetting
      })

      if (!retornoApi || typeof (retornoApi) != "object") {
        
        console.error("master index API")
        return "ERROR API"
      }

      console.log("master index retornoApi: ", retornoApi)

      if (retornoApi.context) {
        objUser.context = Object.assign(objUser.context, retornoApi.context)
      }

      if (retornoApi.events) {
        console.log("master index retornoApi.events: ", retornoApi.events)
        retornoApi.events = Object.assign(objUser.context, retornoApi.events)

        let objSendNLP = {
          message: "",
          context: retornoApi.events,
          serverId: objUser.serverId,
          urlWatson: objSetting.nlp.urlWatson,
          workspace: objSetting.nlp.workspace,
          apikey: objSetting.nlp.apikey
        }

        console.log("master index objSendNLP: ", objSendNLP)

        //let retornoNLP = await ivocation("corporate-customer-conversation-nlp", objSendNLP)
        let retornoNLP = await nlp.index(objSendNLP)

        if (typeof (retornoNLP) != "object" || retornoNLP.messages == undefined || retornoNLP.context == undefined) {
          callback(Error("codigoRetorno -1 ", objSendNLP))
          console.error("master index retornoNLP events objSendNLP", objSendNLP)
          console.error("master index retornoNLP events retornoNLP", retornoNLP)
          return "ERROR retornoNLP events"
        } else {
          console.log("master index retornoNLP: ", retornoNLP)
          objUser.context = Object.assign({}, objUser.context, retornoNLP.context)
        }

        if (retornoNLP.messages.length > 0) {

          objBot.messages = retornoNLP.messages

          let objSendCallback = {
            URL: objSetting.channel.URL,
            userId: objUser.userId,
            Authorization: objSetting.channel.Authorization,
            recipient_type: objUser.context.recipient_type,
            serverId: objUser.serverId,
            messages: objBot.messages,
            preview_url: objUser.context.preview_url ? objUser.context.preview_url : false,
            namespace: objSetting.channel.namespace
          }

          var retornoCallback = await outwhatsapp.send(objSendCallback)
          if (!retornoCallback) {
            return false
          }
          // let retornoCallback = await ivocation("sendClient", objSendCallback)
          // if (!retornoCallback || typeof (retornoCallback) != "object") {
          //   callback(Error("codigoRetorno -1 ", objSendCallback))
          //   console.error("master index callback events ", objSendCallback)
          //   return "ERROR callback"
          // }
          // console.log("master index retornoCallback: ", retornoCallback)

        }
      }

      //atualiza contexto
      await ivocation("data", {
        methods: "update",
        userId: objUser.userId,
        context: objUser.context,
        table: objSetting.table
      })
    }
  }
  return "ok"

  /**/
}