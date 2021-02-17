const Discord = require("@typeit/discord");
require('dotenv').config();

(new Discord.Client()).login(
    process.env.DISCORD,
    `${__dirname}/dist/*.js`
).then(() => {
    console.log("Bot is up!")
})