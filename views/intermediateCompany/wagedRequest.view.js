var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

const actionList = [
  {
    id: 6,
    title: 'Confirm',
    ar_title: 'قبول العمولة',
    fa_title: 'تأیید',
  },
  {
    id: 7,
    title: 'Reject',
    ar_title: 'رد العمولة و إلغاء الطلب',
    fa_title: 'رد',
  },
];

function createCallData(action, requestCoreRefId){
  return JSON.stringify({
    actionId: action.id,
    requestCoreRefId : requestCoreRefId,
  });
}

function createKeyboadButton(requestCoreRefId, action){
  return [{ text: action.ar_title ,callback_data: createCallData(action, requestCoreRefId)}];
}

function createSelectKeyboard(requestCoreRefId){
  var result = [];
  actionList.map(function(action){
    result.push(createKeyboadButton(requestCoreRefId, action));
  });
  return result;
}

var description = '❗️الشرکة الموزعة اقترحت عمولة تحویل الحوالة.\n❓ هل تأید';

function getView(botToken, messageId, user, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId){
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
    wagePrice: wagePrice,
    wageCurrency: wageCurrency,
    receiverTitle: receiverTitle,
  };

  var message = messageView(request, description);
  var keyboard = createSelectKeyboard(requestCoreRefId);
  return {
    id: 3,
    user: user,
    message: message,
    description: description,
    messageId: messageId,
    botToken: botToken,
    options : {
        reply_markup: { inline_keyboard : keyboard },
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
    this.getView = getView;
};
