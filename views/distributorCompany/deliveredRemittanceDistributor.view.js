var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}


function createKeyboadButton(requestCoreRefId){
  return [{ text: 'دریافت رسید' , url: 'www.google.com'}];
}

function createReceiptKeyboard(requestCoreRefId){
  var result = [];
  result.push(createKeyboadButton(requestCoreRefId));
  return result;
}

var description = '✅ تم تسلیم الحوالة.';

function getView(botToken, user, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId){

  var status = {
    title_ar : 'تم تسلیم الحوالة',
    title_fa: 'تحویل داده شد',
    title_en: 'delivered',
  };

  var request = {
    status: status.title_ar,
    intermediateCompany: intermediateCompany,
    price: price,
    currency: currency,
    receiverTitle: receiverTitle,
    wagePrice: wagePrice,
    wageCurrency: wageCurrency,
  };

  var message = messageView(request, description);
  var keyboard = createReceiptKeyboard(requestCoreRefId);
  return {
    id: 3,
    user: user,
    message: message,
    description: description,
    messageId: messageId,
    botToken: botToken,
    options : {
      reply_markup: {
        //inline_keyboard : keyboard
      },
    }
  };
}

exports = module.exports = function(options){
    requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
