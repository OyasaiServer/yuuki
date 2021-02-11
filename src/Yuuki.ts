import Discord from "discord.js";
import Config from "./Config";
import VoiceManager from "./VoiceManager";
import fs from "fs";

export = class Yuuki extends Discord.Client {

    init() {

        Config.load();

        ["assets", "assets/voice", "assets/image"].forEach(it => fs.mkdir(it, () => {}))

        Config.channels!!.cache = this.channels.cache

        this.login(process.env.DISCORD)
            .then(() => {
                this.on('message', message => {

                    if (message.author.bot) return

                    if (Object.values(Config.channels!!.text).includes(message.channel.id)) {
                        VoiceManager.append(message)
                    }
                })
            })

    }

}
