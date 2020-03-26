"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord = require("discord.io");
var dotenv_1 = require("dotenv");
var plugins = require("./internal_modules");
dotenv_1.config();
var bot = new discord.Client({
    token: process.env.TOKEN,
    autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: %s [%s]', bot.username, bot.id);
});
bot.on('message', function (usr, usrID, cID, message, event) {
    if (message.substring(0, 1) === '/') {
        var args = message.substring(1).split(' ');
        var cmd_1 = args[0];
        var func = Object.values(plugins).filter(function (plugin) { return plugin.invoker === cmd_1; })[0];
        if (func !== null && func !== undefined) {
            args = args.splice(1);
            logMsg(cmd_1, usr, args);
            func.run(bot, cID, args);
        }
    }
});
// function sendMsg(msg: string, cID: string) {     //Kinda deprecated since I couldn't figure out how to return
//     bot.sendMessage({                            //a response string from internal module.
//         to: cID,                                 //Because of that now every module implements its own "sendMsg" if it needs to.
//         message: msg                             //On the other hand, now I can change inner workings however I want and hopefully it won't break.
//     });                                          //
// }                                                //Garbage solution, I know.
function logMsg(cmd, usr, args) {
    var currentDate = new Date();
    console.log(currentDate.toLocaleDateString('en-GB') + " " + currentDate.toLocaleTimeString(undefined, { hour12: false }) + " || Command requested: '" + cmd + "'; Requested by: " + usr + "; Args: [" + args + "]");
}
//# sourceMappingURL=App.js.map