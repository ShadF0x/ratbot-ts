"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var mcpp_config = require("./config.json");
function main(args, bot, cID) {
    if (args.length == 0) {
        sendMsg('Insufficient arguments. \nUsage: \n```/mcpp server_url [API_provider_url]```', cID, bot);
        return null;
    }
    var serverURL = args[0];
    var jsonProvider = args[1];
    sendWaitMsg(cID, bot);
    var serverResponse = getJSON(serverURL, jsonProvider).then(function (data) { return data; });
    serverResponse.then(function (data) {
        if (jsonProvider !== null && jsonProvider !== undefined)
            sendMsg(composeCustomJSON(data), cID, bot);
        else
            sendMsg(composeResponse(data), cID, bot);
    });
}
exports.default = main;
function getJSON(serverURL, JSONProviderURL) {
    JSONProviderURL = (JSONProviderURL === null || JSONProviderURL === undefined) ? mcpp_config.defaultJSONProvider : JSONProviderURL;
    var jsonURL = JSONProviderURL + serverURL;
    return new Promise(function (resolve, reject) {
        request.get({
            url: jsonURL,
            json: true,
        }, function (error, response, body) {
            if (!error && response.statusCode === 200)
                resolve(body);
            else
                reject(response.statusCode);
        });
    });
}
function composeCustomJSON(json) {
    return 'Custom API provider designated, returning JSON: \n```$json```'.replace('$json', json);
}
function composeResponse(serverProperties) {
    if (!serverProperties.online)
        return 'Server is currently offline';
    var playerList = (serverProperties.players.list !== null && serverProperties.players.list !== undefined) ? serverProperties.players.list.join(' \n') : 'No player list available';
    return "Current player count: $playercount\n```$playerlist```".replace("$playercount", serverProperties.players.online)
        .replace("$playerlist", playerList);
}
function sendMsg(msg, cID, bot) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}
function sendWaitMsg(cID, bot) {
    sendMsg('Acquiring data, please wait...', cID, bot);
}
//# sourceMappingURL=main.js.map