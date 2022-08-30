var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}


function createKeyboadButton(requestCoreRefId){
  return [{ text: 'مشاهده جزئیات' ,url: 'www.google.com'}];
}

function createSelectKeyboard(requestCoreRefId){
  var result = [];
  result.push(createKeyboadButton(requestCoreRefId));
  return result;
}

var description = '💬  ثبّت العمولة عن طریق البرنامج';

function getView(botToken, user, intermediateCompany, price, currency, receiverTitle, requestCoreRefId){
  var status = {
    title_ar : 'طلب تسلیم الحوالة',
    title_fa: 'درخواست توزیع حواله',
    title_en: 'distribution request',
  };

  var request = {
    status: status.title_ar,
    intermediateCompany: intermediateCompany,
    price: price,
    currency: currency,
    receiverTitle: receiverTitle,
  };
  var message = messageView(request, description);
  var keyboard = createSelectKeyboard(requestCoreRefId);
  return {
    id: 3,
    user: user,
    message: message,
    description: description,
    botToken: botToken,
    options : {
        //reply_markup: { inline_keyboard : keyboard },
    }
  };
}

exports = module.exports = function(options){
    requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
