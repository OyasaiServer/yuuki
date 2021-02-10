import dotenv from "dotenv"

export default class Yuuki {

    static init() {
        dotenv.config()
        console.log(process.env.DISCORD)
        console.log(process.env.VOICETEXT)
    }

}