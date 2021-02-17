import { Discord, On, Client, ArgsOf } from '@typeit/discord'
import Config from './Config.js'
import VoiceManager from './VoiceManager'
import { mkdir } from 'fs'

@Discord()
export abstract class Yuuki {
	static instance: Client

	@On('ready')
	private onReady(client: Client) {
		Yuuki.instance = client
		Config.load()
		;['assets', 'assets/voice', 'assets/image'].forEach(it =>
			mkdir(it, () => {})
		)
	}

	@On('message')
	private onMessage([message]: ArgsOf<'message'>) {
		if (message.author.bot) return
		if (Object.values(Config.channels!!.text).includes(message.channel.id)) {
			VoiceManager.append(message)
		}
	}
}
