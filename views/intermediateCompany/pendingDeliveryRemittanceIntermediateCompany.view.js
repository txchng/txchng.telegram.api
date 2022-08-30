var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}


var description = '✅سوف نخبرک بعد تسلیم الحوالة إلی المستفید.';

function getView(botToken, messageId, user, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle){
  var status = {
    title_ar : 'فی إنتظار تسلیم الحوالة إلی المستفید',
    title_fa: 'در انتظار تحویل حواله به دریافت کننده',
    title_en: 'pendding delivery to receiver',
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
  return {
    id: 3,
    user: user,
    message: message,
    description: description,
    messageId: messageId,
    botToken: botToken,
    options : {
      reply_markup: {},
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
  this.getView = getView;
};
