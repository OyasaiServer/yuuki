import toml from 'toml'
import fs from "fs";
import dotenv from "dotenv";
import { Channel, Collection, Snowflake } from "discord.js";
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
        cache:  Collection<Snowflake, Channel>
    } | undefined

    static load() {
        dotenv.config()
        Object.assign(
            this,
            toml.parse(fs.readFileSync("config.toml").toString())
        )
    }


}