<p align="center">
  <img src="media/Slick Icon@2x.png" width="128" />
  <h3 align="center">lookupsbot</h3>
  <p align="center">A Telegram bot to fetch whois data</p>
  <p align="center">
    <a href="https://t.me/lookupsbot" target="_blank">
      <img src="media/Button@2x.png" width="128" />
    </a>
  </p>
</p>

## A bot for what?
lookupsbot is a bot which allows you to retrieve whois data of a domain name.

## Tech stack
The bot is written in Node.JS, relies on [telegraf](https://github.com/telegraf/telegraf) to consume Telegram's Bot API and loves [werist](https://www.npmjs.com/package/werist) module that helps gathering whois data.

## How to run
1. Clone the repo
   ```
   git clone this repo
   ```
2. Install packages
   ```
   yarn
   ```
3. Run
   ```
   yarn dev
   ```

## Config vars
| Block    | Var      | Required |
| -------- | -------- | -------- |
| telegram | token    | **Yes**  |
| telegram | username | No       |
| mysql    | host     | No       |
| mysql    | database | No       |
| mysql    | user     | No       |
| mysql    | password | No       |


## License
The code in this repo and used modules are open-sourced software licensed under the [MIT license](LICENSE.md).
