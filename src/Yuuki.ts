import Discord from "discord.js";
import Config from "./Config";
import VoiceManager from "./VoiceManager";
import fs from "fs";

export = class Bot extends Discord.Client {

    init() {

        Config.load();

        ["assets", "assets/voice", "assets/image"].forEach(fs.mkdirSync)

        this.login(process.env.DISCORD)
            .then(() => {
                this.on('message', async message => {

                    if (message.author.bot) return

                    if (Object.values(Config.channels!!.text).includes(message.channel.id)) {
                        VoiceManager.append(message)
                    }
                })
            })

    }

}