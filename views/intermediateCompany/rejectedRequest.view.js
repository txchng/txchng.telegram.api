var requestReceiptView;
function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;

}

var description = '💸الشرکة الموزعة رفضت الطلب.';

function getView(botToken, messageId, user, distributorCompany, price, currency, receiverTitle){
  var status = {
    title_ar : 'رفضت',
    title_fa: 'رد شد',
    title_en: 'rejected',
  };

  var request = {
    status: status.title_ar,
    distributorCompany: distributorCompany,
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
