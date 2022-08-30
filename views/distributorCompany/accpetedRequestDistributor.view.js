var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '⏳ الشرکة الواسط سوف تدرس اقتراح العمول';

function getView(botToken, user, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId){
  var status = {
    title_ar : 'فی إنتظار تأیید العمولة من قبل الواسط',
    title_fa: 'در انتظار تایید کارمزد توسط شرکت واسط',
    title_en: 'watting for intermediate company acceptance',
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
        reply_markup: {},
    }
  };
}

exports = module.exports = function(options){
    requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
