import dotenv from "dotenv"
import Discord from "discord.js";

export = class Bot extends Discord.Client {

    init() {
        dotenv.config()
        this.login(process.env.DISCORD)
            .then(() => {
                this.on('message', async msg => {

                })
            })
    }

}