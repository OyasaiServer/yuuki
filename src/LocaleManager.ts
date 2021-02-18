import { Message } from 'discord.js'
import { Yuuki } from './Yuuki'

export default class LocaleManager {
	static queue: Promise<{
		message: Message
		transliterated: string
	}>[] = []

	static append(message: Message) {
		if (this.isShouldTransliterate(message.content)) {
			message.delete()
			this.queue.push(
				new Promise(resolve => {
					fetch(
						`http://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(
							message.content
						)}`
					)
						.then(res => res.json())
						.then(it => {
							resolve({
								message: message,
								transliterated: it.map(it => it[1][0]).join('') as string
							})
						})
				})
			)
			if (this.queue.length === 1) {
				this.send()
			}
		}
	}

	static send() {
		this.queue[0].then(res => {
			Yuuki.webhookjp
				.send(res.transliterated, {
					username: res.message.author.username,
					avatarURL:
						res.message.author.avatarURL() ||
						res.message.author.defaultAvatarURL
				})
				.then(() => {
					if (this.queue.length > 0) {
						this.send()
					}
				})
		})
	}

	static isShouldTransliterate(content: string) {
		return content.match(/^[A-Za-z]+$/)
	}
}
