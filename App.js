"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord = require("discord.io");
var dotenv = require("dotenv");
//todo Maybe I can make a set of command-module programmatically or some shit
var main_1 = require("./internal_modules/mcpp/main");
dotenv.config();
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
        var cmd = args[0];
        args = args.splice(1);
        logMsg(cmd, usr);
        switch (cmd) {
            case 'debug':
                sendMsg('pong', cID);
                break;
            case 'mcpp':
                sendWaitMsg(cID);
                main_1.main(args, bot, cID);
                break;
        }
    }
});
function sendMsg(msg, cID) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}
function sendWaitMsg(cID) {
    sendMsg('Acquiring data, please wait...', cID);
}
function logMsg(cmd, usr) {
    console.log(new Date().toLocaleDateString('en-GB') + " " + new Date().toLocaleTimeString(undefined, { hour12: false }) + " || Command requested: '" + cmd + "'; Requested by: " + usr + ";");
}
//# sourceMappingURL=App.js.map