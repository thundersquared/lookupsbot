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
  window: 60 * 60 * 1000,
  limit: 10,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
})
bot.use(limiter.middleware())

// Start command
bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply('Welcome!')
})

// Generic message with lookup handler
bot.on('text', message)

bot.startPolling()
