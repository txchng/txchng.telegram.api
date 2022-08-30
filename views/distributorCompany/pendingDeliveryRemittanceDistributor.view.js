var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}


var description = '⏳ سجل اتمام تسلیم الحوالة إلی المستفید عن طریق البرنامج .';

function getView(botToken, user, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle){
  var status = {
    title_ar : 'فی إنتظار تسلیم الحوالة إلی المستفید',
    title_fa: 'در انتظار تحویل به دریافت کننده',
    title_en: 'pending delivery',
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
  return {
    id: 3,
    user: user,
    message: message,
    description: description,
    messageId: messageId,
    botToken: botToken,
    options : {
        reply_markup: { },
    }
  };
}

exports = module.exports = function(options){
    requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
