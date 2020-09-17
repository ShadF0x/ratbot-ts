"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord = require("discord.io");
var dotenv_1 = require("dotenv");
var plugins = require("./plugins");
dotenv_1.config(); //initialize dotenv to load token form .env
var bot = new discord.Client({
    token: process.env.TOKEN,
    autorun: true
});
bot.on('ready', function (evt) {
    var currentDate = new Date();
    var currentDateLocal = currentDate.toLocaleDateString('en-GB');
    var currentTime = currentDate.toLocaleTimeString(undefined, { hour12: false });
    console.log('%s %s || Connected', currentDateLocal, currentTime);
    console.log('%s %s || Logged in as: %s [%s]', currentDateLocal, currentTime, bot.username, bot.id);
});
bot.on('message', function (usr, usrID, cID, message, event) {
    if (message.substring(0, 1) === '/') {
        var args = message.substring(1).split(' ');
        var cmd_1 = args[0];
        var func = Object.values(plugins).filter(function (plugin) { return plugin.invoker === cmd_1; })[0];
        if (func !== null && func !== undefined) {
            args = args.splice(1);
            logMsg(cmd_1, usr, args);
            func.run(args).then(function (result) { return sendMsg(result, cID); }, function (reject) { sendMsg("An error has occurred during command execution", cID); logMsg(cmd_1, usr, reject); });
        }
    }
});
function sendMsg(msg, cID) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}
function logMsg(cmd, usr, args) {
    var currentDate = new Date();
    console.log(currentDate.toLocaleDateString('en-GB') + " " + currentDate.toLocaleTimeString(undefined, { hour12: false }) + " || Command requested: '" + cmd + "'; Requested by: " + usr + "; Args: [" + args + "]");
}
//# sourceMappingURL=App.js.map