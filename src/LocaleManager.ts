import { Message } from 'discord.js'

export default class LocaleManager {
	static queue: Promise<{
		message: Message
		transliterated: string
	}>[] = []
	static append(message: Message) {}
}
