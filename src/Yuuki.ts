import Discord from "discord.js";
import Config from "./Config";
import VoiceManager from "./VoiceManager";

export = class Bot extends Discord.Client {

    init() {

        Config.load()
        this.login(process.env.DISCORD)
            .then(() => {
                this.on('message', async message => {
                    if (Object.values(Config.channels!!.text).includes(message.channel.id)) {
                        VoiceManager.append(message)
                    }
                })
            })

    }

}