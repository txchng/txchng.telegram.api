var Promise = require('promise');

const iocManagerFile = require('./ioc.manager');
var ioc = new iocManagerFile({});

function processCallBackQuery(botToken, message){
  console.log(message);
  var callback_query_id = message.id;
  if(message.data){
    var data = JSON.parse(message.data);
    var actionId = data.actionId;
    var requestCoreRefId = data.requestCoreRefId;
    console.log('processCallBackQuery');
    console.log(actionId);
    console.log(requestCoreRefId);
    if(actionId && requestCoreRefId){
      if(actionId == 6){
        console.log('we are here to accpet waged request');
        console.log('requestCoreRefId for delivery');
        console.log(requestCoreRefId);
        processAcceptedWageByIntermidiateCompany(botToken, requestCoreRefId);
      } else if(actionId == 7){
        console.log('we are here to canceled waged request');
        console.log('requestCoreRefId for canceled');
        console.log(requestCoreRefId);
        processCanceledWageByIntermidiateCompany(botToken, requestCoreRefId);
      }
    }
  }
}

function processCanceledWageByIntermidiateCompany(botToken, requestCoreRefId){
  return new Promise(function(resolve, reject) {
    ioc.userBotRemittanceManager.canceledWageByIntermidiateCompany(requestCoreRefId)
      .then(function(canceledUserBotRequest){
        if(canceledUserBotRequest){
          ioc.coreApiManager.sendCanceledWagedRequest(botToken, canceledUserBotRequest.user._id, requestCoreRefId)
            .then(function(updatedCoreSystemRequest){
              console.log('processCanceledWageByIntermidiateCompany updatedCoreSystemRequest');
              console.log(updatedCoreSystemRequest);
              //set updated core systetm request to db
              showCanceledWagedRequestForIntermediateCompanyUser(botToken, canceledUserBotRequest);
              showCanceledWagedRequestForDisteributorCompanyUser(botToken, canceledUserBotRequest);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        }else{
          // call system error log api
          var noUserBotRequesrFontError = new Error('no userBotRequest found to canceled after waged');
          console.log(noUserBotRequesrFontError);
          reject(noUserBotRequesrFontError);
        }
      })
      .cathc(function(err){
        console.log(err);
        reject(err);
      });
  });
}

function showCanceledWagedRequestForIntermediateCompanyUser(botToken, userBotRequest){
  var messageId = userBotRequest.messageId;
  var distributorCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var wagePrice = userBotRequest.wage.wagePrice;
  var wageCurrency = userBotRequest.wage.currency;
  var receiverTitle = userBotRequest.receiverTitle;

  userBotRequest.sentTelegramMessageLogList.forEach(function(sentTelegramMessageLog){
    var view = ioc.customerViewList.canceledWagedRequest.getView(botToken, sentTelegramMessageLog.messageId, distributorCompanyUser, distributorCompany, price, currency, receiverTitle, wagePrice, wageCurrency);
    ioc.notifyManager.updateView(view);
  });

}

function showCanceledWagedRequestForDisteributorCompanyUser(botToken, userBotRequest){
  var distributorCompanyUserTelegramSystemRefId = userBotRequest.distributorCompany.owner.telegramSystemRefId;
  ioc.userManager.get(distributorCompanyUserTelegramSystemRefId)
    .then(function(foundOwnerOfDistributorCompany){
      var messageId = userBotRequest.distributorCompanyMessageId;
      var intermediateCompany = userBotRequest.intermediateCompany;
      var price = userBotRequest.price;
      var currency = userBotRequest.currency;
      var wagePrice = userBotRequest.wage.wagePrice;
      var wageCurrency = userBotRequest.wage.currency;
      var receiverTitle = userBotRequest.receiverTitle;
      var view = ioc.adminViewList.canceledWagedRequest.getView(botToken, foundOwnerOfDistributorCompany, sentTelegramMessageLog.messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle);
      ioc.notifyManager.updateView(view);


    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processAcceptedWageByIntermidiateCompany(botToken, requestCoreRefId){
  ioc.userBotRemittanceManager.acceptedWageByIntermidiateCompany(requestCoreRefId)
    .then(function(foundUserBotRemittance){
      console.log('processAcceptedWageByIntermidiateCompany foundUserBotRemittance');
      console.log(foundUserBotRemittance);
      ioc.coreApiManager.sendAcceptWagedRequest(botToken, foundUserBotRemittance.user._id, requestCoreRefId)
        .then(function(createdRemittance){
          console.log('processAcceptedWageByIntermidiateCompany remittance');
          console.log(createdRemittance);
          ioc.userBotRemittanceManager.setRemittance(requestCoreRefId, createdRemittance)
            .then(function(updatedUserBotRequest){
              showPenddingDeliveryForDistributorCompanyUser(botToken, updatedUserBotRequest);
              showPenddingDeliveryForIntermediateCompanyUser(botToken, updatedUserBotRequest);
            })
            .catch(function(err){
              reject(err);
            });
        })
        .catch(function(err){
          console.log(err);
        });
    })
    .catch(function(err){
      console.log(err);
    });
}

function showPenddingDeliveryForIntermediateCompanyUser(botToken, userBotRequest){
  var messageId = userBotRequest.messageId;
  var distributorCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var wagePrice = userBotRequest.wage.wagePrice;
  var wageCurrency = userBotRequest.wage.currency;
  var receiverTitle = userBotRequest.receiverTitle;

  userBotRequest.sentTelegramMessageLogList.forEach(function(sentTelegramMessageLog){
    var view = ioc.customerViewList.pendingDeliveryRemittanceView.getView(botToken, sentTelegramMessageLog.messageId, distributorCompanyUser, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle);
    ioc.notifyManager.updateView(view);
  });

}

function showPenddingDeliveryForDistributorCompanyUser(botToken, userBotRequest){
  var distributorCompanyUserTelegramSystemRefId = userBotRequest.distributorCompany.owner.telegramSystemRefId;
  ioc.userManager.get(distributorCompanyUserTelegramSystemRefId)
    .then(function(foundOwnerOfDistributorCompany){
      var messageId = userBotRequest.distributorCompanyMessageId;
      var intermediateCompany = userBotRequest.intermediateCompany;
      var price = userBotRequest.price;
      var currency = userBotRequest.currency;
      var wagePrice = userBotRequest.wage.wagePrice;
      var wageCurrency = userBotRequest.wage.currency;
      var receiverTitle = userBotRequest.receiverTitle;

      var view = ioc.adminViewList.pendingDeliveryRemittanceDistributorView.getView(botToken, foundOwnerOfDistributorCompany, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle);
      ioc.notifyManager.updateView(view);
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function getCompanyWithNameFromList(companyList, selectedCompanyName){
  var result = companyList.find(function(company){
    if(company.name == selectedCompanyName){
      return company;
    }
  });
  return result;
}

function getCurrencyWithCodeFromList(currencyList, selectedCurrencyCode){
  var result = currencyList.find(function(currency){
    var currencyTextValue = currency.imoji + ' ' + currency.code;
    if(currencyTextValue == selectedCurrencyCode){
      return currency;
    }
    
  });
  return result;
}

function processTextMessage(botToken, user, message, intermediateCompany){
  return new Promise(function(resolve, reject) {
    ioc.userBotRemittanceManager.getOrCreate_user_botToken(user, botToken, intermediateCompany)
      .then(function(foundUserBotRemittance){
        if(foundUserBotRemittance){
          console.log('foundUserBotRemittance');
          console.log(foundUserBotRemittance);
        }else{
          console.log('❌❌❌ NOT foundUserBotRemittance');
        }
        if(foundUserBotRemittance.stateCode == 1){
          ioc.userBotRemittanceManager.setStateCode(foundUserBotRemittance, 2)
            .then(function(updatedUserBotRemittance){
              var intermediateCompanyUser =  updatedUserBotRemittance.user;
              showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        } else if (foundUserBotRemittance.stateCode == 2) {
          var selectedActionTitle = message.text;
          if(selectedActionTitle){
            if( selectedActionTitle == 'طلب تسلیم الحوالة' ) {
              processCreateRequestForIntermediateCompany(botToken, foundUserBotRemittance);
            } else {
              var intermediateCompanyUser = foundUserBotRemittance.user;
              showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser);
            }
          } else {
            var intermediateCompanyUser = foundUserBotRemittance.user;
            showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser);
          }

        } else if (foundUserBotRemittance.stateCode == 4) {
          console.log(message);
          //iphone persain keyboard
          var remittancePriceString = message.text.toString().replace(/۰/g,0).replace(/۱/g,1).replace(/۲/g,2).replace(/۳/g,3).replace(/۴/g,4).replace(/۵/g,5).replace(/۶/g,6).replace(/۷/g,7).replace(/۸/g,8).replace(/۹/g,9);
          //iphone arabic keyboard
          remittancePriceString = remittancePriceString.toString().replace(/٠/g,0).replace(/١/g,1).replace(/٢/g,2).replace(/٣/g,3).replace(/٤/g,4).replace(/٥/g,5).replace(/٦/g,6).replace(/٧/g,7).replace(/٨/g,8).replace(/٩/g,9);
          console.log(remittancePriceString);
          var remittancePriceNumber = parseInt(remittancePriceString);
          if(remittancePriceNumber){
            processSetRequestPriceForIntermediateCompanyUser(botToken, foundUserBotRemittance, remittancePriceNumber);
          }else{
            processInvalidPriceForIntermediateCompanyUser(botToken, foundUserBotRemittance);
          }
        } else if (foundUserBotRemittance.stateCode == 5) {
          ioc.coreApiManager.getDisterbutorCompanyCurrencyList(botToken, foundUserBotRemittance.user._id, foundUserBotRemittance.distributorCompany._id)
            .then(function(currencyList){
              var remittanceCurrencyString = message.text;
              if(remittanceCurrencyString){
                var selectedRemittanceCurrency =  getCurrencyWithCodeFromList(currencyList, remittanceCurrencyString);
                if(selectedRemittanceCurrency) {
                  processSetRequestCurrencyForIntermediateCompanyUser(botToken, foundUserBotRemittance, selectedRemittanceCurrency);

                }else{
                  showRequestCurrencySelectViewForIntermediateCompanyUser(botToken, foundUserBotRemittance.user, currencyList, foundUserBotRemittance.distributorCompany, foundUserBotRemittance.price)
                }
              }else{
                showRequestCurrencySelectViewForIntermediateCompanyUser(botToken, foundUserBotRemittance.user, currencyList, foundUserBotRemittance.distributorCompany, foundUserBotRemittance.price)
              }
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        } else if (foundUserBotRemittance.stateCode == 6) {
          var receiverTitleString = message.text;
          if(receiverTitleString){
            processSetReceiverTitleForIntermediateCompanyUser(botToken, foundUserBotRemittance, receiverTitleString);
          }else{
            showRequestSetReceiverTitleViewForIntermediateCompanyUser(botToken, foundUserBotRemittance);
          }
        } else if (foundUserBotRemittance.stateCode == 7) {
          var selectedActionString = message.text;
          if(selectedActionString == 'تأیید الحوالة'){
            processConfrimRequestForIntermidiateCompanyUser(botToken, foundUserBotRemittance);
          } else if(selectedActionString == 'الغاء الحوالة'){
            processCancelRequestForIntermidiateCompanyUser(botToken, foundUserBotRemittance);
          } else {
            showConfirmRequestViewToIntermediateCompanyUser(botToken, foundUserBotRemittance);
          }
        } else {
          console.log('❌❌❌we are hare ');
          ioc.userBotRemittanceManager.setStateCode(foundUserBotRemittance, 2)
            .then(function(updatedUserBotRemittance){
              var intermediateCompanyUser = updatedUserBotRemittance.user;
              showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        }

      })
      .catch(function(err){
        console.log(err);
        reject(err);
      });
  });
}

function processSetReceiverTitleForIntermediateCompanyUser(botToken, foundUserBotRequest, receiverTitle){
  ioc.userBotRemittanceManager.setReceiverTitleAndState(foundUserBotRequest,receiverTitle, 7)
    .then(function(updatedUserBotRequestWithReceiverAndState){
      showConfirmRequestViewToIntermediateCompanyUser(botToken, updatedUserBotRequestWithReceiverAndState);
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processSetRequestCurrencyForIntermediateCompanyUser(botToken, userBotRequest, remittanceCurrency) {
  ioc.userBotRemittanceManager.setCurrencyAndState(userBotRequest, remittanceCurrency, 6)
    .then(function(updatedUserBotRequestWithCurrency){
      showRequestSetReceiverTitleViewForIntermediateCompanyUser(botToken, updatedUserBotRequestWithCurrency);
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processSetRequestPriceForIntermediateCompanyUser(botToken, userBotRequest, requestPrice) {
  ioc.userBotRemittanceManager.setPrice(userBotRequest, requestPrice)
    .then(function(updatedUserBotRemittanceWithPrice){
      var intermediateCompanyUserId = updatedUserBotRemittanceWithPrice.user._id;
      var distributorCompanyId = updatedUserBotRemittanceWithPrice.distributorCompany._id;
      ioc.coreApiManager.getDisterbutorCompanyCurrencyList(botToken, intermediateCompanyUserId, distributorCompanyId)
        .then(function(currencyList){
          ioc.userBotRemittanceManager.setStateCode(updatedUserBotRemittanceWithPrice, 5)
            .then(function(updatedUserBotRemittanceState){
              var intermediateCompanyUser = updatedUserBotRemittanceState.user;
              var distributorCompany = updatedUserBotRemittanceState.distributorCompany;
              var price = updatedUserBotRemittanceState.price;
              var messageId = updatedUserBotRemittanceState.messageId;

              showRequestCurrencySelectViewForIntermediateCompanyUser(botToken, intermediateCompanyUser, currencyList, distributorCompany, price, messageId);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        })
        .catch(function(err){
          reject(err);
        });
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processCreateRequestForIntermediateCompany(botToken, userBotRequest) {
  ioc.userBotRemittanceManager.setStateCode(userBotRequest, 4)
    .then(function(updatedUserBotRequest){
      var userId = userBotRequest.user._id;
      ioc.coreApiManager.getCompanyByBotToken(userId, botToken)
        .then(function(company){
          ioc.userBotRemittanceManager.setDistributorCompany(userBotRequest, company)
            .then(function(updatedUserBotRequestWithDistributorCompany){
              var intermediateCompanyUser = updatedUserBotRequestWithDistributorCompany.user;
              var distributorCompany = updatedUserBotRequestWithDistributorCompany.distributorCompany;
              showRemittancePriceViewForIntermediateCompanyUser(botToken, intermediateCompanyUser, distributorCompany);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        })
        .catch(function(err){
          console.log(err);
          reject(err);
        });
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processInvalidPriceForIntermediateCompanyUser(botToken, userBotRequest){
  var intermediateCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  showRemittancePriceViewForIntermediateCompanyUser(botToken, intermediateCompanyUser, distributorCompany);
}

function processConfrimRequestForIntermidiateCompanyUser(botToken, foundUserBotRemittance){
  ioc.coreApiManager.createRemittanceRequest(botToken, foundUserBotRemittance.user._id, foundUserBotRemittance.distributorCompany._id, foundUserBotRemittance.price, foundUserBotRemittance.currency._id, foundUserBotRemittance.receiverTitle, new Date())
    .then(function(createdRequest){
      ioc.userBotRemittanceManager.setConfirmedRemittance(foundUserBotRemittance, createdRequest)
        .then(function(updatedUserBotRemittanceWithStatusAndState){
          var view = ioc.customerViewList.pendingRequest.getView(botToken, updatedUserBotRemittanceWithStatusAndState.user, updatedUserBotRemittanceWithStatusAndState.distributorCompany, updatedUserBotRemittanceWithStatusAndState.price, updatedUserBotRemittanceWithStatusAndState.currency, updatedUserBotRemittanceWithStatusAndState.receiverTitle);
          ioc.notifyManager.sendNewRemittance(view)
            .then(function(response){
              var newRemittanceMessageId = response.result.message_id;
              ioc.userBotRemittanceManager.setTelegramMessageId(updatedUserBotRemittanceWithStatusAndState, newRemittanceMessageId)
                .then(function(updatedUserBotRemittanceWithMessageId){
                  var intermediateCompanyUser = updatedUserBotRemittanceWithMessageId.user;
                  showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser);
                  showNewRequestForDistributorCompanyUser(botToken, updatedUserBotRemittanceWithMessageId);
                })
                .catch(function(err){
                  console.log(err);
                  reject(err);
                });
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        })
        .catch(function(err){
          console.log(err);
          reject(err);
        });
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processCancelRequestForIntermidiateCompanyUser(botToken, foundUserBotRemittance){
  ioc.userBotRemittanceManager.setStatusWithStateCode(foundUserBotRemittance, 'canceled', 1)
    .then(function(updatedUserBotRemittanceWithStatusAndState){
      var view = ioc.customerViewList.cancelRequest.getView(botToken, updatedUserBotRemittanceWithStatusAndState.user, updatedUserBotRemittanceWithStatusAndState.distributorCompany, updatedUserBotRemittanceWithStatusAndState.price, updatedUserBotRemittanceWithStatusAndState.currency, updatedUserBotRemittanceWithStatusAndState.receiverTitle);
      ioc.notifyManager.sendNewRemittance(view)
        .then(function(response){
          var newRemittanceMessageId = response.result.message_id;
          ioc.userBotRemittanceManager.setTelegramMessageId(updatedUserBotRemittanceWithStatusAndState, newRemittanceMessageId)
            .then(function(updatedUserBotRemittanceWithMessageId){
              var intermediateCompanyUser = updatedUserBotRemittanceWithMessageId.user;
              showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        })
        .catch(function(err){
          console.log(err);
          reject(err);
        });
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function showConfirmRequestViewToIntermediateCompanyUser(botToken, userBotRequest) {
  var intermediateCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var receiverTitle = userBotRequest.receiverTitle;

  var view = ioc.customerViewList.confirmRequest.getView(botToken, intermediateCompanyUser, distributorCompany, price, currency, receiverTitle);
  ioc.notifyManager.sendNewRemittance(view);
}

function showRemittancePriceViewForIntermediateCompanyUser(botToken, intermediateCompanyUser, distributorCompany){
  var view = ioc.customerViewList.remittancePrice.getView(botToken, intermediateCompanyUser, distributorCompany);
  ioc.notifyManager.sendNewRemittance(view);
}

function showRequestCurrencySelectViewForIntermediateCompanyUser(botToken, intermediateCompanyUser, currencyList, distributorCompany, price, messageId) {
  var view = ioc.customerViewList.remittanceCurrencySelect.getView(botToken, intermediateCompanyUser, currencyList, distributorCompany, price, messageId);
  ioc.notifyManager.sendNewRemittance(view);
}

function showRequestSetReceiverTitleViewForIntermediateCompanyUser(botToken, userBotRequest){
  var intermediateCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;

  var view = ioc.customerViewList.receiverTitle.getView(botToken, intermediateCompanyUser, distributorCompany, price, currency);
  ioc.notifyManager.sendNewRemittance(view);
}

function showActionListFroIntermediateComapnyUser(botToken, intermediateCompanyUser){
  var view = ioc.customerViewList.actionSelect.getView(botToken, intermediateCompanyUser);
  ioc.notifyManager.sendNewRemittance(view);
}

function showNewRequestForDistributorCompanyUser(botToken, userBotRequest) {
  ioc.userManager.get(userBotRequest.distributorCompany.owner.telegramSystemRefId)
    .then(function(foundOwnerOfDistributorCompany){
      console.log('foundOwnerOfDistributorCompany');
      console.log(foundOwnerOfDistributorCompany);

      var intermediateCompany = userBotRequest.intermediateCompany;
      var price = userBotRequest.price;
      var currency = userBotRequest.currency;
      var receiverTitle = userBotRequest.receiverTitle;
      var requestCoreRefId = userBotRequest.requestCoreRefId;

      var view = ioc.adminViewList.wageRequest.getView(botToken, foundOwnerOfDistributorCompany, intermediateCompany, price, currency, receiverTitle, requestCoreRefId);
      ioc.notifyManager.sendNewRemittance(view)
        .then(function(response){
          var distributorCompanyMessageId = response.result.message_id;
          console.log('response');
          console.log(distributorCompanyMessageId);
          console.log(requestCoreRefId);
          ioc.userBotRemittanceManager.setDistributorCompanyMessageId(requestCoreRefId ,distributorCompanyMessageId)
            .then(function(updatedUserBotRequestWithDistributorCompanyMessageId){
              console.log('updatedUserBotRequestWithDistributorCompanyMessageId');
              console.log(updatedUserBotRequestWithDistributorCompanyMessageId);
            })
            .catch(function(err){
              console.log(err);
              reject(err);
            });
        })
        .catch(function(err){
          console.log(err);
          reject(err);
        });
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function processAdminTextMessage(botToken, user, message){
  return new Promise(function(resolve, reject) {
    var selectedActionTitle = message.text;
    if(selectedActionTitle == 'دریافت فایل'){
      ioc.coreApiManager.getRemittanceList(botToken, user._id)
        .then(function(remittanceList){
          console.log('remittanceList');
          console.log(remittanceList);
          ioc.notifyManager.sendRemittanceList(botToken, user, remittanceList);
        })
        .catch(function(err){
          console.log(err);
          reject(err);
        });
    }else{
      var view = ioc.adminViewList.actionSelectDistributorView.getView(botToken, user);
      ioc.notifyManager.sendNewRemittance(view);
    }
  });
}

function processMesssage(botToken, message){
  return new Promise(function(resolve, reject) {
    var telegramId = message.from.id;
    var firstname = message.from.first_name;
    var lastname = message.from.last_name;
    var username = message.from.username;
    var language_code = message.from.language_code;
    ioc.userManager.findOrCreate_telegramId(telegramId, firstname, lastname, username, language_code)
      .then(function(user){
        console.log('processMesssage ');
        console.log(user);
        ioc.coreApiManager.checkAccess(botToken, user._id)
          .then(function(access){
            console.log('access');
            console.log(access);
            if(message.text){
              if(access.role == 'admin'){
                resolve(processAdminTextMessage(botToken, user, message));
              }else if(access.role == 'coWorker'){
                var intermediateCompany = access.company;
                resolve(processTextMessage(botToken, user, message, intermediateCompany));
              }else {
                console.log('what happend');
              }

            }
          })
          .catch(function(err){
            console.log(err);
            reject(err);
          });
      })
      .catch(function(err){
        console.log(err);
        reject(err);
      });
  });
}


exports = module.exports = function(){
  this.processMesssage = processMesssage;
  this.processCallBackQuery = processCallBackQuery;
};
