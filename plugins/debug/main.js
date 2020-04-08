"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(bot, cID) {
    sendMsg("pong", cID, bot);
}
exports.default = main;
function sendMsg(msg, cID, bot) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}
//# sourceMappingURL=main.js.map