import * as request from 'request';
import * as valheim_config from "./config.json";
const Gamedig = require('gamedig');

export default async function main(args: Array<string>) {

    if (args.length == 0) {
        return Promise.resolve(`Insufficient arguments. \nUsage: \n\`\`\`/${valheim_config.cmd} server_url\`\`\``);
    }

    let response = await Gamedig.query({
        type: "valheim",
        host: args[0]
    }).then((state) => {
        return state;
    }).catch((error) => {
        return error;
    });

    if (response.players === undefined)
        return Promise.resolve(composeResponse(false, null, null, null, null));

    if (response.players.length === 0) {
        return Promise.resolve(composeResponse(true, 0, response.name, false,null));
    } else if (valheim_config.vhstatusQueryURL === "") {
        return Promise.resolve(composeResponse(true, response.players.length, response.name, false, null));
    } else {
        let serverResponse = await getJSON().then(data => {return data});
        let playerList = composePlayerList(serverResponse);
        return Promise.resolve(composeResponse(true, response.players.length, response.name, true, playerList));
    }
}

function getJSON () {
    return new Promise(function(resolve, reject) {
        request.get({
            url: valheim_config.vhstatusQueryURL,
            json: true,
        }, function(error, response, body){
            if (!error && response.statusCode === 200) {
                resolve(body);
            }
            else
                reject(response.statusCode);
        });
    });
}

function composePlayerList(playerListObject: any) {
    let playerList = [];
    let playerIDList = Object.keys(playerListObject.users);
    playerIDList.forEach(playerID => {
        if (playerListObject.users[playerID].connected)
            playerList.push(playerListObject.users[playerID].name)
    })
    return playerList;
}

function composeResponse(isOnline: boolean, count: number, serverName: string, statRetrievable: boolean, playerList) {
    let embed = {
        color: null,
        description: null
    }

    if (!isOnline) {
        embed.description = 'The server appears to be offline';
        embed.color = 0xe30707;
    } else if (count === 0) {
        embed.description = `Server name: ${serverName} \n The server is currently empty`;
        embed.color = 0xf0e922;
    } else if (!statRetrievable) {
        embed.description = `Server name: ${serverName}\nCurrent player count: ${count}\nThis server does not provide the list of players`;
        embed.color = 0x07e324;
    } else {
        embed.description = `Server name: ${serverName}\nCurrent player count: ${count}\nPlayers: ${playerList.join(" \n")}`;
        embed.color = 0x07e324;
    }

    return {'embed': embed}
}
