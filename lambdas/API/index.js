let aws = require('aws-sdk')
aws.config.region = 'us-east-1';
global.cwevents = new aws.CloudWatchEvents();
global.lambda = new aws.Lambda();
global.utils = require('./utils');

global.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const api = require("./api");
const schedule = require("./schedule");

exports.handler = async (event, resolve) => {
    let retornoAPI;

    switch (event.api.name) {
        case "salvaDados":
            retornoAPI = await api.salvaDados(event.api.parameters, event.context, event.config)
            break;
        case "a":
            retornoAPI = await api.a(event.api.parameters, event.context, event.config)
            break;
            case "som":
                retornoAPI = await api.som(event.api.parameters, event.context, event.config)
                break;
        case "setSchedule":
            retornoAPI = await schedule.setSchedule(event.api.parameters, event.context, event.config)
            break;
        case "notification":
            await schedule.removeSchedule(event.api.parameters, event.context, event.config)
            retornoAPI = await schedule.notification(event.api.parameters, event.context, event.config)
            break;
        default:
            console.error("API index Não foi encontrada API ", event.api.name)
            return {
                error: "Não foi encontrada API " + event.api.name
            }
    }
    console.log("API index API name: ", event.api.name)
    return retornoAPI
};