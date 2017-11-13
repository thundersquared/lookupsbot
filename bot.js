const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const werist = require('werist')
const util = require('util')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply('Welcome!')
})

bot.hears(/domain (.*)/, (ctx) => {
  console.log(util.inspect(ctx.match))
  if (ctx.match && ctx.match[1]) {
    werist.lookup(ctx.match[1], (err, data) => {
      let whois = data.split('<<<')[0]
      ctx.reply(whois, {
        disable_web_page_preview: true,
        parse_mode: 'Markdown',
        reply_markup: Extra.markup(
          Markup.keyboard(['Coke', 'Pepsi'])
        )
      })
    })
  }
})

bot.startPolling()