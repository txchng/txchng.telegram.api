var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '💬 إسم المستلم : ';

function getView(botToken, user, distributorCompany, price, currency){
  var status = {
    title_ar : 'إدخال البيانات',
    title_fa: 'ورود اطلاعات',
    title_en: 'enter data',
  };

  var request = {
    status: status.title_ar,
    distributorCompany: distributorCompany,
    price: price,
    currency: currency,
  };

  var message = messageView(request, description);
  return {
    id: 3,
    user: user,
    message: message,
    botToken: botToken,
    options : {
      reply_markup : { remove_keyboard : true },
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
