// @ts-ignore
import {　VoiceText　} from 'voice-text';
import {　Message, VoiceChannel　} from "discord.js";
import { createWriteStream } from 'fs';
import Config from "./Config";
import fs from 'fs';

export default class VoiceManager {

    static queue: Promise<{
        vc: string,
        mg: string
    }>[] = []

    static isActive: boolean = false

    static append(message: Message) {
        if (this.isReadable(message.content)) {
            this.queue.push(new Promise(resolve => {
                const vc = Object.values(Config.channels!!.voice)[
                    Object.values(Config.channels!!.text).indexOf(message.channel.id)
                    ]
                const ws = createWriteStream(`assets/voice/${vc}_${message.id}.ogg`)
                Config.vt
                    .stream(message.content, {
                        format: 'ogg',
                        speaker: 'show',
                        pitch: '150',
                        speed: '150'
                    })
                    .pipe(ws)
                ws.on('finish', () => {
                    resolve({
                        vc: vc,
                        mg: message.id
                    })
                })
            }))
            if (this.queue.length === 1) {
                this.speak()
            }
        }
    }

    static speak() {
        this.queue[0].then((id) => {
            (Config.channels!!.cache.get(id.vc) as VoiceChannel)
                .join()
                .then(conn => {
                    conn.play(`assets/voice/${id.vc}_${id.mg}.ogg`)
                        .on('finish', () => {
                            this.queue.shift()
                            fs.unlink(`assets/voice/${id.vc}_${id.mg}.ogg`, () => {
                                if (this.queue.length > 0) {
                                    this.speak()
                                }
                            })
                        })
                })
        })
    }

    static isReadable(content: string) {
        return !(content.length > 30 || new RegExp([":", "http", "@", "#"].join("|")).test(content))
    }

}