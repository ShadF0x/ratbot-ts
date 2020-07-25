import * as discord from 'discord.io';
import {config} from "dotenv";
import * as plugins from "./plugins";

config(); //initialize dotenv to load token form .env

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
        
        let func = Object.values(plugins).filter(plugin => plugin.invoker === cmd)[0];

        if (func !== null && func !== undefined) {
            args = args.splice(1);
            logMsg(cmd, usr, args);
            func.run(args).then(result => sendMsg(result, cID), reject => {sendMsg("An error has occurred during command execution", cID); logMsg(cmd, usr, reject)})
        }

    }
});

function sendMsg(msg, cID: string) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}

function logMsg(cmd: string, usr: string, args: Array<string>) {
    let currentDate = new Date();
    console.log(`${currentDate.toLocaleDateString('en-GB')} ${currentDate.toLocaleTimeString(undefined, {hour12: false})} || Command requested: \'${cmd}\'; Requested by: ${usr}; Args: [${args}]`);
}
