
function getView(request){
  var result = '';

  if(request.status){
    result += `📌 حالة الطلب: ${request.status}\n`;
  }

  if(request.distributorCompany && request.distributorCompany.name){
    result += `🏦 موزع الحوالة : ${request.distributorCompany.name}\n`;
  }

  if(request.price && request.currency && request.currency.name && request.currency.code){
    result += `💰 المبلغ : ${request.price} - ${request.currency.name}:${request.currency.code}\n`;
  }else if(request.price){
    result += `💰 المبلغ : ${request.price}\n`;
  }

  if(request.receiverTitle){
    result += `👤 إسم المستلم : ${request.receiverTitle}\n`;
  }

  if(
    request.wagePrice &&
    request.wageCurrency &&
    request.wageCurrency.name &&
    request.wageCurrency.code
  ){
    result += `💰 العموله : ${request.wagePrice} - ${request.wageCurrency.name}:${request.wageCurrency.code}`;
  }

  return result;
}

exports = module.exports = function(){
    this.getView = getView;
};
