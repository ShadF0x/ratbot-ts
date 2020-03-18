export default function main(bot, cID: string) {
    sendMsg("pong", cID, bot);
}

function sendMsg(msg: string, cID: string, bot) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}