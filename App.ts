import * as discord from 'discord.io';
import {config} from "dotenv";
import * as plugins from "./plugins";

config();

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
            func.run(bot, cID, args)
        }

    }
});



// function sendMsg(msg: string, cID: string) {     //Kinda deprecated since I couldn't figure out how to return
//     bot.sendMessage({                            //a response string from internal module.
//         to: cID,                                 //Because of that now every module implements its own "sendMsg" if it needs to.
//         message: msg                             //On the other hand, now I can change inner workings however I want and hopefully it won't break.
//     });                                          //
// }                                                //Garbage solution, I know.

function logMsg(cmd: string, usr: string, args: Array<string>) {
    let currentDate = new Date();
    console.log(`${currentDate.toLocaleDateString('en-GB')} ${currentDate.toLocaleTimeString(undefined, {hour12: false})} || Command requested: \'${cmd}\'; Requested by: ${usr}; Args: [${args}]`);
}