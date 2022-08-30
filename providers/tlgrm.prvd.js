var axios;
var formData;
var fs;

function sendMessage(botToken, chat_id, text, reply_markup){
  return new Promise(function(resolve, reject) {
    var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage'
    var params = {
        chat_id: chat_id,
        text: text,
        reply_markup: reply_markup,
    };
    let config = {
      headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
      }
    };
    axios.post(url, params, config)
      .then((res) => {
        var response = res.data
        resolve(response);
      })
      .catch((error) => {
        console.error(error)
        reject(error)
      })

  });
}

function replyMessage(botToken, chat_id, text, reply_markup, reply_to_message_id){
  return new Promise(function(resolve, reject) {
    var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
    var params = {
        chat_id: chat_id,
        text: text,
        reply_markup: reply_markup,
        reply_to_message_id: reply_to_message_id,
    };
    let config = {
      headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
      }
    };
    axios.post(url, params, config)
      .then((res) => {
        var response = res.data
        resolve(response);
      })
      .catch((error) => {
        console.error(error)
        reject(error)
      })

  });
}

function editMessageText(botToken, chat_id, message_id, text, reply_markup){
  return new Promise(function(resolve, reject) {
    var url = 'https://api.telegram.org/bot' + botToken + '/editMessageText'
    var params = {
        chat_id: chat_id,
        message_id: message_id,
        text: text,
        reply_markup: reply_markup,
    };
    let config = {
      headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
      }
    };
    axios.post(url, params, config)
      .then((res) => {
        var response = res.data
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error)
        reject(error)
      })

  });
}

function answerCallbackQuery(botToken, callback_query_id, text) {
  return new Promise(function(resolve, reject) {
    var url = 'https://api.telegram.org/bot' + botToken + '/answerCallbackQuery'
    var params = {
        callback_query_id: chat_id,
        text: text,
        show_alert: true,
    };
    let config = {
      headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
      }
    };
    axios.post(url, params, config)
      .then((res) => {
        var response = res.data
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error)
        reject(error)
      })

  });
}

function sendDocument (botToken, chat_id, documentPath){
  return new Promise(function(resolve, reject) {
    fs.readFile(documentPath, function(err, fileData){
      if(err){
        console.log(err);
        reject(err);
      }
      var url = 'https://api.telegram.org/bot' + botToken + '/sendDocument'
      let form = new formData();
      form.append('document', fileData, {
        filepath: documentPath,
        filename:'me.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8',
      });
      form.append('chat_id', chat_id)
      axios.post(url, form, {
        headers: form.getHeaders(),
      }).then(response => {
        console.log('success! ', response.status, response.statusText, response.headers, typeof response.data, Object.prototype.toString.apply(response.data));
        var data = response.data;
        resolve(data)
      }).catch(err => {
        console.log(err);
        reject(err)
      });
    })

  });
}

exports = module.exports = function(options) {
  axios = options.axios;
  formData = options.formData;
  fs = options.fs;

  this.sendMessage = sendMessage;
  this.replyMessage = replyMessage;
  this.editMessageText = editMessageText;
  this.answerCallbackQuery = answerCallbackQuery;
  this.sendDocument = sendDocument;
}
