var requestReceiptView;

function messageView(request, description){
  var message = requestReceiptView.getView(request);
  message += `\n${description}`;
  return message;
}

const actionList = [
  {
    id: 1,
    fa_title: 'الغاء',
    ar_title:'الغاء',
    en_title:'Cancel',
  },
];

function createKeyboadButton(action){
  return [{ text: action.ar_title }];
}

function createSelectKeyboard(){
  var result = [];
  actionList.map(function(action){
    result.push(createKeyboadButton(action));
  });
  return result;
}

var description = '💬 إدرج مبلغ الحوالة : ';

function getView(botToken, user, distributorCompany){

  var status = {
    title_ar : 'إدخال البيانات',
    title_fa: 'ورود اطلاعات',
    title_en: 'enter data',
  };

  var request = {
    status: status.title_ar,
    distributorCompany: distributorCompany,
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
      reply_markup : { keyboard : keyboard , resize_keyboard: true },
    }
  };
}

exports = module.exports = function(options){
  requestReceiptView = options.requestReceiptView;
  this.getView = getView;
};
