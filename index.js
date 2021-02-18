require('dotenv').config();

const client = new (require("@typeit/discord")).Client()

client.login(
    process.env.DISCORD,
    `${__dirname}/dist/*.js`
).then(() => {
    console.log("Bot is up!")
    setTimeout(() => {
        client.destroy()
    }, 21595000)
})