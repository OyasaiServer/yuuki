import DraftLog from 'draftlog'
import {　Message, VoiceChannel　} from "discord.js";
import { createWriteStream } from 'fs';
import Config from "./Config";
import fs from 'fs';

export default class VoiceManager {

    static queue: Promise<{
        vc: string
        mg: string
        log: any
        completeLog: string
    }>[] = []

    static append(message: Message) {
        if (this.isShouldSpeak(message.content)) {
            this.queue.push(new Promise(resolve => {
                const i = Object.values(Config.channels!!.text).indexOf(message.channel.id)
                const vc = Object.values(Config.channels!!.voice)[i]
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
                        mg: message.id,
                        // @ts-ignore
                        log: console.draft(`[PENDING] [聞き専${i}] ${message.author.username}: ${message.content}`),
                        completeLog: `[聞き専${i}] ${message.author.username}: ${message.content}`
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
                            id.log(id.completeLog)
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

    static isShouldSpeak(content: string) {
        return !(
            content.length === 0 ||
            content.length > 30 ||
            new RegExp([":", "http", "@", "#"].join("|")).test(content)
        )
    }

}