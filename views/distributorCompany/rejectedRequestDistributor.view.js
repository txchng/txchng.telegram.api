var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '💬 تم ابلاغ الغائک للطلب.';

function getView(botToken, user, messageId, intermediateCompany, price, currency, receiverTitle){

  var status = {
    title_ar : 'تم إلغاء الطلب',
    title_fa: 'لغو درخواست اعلام شد',
    title_en: 'rejection notified',
  };

  var request = {
    status: status.title_ar,
    intermediateCompany: intermediateCompany,
    price: price,
    currency: currency,
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
