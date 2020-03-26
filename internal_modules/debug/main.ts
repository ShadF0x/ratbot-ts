import {Client} from "discord.io"

export default function main(bot: Client, cID: string) {
    sendMsg("pong", cID, bot);
}

function sendMsg(msg: string, cID: string, bot) {
    bot.sendMessage({
        to: cID,
        message: msg
    });
}