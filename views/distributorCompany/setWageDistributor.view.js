
function messageView(intermediateCompany, price, currency, receiverTitle){
  // var message = '💸New Remittance\n🏦 Distributor : '+ distributorCompany.name + '\n\n';
  // message = message +'💬Enter Remittance Price(Just Number):'
  // return message;

  // var message = '💸 الحوالة جدید\n';
  // message = message + '🏦 پخش کننده : '+ distributorCompany.name + '\n';
  // message = message + '\n💬 مبلغ الحوالة را وارد کنید (فقط عدد) : '
  // return message;

  var message = '💸 تعیین مبلغ کارمزد\n';
  message = message + '🏦 شرکت واسط : '+ intermediateCompany.name + '\n';
  message = message + '💰 الالمبلغ : ' + price + ' - ' + currency.name + ':' + currency.code + ' \n';
  message = message + '👤 إسم المستلم : ' + receiverTitle + '\n';
  message = message + '👤 مبلغ کارمزد را وارد کنید: \n';
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

function getView(botToken, user, messageId, intermediateCompany, price, currency, receiverTitle){
  var message = messageView(intermediateCompany, price, currency, receiverTitle);
  var keyboard = createSelectKeyboard();
  return {
    id: 3,
    user: user,
    message: message,
    messageId: messageId,
    botToken: botToken,
    options : {
      reply_markup : {
        //keyboard : keyboard , resize_keyboard: true 
      },
    }
  }
}

exports = module.exports = function(){
    this.getView = getView;
};
