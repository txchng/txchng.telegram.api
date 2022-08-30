var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '❌ تمّ الغاء طلب الحوالة إلی المکتب';

function getView(botToken, messageId, user, distributorCompany, price, currency, receiverTitle, wagePrice, wageCurrency) {
  var status = {
    title_ar : 'إلغاء الطلب',
    title_fa: 'درخواست لغو شد',
    title_en: 'submition canceled',
  };

  var request = {
    status: status.title_ar,
    distributorCompany: distributorCompany,
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
    messageId: messageId,
    description: description,
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
