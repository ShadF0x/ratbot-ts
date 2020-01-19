import {readFileSync as readFile} from 'fs';
import * as request from 'request';
import * as path from "path";

export function main(args: Array<string>, bot, cID: string) {

    if (args.length == 0) {
        bot.sendMessage({
            to: cID,
            message: 'Insufficient arguments. \nUsage: \n```/mcpp server_url [API_provider_url]```'
        });
    }

    let serverURL = args[0];
    let jsonProvider = args[1];

    const serverResponse = getJSON(serverURL, jsonProvider).then(function(data){return data});

    serverResponse.then((data: string) => {
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

const configString = readFile(path.join(__dirname, 'config.json'), 'utf-8');

const config = JSON.parse(configString);

function getJSON (serverURL: string, JSONProviderURL: string) {
    JSONProviderURL = (JSONProviderURL === null || JSONProviderURL === undefined) ? config.defaultJSONProvider : JSONProviderURL;
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
