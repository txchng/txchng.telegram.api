var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '❌ الشرکة الواسط لم توافق علی اقتراح العمولة.';


function getView(botToken, user, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle){

  var status = {
    title_ar : 'تم إلغاء الطلب',
    title_fa: 'درخواست رد شد',
    title_en: 'response rejected',
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
