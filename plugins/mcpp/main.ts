import * as request from 'request';
import * as mcpp_config from "./config.json";
import {Client} from "discord.io";

export default function main(bot: Client, cID: string, args: Array<string>) {

    if (args.length == 0) {
        sendMsg('Insufficient arguments. \nUsage: \n```/mcpp server_url [API_provider_url]```', cID, bot);
        return null;
    }

    let serverURL = args[0];
    let jsonProvider = args[1];

    sendWaitMsg(cID, bot);

    const serverResponse = getJSON(serverURL, jsonProvider).then(function(data){return data});

    serverResponse.then((data: string) => {
        if (jsonProvider !== null && jsonProvider !== undefined)
            sendMsg(composeCustomJSON(data), cID, bot);
        else
            sendMsg(composeResponse(data), cID, bot);
    });
}

function getJSON (serverURL: string, JSONProviderURL: string) {
    JSONProviderURL = (JSONProviderURL === null || JSONProviderURL === undefined) ? mcpp_config.defaultJSONProvider : JSONProviderURL;
    const jsonURL = JSONProviderURL + serverURL;

    return new Promise(function(resolve, reject) {
        request.get({
            url: jsonURL,
            json: true,
        }, function(error, response, body){
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

    let playerList = (serverProperties.players.list !== null && serverProperties.players.list !== undefined) ? serverProperties.players.list.join(' \n') : 'No player list available';

    return "Current player count: $playercount\n```$playerlist```".replace("$playercount", serverProperties.players.online)
                                                                  .replace("$playerlist", playerList);

}

function sendMsg(msg: string, cID: string, bot) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}

function sendWaitMsg(cID: string, bot) {
    sendMsg('Acquiring data, please wait...', cID, bot);
}
