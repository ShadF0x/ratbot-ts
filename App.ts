import * as discord from 'discord.io';
import {config} from "dotenv";
const Gamedig = require('gamedig');

config(); //initialize dotenv to load token form .env

let bot = new discord.Client({
    token: process.env.TOKEN,
    autorun: true
});

bot.on('ready', function (evt) {
    let currentDate = new Date();
    let currentDateLocal = currentDate.toLocaleDateString('en-GB');
    let currentTime = currentDate.toLocaleTimeString(undefined, {hour12: false});
    console.log('%s %s || Connected', currentDateLocal, currentTime);
    console.log('%s %s || Logged in as: %s [%s]', currentDateLocal, currentTime, bot.username, bot.id);
});

bot.on('message', function (usr: string, usrID: string, cID: string, message: string, event) {

    if (message.substring(0, 1) === '/') {
        let args = message.substring(1).split(' ');

        let embed = {
            color: null,
            description: null
        }

        sendMsg({"message" : "Processing the request, please standby"}, cID)

        Gamedig.query({
            type: args[0],
            host: args[1]
        }).then((state) => {
            let msg;
            if (state.players.length === 0) {
                msg = `Server name: ${state.name} \n The server is currently empty`;
            } else {
                msg = `Server name: ${state.name} \n Players: ${state.players.length}`;
            }

            embed.color = 0x07e324;
            embed.description = msg;
            sendMsg({"embed" : embed}, cID)
        }).catch((error) => {
            embed.color = 0xe30707;
            embed.description = "Server appears to be offline"
            sendMsg({"embed" : embed}, cID)
            logMsg(args[0], usr, error)
        });
    }
});

function sendMsg(sendable, cID: string) { //todo implement sendable as interface/type

    console.log(sendable)

    bot.sendMessage({
        to: cID,
        message: sendable.message,
        embed: sendable.embed,
        tts: sendable.tts,
        nonce: sendable.nonce,
        typing: sendable.typing
    });
}

function logMsg(cmd: string, usr: string, args: Array<string>) {
    let currentDate = new Date();
    let localeDateString = currentDate.toLocaleDateString('en-GB');
    let localeTimeString = currentDate.toLocaleTimeString(undefined, {hour12: false});
    console.log(`${localeDateString} ${localeTimeString} || Command requested: \'${cmd}\'; Requested by: ${usr}; Args: [${args}]`);
}
