const viewMessage_en = '🔅 Select Item From List:';
const viewMessage_fa = '🔅 از لیست انتخاب کنید:';
const viewMessage = '🔅 إنتخب من المنیو :'

const actionList = [
  {
    id: 1,
    fa_title: 'دریافت فایل',
    ar_title:'طلب الحوالة',
    en_title:'Download',
  },
];

function createKeyboadButton(action){
  return [{ text: action.fa_title }];
}

function createSelectKeyboard(){
  var result = [];
  actionList.map(function(action){
    result.push(createKeyboadButton(action));
  });
  return result;
}

function getView(botToken, user){
  var keyboard = createSelectKeyboard();
  return {
    id:2,
    user:user,
    message: viewMessage,
    botToken: botToken,
    options : {
      reply_markup: {
        //keyboard : keyboard , resize_keyboard: true
      },
    }
  };
}

exports = module.exports = function(){
    this.getView = getView;
};
