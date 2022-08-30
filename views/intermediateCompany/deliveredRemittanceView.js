var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;

}

function createKeyboadButton(requestCoreRefId){
  return [{ text: 'رسید الحوالة' , url: 'www.google.com' }];
}

function createReceiptKeyboard(requestCoreRefId){
  var result = [];
  result.push(createKeyboadButton(requestCoreRefId));
  return result;
}

var description = '✅ قد تم تسلیم الحوالة';

function getView(botToken, messageId, user, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId){
  var status = {
    title_ar : 'تم التسلیم',
    title_fa: 'تحویل شده',
    title_en: 'delivered',
  };

  var request = {
    status: status.title_ar,
    distributorCompany: distributorCompany,
    price: price,
    currency: currency,
    wagePrice: wagePrice,
    wageCurrency: wageCurrency,
    receiverTitle: receiverTitle,
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
      //reply_markup: { inline_keyboard : keyboard },
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
  this.getView = getView;
};
