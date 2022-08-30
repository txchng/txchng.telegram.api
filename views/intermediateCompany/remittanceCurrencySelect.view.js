var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

function createKeyboadButton(currency){
  var textValue = currency.imoji + ' ' + currency.code
  return [{ text:  textValue}];
}

function currencySelectKeyboard(currencyList){
  var result = [];
  currencyList.map(function(currency){
    result.push(createKeyboadButton(currency));
  });
  return result;
}

var description = '💬 اختیار العملة : ';

function getView(botToken, user, currencyList, distributorCompany, price, messageId){
  var status = {
    title_ar : 'إدخال البيانات',
    title_fa: 'ورود اطلاعات',
    title_en: 'enter data',
  };

  var request = {
    status: status.title_ar,
    distributorCompany: distributorCompany,
    price: price,
  };

  var keyboard = currencySelectKeyboard(currencyList);
  var message = messageView(request, description);
  return {
    id:5,
    user: user,
    message: message,
    description: description,
    messageId:messageId,
    botToken: botToken,
    options : {
      reply_markup: { keyboard : keyboard , resize_keyboard: true },
    }
  };
}

exports = module.exports = function(options){
    requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
