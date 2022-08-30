var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

const actionList = [
  {
    id: 1,
    title: 'المنیو'
  },
];

function createKeyboadButton(action){
  return [{ text: action.title }];
}

function createSelectKeyboard(){
  var result = [];
  actionList.map(function(action){
    result.push(createKeyboadButton(action));
  });
  return result;
}

var description = '❌ تمّ الغاء طلب الحوالة إلی المکتب';

function getView(botToken, user, distributorCompany, price, currency, receiverTitle) {
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
  };

  var message = messageView(request, description);
  var keyboard = createSelectKeyboard();

  return {
    id: 3,
    user: user,
    message: message,
    description: description,
    botToken: botToken,
    options : {
      reply_markup: { keyboard : keyboard , resize_keyboard: true},
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
  this.getView = getView;
};
