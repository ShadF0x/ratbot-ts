"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var request = require("request");
var path = require("path");
function main(args, bot, cID) {
    if (args.length == 0) {
        bot.sendMessage({
            to: cID,
            message: 'Insufficient arguments. \nUsage: \n```/mcpp server_url [API_provider_url]```'
        });
    }
    var serverURL = args[0];
    var jsonProvider = args[1];
    var serverResponse = getJSON(serverURL, jsonProvider).then(function (data) { return data; });
    serverResponse.then(function (data) {
        if (jsonProvider !== null && jsonProvider !== undefined)
            bot.sendMessage({
                to: cID,
                message: composeCustomJSON(data)
            });
        else
            bot.sendMessage({
                to: cID,
                message: composeResponse(data)
            });
    });
}
exports.main = main;
var configString = fs_1.readFileSync(path.join(__dirname, 'config.json'), 'utf-8');
var config = JSON.parse(configString);
function getJSON(serverURL, JSONProviderURL) {
    JSONProviderURL = (JSONProviderURL === null || JSONProviderURL === undefined) ? config.defaultJSONProvider : JSONProviderURL;
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
//# sourceMappingURL=main.js.map