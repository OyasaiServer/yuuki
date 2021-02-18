import { Message } from 'discord.js'

export default class LocaleManager {
	static queue: Promise<{
		message: Message
		transliterated: string
	}>[] = []
	static append(message: Message) {}

	static isShouldTransliterate(content: string) {
		return content.match(/^[A-Za-z]+$/)
	}
}
