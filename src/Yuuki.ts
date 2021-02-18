import Config from './Config'
import VoiceManager from './VoiceManager'
import { Discord, On, Client, ArgsOf } from '@typeit/discord'
import { mkdir } from 'fs'
import LocaleManager from './LocaleManager'
import { TextChannel, Webhook } from 'discord.js'

@Discord()
export class Yuuki {
	static instance: Client
	static webhookjp: Webhook

	private static async setState(client: Client) {
		Yuuki.instance = client
		Yuuki.webhookjp = (
			await (<TextChannel>(
				client.channels.cache.get(Config.channels?.japanese!!)
			)).fetchWebhooks()
		).first()!!
	}

	@On('ready')
	private onReady() {
		Config.load()
		;['assets', 'assets/voice', 'assets/image'].forEach(it =>
			mkdir(it, () => {})
		)
	}

	@On('message')
	private onMessage([message]: ArgsOf<'message'>, client: Client) {
		Yuuki.setState(client).then(() => {
			if (message.author.bot) return
			if (message.channel.id === Config.channels?.japanese) {
				LocaleManager.append(message)
			} else if (
				Object.values(Config.channels!!.text).includes(message.channel.id)
			) {
				VoiceManager.append(message)
			}
		})
	}
}
