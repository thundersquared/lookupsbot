// Config import and checks
const config = require('./config')

if (!config.telegram || !config.telegram.token || config.telegram.token.indexOf(':') < 0) {
  process.exit()
}

// Telegram modules loading
const path          = require('path')
const Telegraf      = require('telegraf')
const TelegrafI18n  = require('telegraf-i18n')
const RateLimit     = require('telegraf-ratelimit')
const MySQLSession  = require('telegraf-session-mysql')
const commandParts  = require('telegraf-command-parts')
const message       = require('./handler/lookup')
const lang          = require('./handler/lang').command

const bot = new Telegraf(config.telegram.token, {
  username: config.telegram.username
})

// DB connection if any
if (config.mysql && config.mysql.host) {
  const session = new MySQLSession(config.mysql)
  bot.use(session.middleware())
}

// Limit lookups
const limiter = new RateLimit({
  window: 5 * 60 * 1000,
  limit: 10,
  onLimitExceeded: (ctx, next) => {
    return ctx.reply(ctx.i18n.t('rate.limit'))
  }
})

// Internationalization
const i18n = new TelegrafI18n({
  directory: path.resolve(__dirname, 'locales'),
  defaultLanguage: 'en',
  sessionName: 'session'
})

// Apply middlewares
bot.use(limiter)
bot.use(i18n.middleware())
bot.use(commandParts())
bot.use((ctx, next) => {
  if (ctx.session) {
    ctx.session.lookups = ctx.session.lookups || 0
    ctx.session.limit = ctx.session.limit || 0
    ctx.session.lang = ctx.session.lang || 'en'

    ctx.i18n.locale(ctx.session.lang)
  }

  return next()
})

// Start command
bot.start((ctx) => {
  return ctx.reply(ctx.i18n.t('commands.start'))
})

bot.command('help', (ctx) => ctx.reply(ctx.i18n.t('commands.help'), {
  parse_mode: 'Markdown'
}))
bot.command('lookup', message)
bot.command('lang', lang)

bot.on('text', message)

bot.startPolling()
