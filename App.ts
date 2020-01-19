import * as discord from 'discord.io';
import * as dotenv from 'dotenv';

//todo Maybe I can make a set of command-module programmatically or some shit
import {main as mcpp} from "./internal_modules/mcpp/main";

dotenv.config();

let bot = new discord.Client({
    token: process.env.TOKEN,
    autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: %s [%s]', bot.username, bot.id);
});

bot.on('message', function (usr: string, usrID: string, cID: string, message: string, event) {

    if (message.substring(0, 1) === '/') {
        let args = message.substring(1).split(' ');
        let cmd = args[0];

        args = args.splice(1);

        logMsg(cmd, usr);

        switch (cmd) {

            case 'debug':
                sendMsg('pong', cID);
                break;

            case 'mcpp':
                mcpp(args, bot, cID);
                break;
        }
    }
});

function sendMsg(msg: string, cID: string) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}

function logMsg(cmd: string, usr: string) {
    console.log(`${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString(undefined, {hour12: false})} || Command requested: \'${cmd}\'; Requested by: ${usr};`);
}
