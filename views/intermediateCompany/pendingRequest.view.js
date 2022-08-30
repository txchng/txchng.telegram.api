var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

var description = '👍 تم إرسال طلبک إلی المکتب';

function getView(botToken, user, distributorCompany, price, currency, receiverTitle){
  var status = {
    title_ar : 'الطلب في إنتظار الموافقة',
    title_fa: 'درخواست در انتظار تایید',
    title_en: 'pending acceptance',
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
    botToken: botToken,
    options : {
        reply_markup: {},
        //this view shouldent have keyboard becuase we want to update it
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
