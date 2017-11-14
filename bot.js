// Config import and checks
const config = require('./config')

if (!config.telegram || !config.telegram.token || config.telegram.token.indexOf(':') < 0) {
  process.exit()
}

// Telegram modules loading
const Telegraf      = require('telegraf')
const RateLimit     = require('telegraf-ratelimit')
const MySQLSession  = require('telegraf-session-mysql')
const message       = require('./handler/lookup')

const bot = new Telegraf(config.telegram.token, config.telegram.username)

// DB connection if any
if (config.mysql && config.mysql.host) {
  const session = new MySQLSession(config.mysql)
  bot.use(session.middleware())
}

// Limit lookups
const limiter = new RateLimit({
  window: 5 * 60 * 1000,
  limit: 10,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
})
bot.use(limiter.middleware())

// Start command
bot.start((ctx) => {
  return ctx.reply('Welcome! Start by having a look at /help 😉')
})

// Start command
bot.command('help', (ctx) => ctx.reply(`Lookups bot is a tool to query registrars for WHOIS info regarding domains.

In order to get a domain WHOIS you have to simply send a text message with *the domain name*. E.g.: x.com

Note that there is a *10 lookup requests limit* every 5 minutes.`, {
  parse_mode: 'Markdown'
}))

// Generic message with lookup handler
bot.on('text', message)

bot.startPolling()
