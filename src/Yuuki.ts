import {
    Discord,
    On,
    Client,
    ArgsOf
} from "@typeit/discord";
import Config from "./Config.js";

@Discord()
export abstract class Yuuki {

    static instance: Client

    @On("ready")
    private onReady(
        [message]: ArgsOf<"message">,
        client: Client,
    ) {
        Yuuki.instance = client
        Config.load()
    }

    @On("message")
    private onMessage(
        [message]: ArgsOf<"message">
    ) {
        if (message.author.bot) return
        if (Object.values(Config.channels!!.text).includes(message.channel.id)) {

        }
    }

}