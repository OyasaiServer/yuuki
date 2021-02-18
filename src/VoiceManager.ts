import Config from './Config'
import { Message, VoiceChannel } from 'discord.js'
import { createWriteStream, unlink } from 'fs'
import { VoiceText } from 'voice-text'
import { Yuuki } from './Yuuki'

export default class VoiceManager {
	static queue: Promise<{
		vc: string
		mg: string
	}>[] = []

	static append(message: Message) {
		if (this.isShouldSpeak(message.content)) {
			this.queue.push(
				new Promise(resolve => {
					const i = Object.values(Config.channels!!.text).indexOf(
						message.channel.id
					)
					const vc = Object.values(Config.channels!!.voice)[i]
					const ws = createWriteStream(`assets/voice/${vc}_${message.id}.ogg`)
					console.log(
						`[聞き専${i + 1}] ${message.author.username}: ${message.content}`
					)
					new VoiceText(process.env.VOICETEXT)
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
				})
			)
			if (this.queue.length === 1) {
				this.speak()
			}
		}
	}

	static speak() {
		this.queue[0].then(id => {
			;(<VoiceChannel>Yuuki.instance.channels.cache.get(id.vc))
				.join()
				.then(conn => {
					conn.play(`assets/voice/${id.vc}_${id.mg}.ogg`).on('finish', () => {
						this.queue.shift()
						unlink(`assets/voice/${id.vc}_${id.mg}.ogg`, () => {
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
			new RegExp([':', 'http', '@', '#'].join('|')).test(content)
		)
	}
}
