import { parse } from 'toml'
import { readFileSync } from 'fs'

export default class Config {

    static channels: {
        text: {
            1: string,
            2: string,
            3: string
        }
        voice: {
            1: string,
            2: string,
            3: string
        }
    } | undefined

    static load() {
        Object.assign(
            this,
            parse(readFileSync("config.toml").toString())
        )
    }

}