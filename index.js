require('dotenv').config();

const client = new (require("@typeit/discord")).Client({
    classes: [
        `${__dirname}/dist/*.js`
    ],
    silent: true,
})

client.login(process.env.DISCORD).then(() => {
    console.log("Bot is up!")
    setTimeout(() => {
        client.destroy()
    }, 21595000)
})