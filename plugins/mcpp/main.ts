import * as request from 'request';
import * as mcpp_config from "./config.json";

export default async function main(args: Array<string>) {

    if (args.length == 0) {
        return Promise.resolve('Insufficient arguments. \nUsage: \n```/mcpp server_url [API_provider_url]```');
    }

    let serverURL = args[0];
    let jsonProvider = (args[1] === null || args[1] === undefined || args[1] === "") ? mcpp_config.defaultJSONProvider : args[1];

    let serverResponse = await getJSON(serverURL, jsonProvider).then(data => {return data});

    if (jsonProvider !== mcpp_config.defaultJSONProvider)
        return Promise.resolve(composeCustomJSON(serverResponse));
    else
        return Promise.resolve(composeResponse(serverResponse));
}

function getJSON (serverURL: string, JSONProviderURL: string) {
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