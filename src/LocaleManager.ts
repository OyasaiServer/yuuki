import { Message } from 'discord.js'
import { Yuuki } from './Yuuki'
import fetch from 'node-fetch'
import { tree } from './Tree'
import bindings from 'bindings'

const addon = bindings('addon')

export default class LocaleManager {
	static queue: Promise<{
		message: Message
		transliterated: string
	}>[] = []

	static append(message: Message) {
		message.delete()
		this.queue.push(
			new Promise(resolve => {
				fetch(
					`http://www.google.com/transliterate?langpair=ja-Hira|ja&text=${addon.encode(
						this.japanize(message.content)
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
					this.queue.shift()
					if (this.queue.length > 0) {
						this.send()
					}
				})
		})
	}

	static japanize(original: string) {
		const str = original
			.replace(/[Ａ-Ｚａ-ｚ]/, s =>
				String.fromCharCode(s.charCodeAt(0) - 65248)
			)
			.toLowerCase()
		let result = ''
		let tmp = ''
		let index = 0
		const len = str.length
		let node = tree
		const push = (char: string, toRoot = true) => {
			result += char
			tmp = ''
			node = toRoot ? tree : node
		}
		while (index < len) {
			const char = str.charAt(index)
			if (char.match(/[a-z]/)) {
				if (char in node) {
					const next = node[char]
					if (typeof next === 'string') {
						push(next)
					} else {
						tmp += original.charAt(index)
						node = next
					}
					index++
					continue
				}
				const prev = str.charAt(index - 1)
				if (prev && (prev === 'n' || prev === char)) {
					push(prev === 'n' ? 'ン' : 'ッ', false)
				}
				if (node !== tree && char in tree) {
					push(tmp)
					continue
				}
			}
			push(tmp + char)
			index++
		}
		tmp = tmp.replace(/n$/, 'ン')
		push(tmp)
		return result
	}

	static isShouldTransliterate(content: string) {
		return new RegExp(/^[A-Za-z0-9]+$/).test(content)
	}
}
