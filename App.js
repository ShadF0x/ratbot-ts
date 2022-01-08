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
        var args_1 = message.substring(1).split(' ');
        var embed_1 = {
            color: null,
            description: null
        };
        sendMsg({ "message": "Processing the request, please standby" }, cID);
        Gamedig.query({
            type: args_1[0],
            host: args_1[1]
        }).then(function (state) {
            var msg;
            if (state.players.length === 0) {
                msg = "Server name: " + state.name + " \n The server is currently empty";
            }
            else {
                msg = "Server name: " + state.name + " \n Players: " + state.players.length;
            }
            embed_1.color = 0x07e324;
            embed_1.description = msg;
            sendMsg({ "embed": embed_1 }, cID);
        }).catch(function (error) {
            embed_1.color = 0xe30707;
            embed_1.description = "Server appears to be offline";
            sendMsg({ "embed": embed_1 }, cID);
            logMsg(args_1[0], usr, error);
        });
    }
});
function sendMsg(sendable, cID) {
    console.log(sendable);
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