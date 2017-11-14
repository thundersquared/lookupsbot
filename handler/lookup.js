const url = require('url')
const util = require('util')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const werist = require('werist')
const isDomainName = require('is-domain-name')
const isHttpUrl = require('is-http-url')

// Session pre-checks
const session = ctx => {
  if (ctx.session) {
    ctx.session.lookups = ctx.session.lookups || 0
  }

  return check(ctx)
}

// Domain checks
const check = ctx => {
  if (ctx.message.text) {
    let domain = ctx.message.text

    if (isHttpUrl(domain)) {
      let query = url.parse(domain)
      domain = query.hostname
    }
    
    if (isDomainName(domain)) {
      if (ctx.session) {
        ctx.session.lookups++
      }
      return lookup(ctx, domain)
    }
  }

  return false
}

// Lookup process
const lookup = (ctx, domain) => {
  werist.lookup(domain, (err, data) => {
    if (err) {
      console.error(err)
      return ctx.reply('Something went wrong and I could not fetch whois data.')
    }

    if (data) {
      let whois = data.split('<<<')[0]

      whois = `<pre>${whois}</pre>`

      if (ctx.session) {
        whois += `\n\nLookup <strong>#${ctx.session.lookups}</strong>`
      }
        
      return ctx.reply(whois, {
        disable_web_page_preview: true,
        parse_mode: 'HTML'
      })
    }
  })
}

module.exports = session
