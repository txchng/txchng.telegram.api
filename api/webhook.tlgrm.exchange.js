const TelegramBot = require('node-telegram-bot-api');

const token1 = '309421832:AAG7BR0wk8gCstTvWtmXlj8xO0HN2PIPclM'; //@mobileTayebi
const token2 = '435186463:AAGb34ojYyK2UTYQDJLLiiFKNRx2Mg1rovw'; //@EasyCookBot.
//const token3 = '294323759:AAHX3wlIFuM0PKI2kpqpksnaJtKwlpcSfWE'; //@anajan_bot.
const token3 = '1142730483:AAELRtZzqueMl5mL1jASCN_ymjpPKtlYw7k'; //@AlameerExBot

const bot1 = new TelegramBot(token1, {polling: true});
const bot2 = new TelegramBot(token2, {polling: true});
const bot3 = new TelegramBot(token3, {polling: true});

const managerFile = require('../managers/webhookApi.manager');
var manager = new managerFile({});

function processMessageInManager(botToken, msg){
  manager.processMesssage(botToken, msg)
    .then(function(state){
      //bot1.sendMessage(state.user.telegramId, state.message, state.options);
    })
    .catch(function(err){
      res.json(err);
    })
}

function processCallBackQueryInManager(botToken, msg){
  manager.processCallBackQuery(botToken, msg)
    .then(function(state){
      //bot1.sendMessage(state.user.telegramId, state.message, state.options);
    })
    .catch(function(err){
      res.json(err);
    })
}

bot1.on('message', (msg) => {
  console.log(msg);
  processMessageInManager(token1, msg);
});

bot2.on('message', (msg) => {
  console.log(msg);
  processMessageInManager(token2, msg);
});

bot3.on('message', (msg) => {
  console.log(msg);
  processMessageInManager(token3, msg);
});


bot1.on('callback_query', (msg) => {
  console.log(msg);
  processCallBackQueryInManager(token1, msg);
  }
);
bot2.on('callback_query', (msg) => {
  processCallBackQueryInManager(token2, msg);
}
);
bot3.on('callback_query', (msg) => {
  processCallBackQueryInManager(token3, msg);
});
