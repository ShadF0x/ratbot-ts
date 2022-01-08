"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord = require("discord.io");
var dotenv_1 = require("dotenv");
var Gamedig = require('gamedig');
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
        Gamedig.query({
            type: cmd_1,
            host: args[0]
        }).then(function (state) {
            sendMsg(state, cID);
        }).catch(function (error) {
            sendMsg({ 'message': "An error has occurred during command execution" }, cID);
            logMsg(cmd_1, usr, error);
        });
    }
});
function sendMsg(sendable, cID) {
    bot.sendMessage({
        to: cID,
        message: sendable.message,
        embed: sendable.embed,
        tts: sendable.tts,
        nonce: sendable.nonce,
        typing: sendable.typing
    });
}
function logMsg(cmd, usr, args) {
    var currentDate = new Date();
    var localeDateString = currentDate.toLocaleDateString('en-GB');
    var localeTimeString = currentDate.toLocaleTimeString(undefined, { hour12: false });
    console.log(localeDateString + " " + localeTimeString + " || Command requested: '" + cmd + "'; Requested by: " + usr + "; Args: [" + args + "]");
}
//# sourceMappingURL=App.js.map