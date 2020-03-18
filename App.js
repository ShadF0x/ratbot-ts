"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord = require("discord.io");
var dotenv_1 = require("dotenv");
//import * as int_modules from "./internal_modules";
//import * as mcpp from "./internal_modules/mcpp";
var intmods = require("./internal_modules");
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
        var cmd = args[0];
        args = args.splice(1);
        logMsg(cmd, usr);
        switch (cmd) {
            case intmods.debug.invoker:
                intmods.debug.call(bot, cID);
                break;
            case intmods.mcpp.invoker:
                intmods.mcpp.check(args, bot, cID);
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
function logMsg(cmd, usr) {
    console.log(new Date().toLocaleDateString('en-GB') + " " + new Date().toLocaleTimeString(undefined, { hour12: false }) + " || Command requested: '" + cmd + "'; Requested by: " + usr + ";");
}
//# sourceMappingURL=App.js.map