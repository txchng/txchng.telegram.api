var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '❗️🔙 قد ارجعت الحوالة.';

function getView(botToken, user, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId){

  var status = {
    title_ar : 'قد ارجعت الحوالة',
    title_fa: 'حواله بازپرداخت شد',
    title_en: 'revered remittance',
  };

  var request = {
    status: status.title_ar,
    intermediateCompany: intermediateCompany,
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
