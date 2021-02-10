// @ts-ignore
import { VoiceText } from 'voice-text';
import { Message } from "discord.js";
import { createWriteStream } from 'fs';
export default class VoiceManager {

    static queue = []

    static append(message: Message) {
        if (this.isReadable(message.content)) {

        }
    }

    static isReadable(content: string) {
        return !(content.length > 30 || new RegExp([":", "http", "@", "#"].join("|")).test(content))
    }

}