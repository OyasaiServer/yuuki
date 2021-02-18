import Config from './Config'
import VoiceManager from './VoiceManager'
import { Discord, On, Client, ArgsOf } from '@typeit/discord'
import { mkdir } from 'fs'

@Discord()
export class Yuuki {
	static instance: Client

	@On('ready')
	private onReady() {
		Config.load()
		;['assets', 'assets/voice', 'assets/image'].forEach(it =>
			mkdir(it, () => {})
		)
	}

	@On('message')
	private onMessage([message]: ArgsOf<'message'>, client: Client) {
		Yuuki.instance = client
		if (message.author.bot) return
		if (Object.values(Config.channels!!.text).includes(message.channel.id)) {
			VoiceManager.append(message)
		}
	}
}
