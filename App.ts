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
        let cmd = args[0];

        Gamedig.query({
            type: cmd,
            host: args[0]
        }).then((state) => {
            sendMsg(state, cID)
        }).catch((error) => {
            sendMsg({'message': "An error has occurred during command execution"}, cID);
            logMsg(cmd, usr, error)
        });
    }
});

function sendMsg(sendable, cID: string) { //todo implement sendable as interface/type

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
