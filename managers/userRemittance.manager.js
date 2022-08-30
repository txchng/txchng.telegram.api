var userRemittanceList = []
var userRemittance = {
  user: { telegramId: 0, firstname: '', lastname: '', username: '', language_code:'' },
  distributorCompany: {},
  currency: {},
  price: 0,
  applicant: { firstname: '', lastname: '', cellphone: '' },
  receiver: { firstname: '', lastname: '', cellphone: '' },
  receiverTitle:'',
  wagePrice: 0,
  wageCurrency: {},
  stateCode: 1,
};

function getIndexOfUserRemittanceInUserRemittanceList(user){
  var foundIndex = -1
  userRemittanceList.forEach(function(userRemittance, index) {
    console.log('getIndexOfUserRemittanceInUserRemittanceList');
    console.log(index);
    console.log(userRemittance);
    if(userRemittance.user._id == user._id){
      console.log('found index is ');
      console.log(index);
      foundIndex = index;
    }
  });
  return foundIndex;
}

function getUserRemittanceIndex(user){
  var itemIndex = getIndexOfUserRemittanceInUserRemittanceList(user);
  console.log('getUserRemittance itemIndex');
  console.log(itemIndex);
  if(itemIndex == -1){
    var newUserRemittance = {
      user: user,
      stateCode: 1,
    }
    userRemittanceList.push(newUserRemittance);
    console.log('create new');
    return getUserRemittanceIndex(user);
  }else{
    return itemIndex;
  }


  // var foundUserRemittance = userRemittanceList.find(function(userRemittance){
  //   if(userRemittance.user._id == user._id){
  //     return userRemittance;
  //   }
  // });
  //
  // if(!foundUserRemittance){
  //   var newUserRemittance = {
  //     user: user,
  //     stateCode: 1,
  //   }
  //   userRemittanceList.push(newUserRemittance);
  //   console.log('new remittance Added');
  //   console.log(newUserRemittance);
  //   return newUserRemittance;
  // }else{
  //   console.log('old remittance Added');
  //   console.log(foundUserRemittance);
  //   return foundUserRemittance;
  // }
}

function getUserStateCode(user) {
  var result = userRemittanceList[getUserRemittanceIndex(user)].stateCode;
  console.log('getUserStateCode');
  console.log(result);
  return result;
  // var foundUserRemittance = userRemittanceList[getUserRemittanceIndex(user)].stateCode;
  // return foundUserRemittance.stateCode;
}

function setStateCode(user, stateCode) {
  userRemittanceList[getUserRemittanceIndex(user)].stateCode = stateCode;
  return userRemittanceList[getUserRemittanceIndex(user)]
  // var foundUserRemittance = getUserRemittance(user);
  // foundUserRemittance.stateCode = stateCode;
  // return foundUserRemittance;
}

function setDistributorCompany(user, distributorCompany) {
  var foundUserRemittance = getUserRemittance(user);
  foundUserRemittance.distributorCompany = distributorCompany;
  return foundUserRemittance;
}

function setPrice(user, price){
  var foundUserRemittance = getUserRemittance(user);
  foundUserRemittance.price = price;
  return foundUserRemittance;
}

function setCurrency(user, currency){
  var foundUserRemittance = getUserRemittance(user);
  foundUserRemittance.currency = currency;
  return foundUserRemittance;
}

function setWage(user, wagePrice, wageCurrency){
  var foundUserRemittance = getUserRemittance(user);
  foundUserRemittance.wagePrice = wagePrice;
  foundUserRemittance.wageCurrency = wageCurrency;
  return foundUserRemittance;
}

function setReceiverTitle(user, receiverTitle) {
  var foundUserRemittance = getUserRemittance(user);
  foundUserRemittance.receiverTitle = receiverTitle;
  return foundUserRemittance;
}

function clear(user){
  var foundUserRemittance = getUserRemittance(user);
  foundUserRemittance.stateCode = 1;
  foundUserRemittance.distributorCompany = {};
  foundUserRemittance.price = 0;
  foundUserRemittance.currency = {};
  foundUserRemittance.wagePrice = 0;
  foundUserRemittance.wageCurrency = {};
  foundUserRemittance.receiverTitle = '';
  return foundUserRemittance;
}


exports = module.exports = function(options){
  this.getUserStateCode = getUserStateCode;
  this.setStateCode = setStateCode;
  this.setDistributorCompany = setDistributorCompany;
  this.setPrice = setPrice;
  this.setWage = setWage;
  this.setReceiverTitle = setReceiverTitle;
  this.clear = clear;
}
