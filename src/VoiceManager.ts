import Config from './Config'
import { Message, VoiceChannel } from 'discord.js'
import { createWriteStream, unlink } from 'fs'
import { VoiceText } from 'voice-text'
import { Yuuki } from './Yuuki'

export default class VoiceManager {
	static queue: Promise<{
		vc: string
		mg: string
	} | null>[] = []

	static append(message: Message) {
		if (this.isShouldSpeak(message.content)) {
			this.queue.push(
				new Promise(resolve => {
					const i = Object.values(Config.channels!!.text).indexOf(
						message.channel.id
					)
					const vc = Object.values(Config.channels!!.voice)[i]
					const ws = createWriteStream(`./assets/voice/${vc}_${message.id}.ogg`)
					let content = message.content
					switch (message.content) {
						case '木下愛斗': {
							content = 'きのしたまなと'
							break
						}
					}
					new VoiceText(process.env.VOICETEXT)
						.stream(content, {
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
					ws.on('error', () => {
						resolve(null)
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
			if (id) {
				const channelInstance = <VoiceChannel>(
					Yuuki.instance.channels.cache.get(id.vc)
				)
				if (channelInstance) {
					channelInstance.join().then(conn => {
						conn
							.play(`./assets/voice/${id.vc}_${id.mg}.ogg`)
							.on('finish', () => {
								this.queue.shift()
								unlink(`./assets/voice/${id.vc}_${id.mg}.ogg`, () => {
									if (this.queue.length > 0) {
										this.speak()
									}
								})
							})
					})
				}
			}
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
