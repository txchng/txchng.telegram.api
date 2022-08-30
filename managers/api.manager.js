
const iocManagerFile = require('./ioc.manager');
var ioc = new iocManagerFile({});

function notifyRequest(destributorCompany, destributorCompanyOwner, intermediateCompany, price, currency, receiverTitle, requestCoreRefId){
  return new Promise(function(resolve, reject) {
    ioc.userManager.get(destributorCompanyOwner.telegramSystemRefId)
      .then(function(foundDestributorCompanyOwnerUser){
        var confirmRequestView = ioc.adminViewList.wageRequest.getView(destributorCompany.telegramBotToken, foundDestributorCompanyOwnerUser, intermediateCompany, price, currency, receiverTitle, requestCoreRefId);
        ioc.notifyManager.notifyNewRequesToOwner(confirmRequestView)
          .then(function(response){
            console.log(response);
            var distributorCompanyMessageId = response.result.message_id;
            ioc.userBotRemittanceManager.setDistributorCompanyMessageId(requestCoreRefId, distributorCompanyMessageId)
              .then(function(updatedUserBotRemittanceManagerWithDistributorCompanyMessageId){
                resolve(updatedUserBotRemittanceManagerWithDistributorCompanyMessageId);
              })
              .catch(function(err){
                console.log(err);
                reject(err);
              })
          })
          .catch(function(err){
            console.log(err);
            reject(err);
          })
      })
      .catch(function(err){
        reject(err);
      })
  });
}

function wagedRequest(request){
  return new Promise(function(resolve, reject) {
    ioc.userBotRemittanceManager.setWageAndRequestCore(request)
      .then(function(updatedUserBotRemittance){
        console.log('updatedUserBotRemittance');
        console.log(updatedUserBotRemittance);
        processUpdateWagedRequestToDistributor(updatedUserBotRemittance);
        processWagedRequestToIntermidiateCompany(updatedUserBotRemittance);
        resolve(updatedUserBotRemittance);
      })
      .catch(function(err){
        reject(err);
      });
  });
}

function rejectedRequest(request){
  return new Promise(function(resolve, reject) {
    ioc.userBotRemittanceManager.setRejectedRequestAndRequestCore(request)
      .then(function(updatedUserBotRemittance){
        console.log('updatedUserBotRemittance');
        console.log(updatedUserBotRemittance);
        showRejectedRequestToDistributor(updatedUserBotRemittance);
        showRejectedRequestToIntermediateCompany(updatedUserBotRemittance);
        resolve(updatedUserBotRemittance);
      })
      .catch(function(err){
        reject(err);
      });
  });
}

function reversedRemittance(remittanceCoreRef) {
  return new Promise(function(resolve, reject) {
    ioc.userBotRemittanceManager.reverseRemittance(remittanceCoreRef)
    .then(function(updatedUserBotRequest){
      showReversedRemittanceToIntermediateCompany(updatedUserBotRequest);
      showReversedRemittanceToDistributor(updatedUserBotRequest);
      resolve(updatedUserBotRequest);
    })
    .catch(function(err){
      reject(err);
    });
  });
}

function deliveredRemittance(remittanceCoreRef) {
  return new Promise(function(resolve, reject) {
    ioc.userBotRemittanceManager.deliveredRemittance(remittanceCoreRef)
    .then(function(updatedUserBotRequest){
      console.log('updatedUserBotRequest');
      console.log(updatedUserBotRequest);
      showDeliveredRemittanceToDistributor(updatedUserBotRequest);
      showDeliveredRemittanceToIntermediateCompany(updatedUserBotRequest);
      resolve(updatedUserBotRequest);
    })
    .catch(function(err){
      reject(err);
    });
  });
}

function processUpdateWagedRequestToDistributor(userBotRemittance) {
  var botToken = userBotRemittance.distributorCompany.telegramBotToken;
  var messageId = userBotRemittance.distributorCompanyMessageId;
  var intermediateCompany = userBotRemittance.intermediateCompany;
  var price = userBotRemittance.price;
  var currency = userBotRemittance.currency;
  var wagePrice = userBotRemittance.wage.wagePrice;
  var wageCurrency = userBotRemittance.wage.currency;
  var receiverTitle = userBotRemittance.receiverTitle;
  var requestCoreRefId = userBotRemittance.requestCoreRefId;
  var ownerTelegramSystemRefId = userBotRemittance.distributorCompany.owner.telegramSystemRefId;

  ioc.userManager.get(ownerTelegramSystemRefId)
    .then(function(foundOwnerOfDistributorCompany){
      var distributorCompanyView = ioc.adminViewList.accpetedRequest.getView(botToken, foundOwnerOfDistributorCompany, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
      ioc.notifyManager.updateView(distributorCompanyView)
        .then(function(response){
          console.log(response);
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

function processWagedRequestToIntermidiateCompany(userBotRequest) {
  var botToken = userBotRequest.distributorCompany.telegramBotToken;
  var messageId = userBotRequest.messageId;
  var intermediateCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var wagePrice = userBotRequest.wage.wagePrice;
  var wageCurrency = userBotRequest.wage.currency;
  var receiverTitle = userBotRequest.receiverTitle;
  var requestCoreRefId = userBotRequest.requestCoreRefId;

  var view = ioc.customerViewList.wagedRequestView.getView(botToken, messageId, intermediateCompanyUser, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
  ioc.notifyManager.updateWagedRequestToIntermidiateCompany(view)
    .then(function(sendMessageResponseLogList){
      console.log(sendMessageResponseLogList);
      ioc.userBotRemittanceManager.updateSentTelegramMessageLogList(userBotRequest._id,sendMessageResponseLogList)
        .then(function(updatedUserBotRemittance){
          console.log(updatedUserBotRemittance);
        })
        .catch(function(err){
          reject(err);
        });
    })
    .catch(function(err){
      console.log(err);
    });
}

function showRejectedRequestToDistributor(userBotRemittance) {
  var botToken = userBotRemittance.distributorCompany.telegramBotToken;
  var messageId = userBotRemittance.distributorCompanyMessageId;
  var intermediateCompany = userBotRemittance.intermediateCompany;
  var price = userBotRemittance.price;
  var currency = userBotRemittance.currency;
  var receiverTitle = userBotRemittance.receiverTitle;
  var requestCoreRefId = userBotRemittance.requestCoreRefId;
  var ownerTelegramSystemRefId = userBotRemittance.distributorCompany.owner.telegramSystemRefId;

  ioc.userManager.get(ownerTelegramSystemRefId)
    .then(function(foundOwnerOfDistributorCompany){
      var distributorCompanyView = ioc.adminViewList.rejectedRequest.getView(botToken, foundOwnerOfDistributorCompany, messageId, intermediateCompany, price, currency, receiverTitle);
      ioc.notifyManager.updateView(distributorCompanyView);
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });


}

function showRejectedRequestToIntermediateCompany(userBotRemittance){
  var botToken = userBotRemittance.distributorCompany.telegramBotToken;
  var messageId = userBotRemittance.messageId;
  var intermediateCompanyUser = userBotRemittance.user;
  var distributorCompany = userBotRemittance.distributorCompany;
  var price = userBotRemittance.price;
  var currency = userBotRemittance.currency;
  var receiverTitle = userBotRemittance.receiverTitle;

  var view = ioc.customerViewList.rejectedRequest.getView(botToken, messageId, intermediateCompanyUser, distributorCompany, price, currency, receiverTitle);
  ioc.notifyManager.updateView(view);
  ioc.notifyManager.replyMessage(view);


}

function showReversedRemittanceToIntermediateCompany(userBotRequest){
  var botToken = userBotRequest.distributorCompany.telegramBotToken;
  var messageId = userBotRequest.messageId;
  var intermediateCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var wagePrice = userBotRequest.wage.wagePrice;
  var wageCurrency = userBotRequest.wage.currency;
  var receiverTitle = userBotRequest.receiverTitle;
  var requestCoreRefId = userBotRequest.requestCoreRefId;

  userBotRequest.sentTelegramMessageLogList.forEach(function(sentTelegramMessageLog){
    var view = ioc.customerViewList.reversedRemittanceView.getView(botToken, sentTelegramMessageLog.messageId, intermediateCompanyUser, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
    ioc.notifyManager.updateView(view);
  });

  var view = ioc.customerViewList.reversedRemittanceView.getView(botToken, messageId, intermediateCompanyUser, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
  ioc.notifyManager.replyMessage(view);

}

function showReversedRemittanceToDistributor(userBotRequest) {
  var botToken = userBotRequest.distributorCompany.telegramBotToken;
  var messageId = userBotRequest.distributorCompanyMessageId;
  var intermediateCompany = userBotRequest.intermediateCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var wagePrice = userBotRequest.wage.wagePrice;
  var wageCurrency = userBotRequest.wage.currency;
  var receiverTitle = userBotRequest.receiverTitle;
  var requestCoreRefId = userBotRequest.requestCoreRefId;
  var ownerTelegramSystemRefId = userBotRequest.distributorCompany.owner.telegramSystemRefId;

  ioc.userManager.get(ownerTelegramSystemRefId)
    .then(function(foundOwnerOfDistributorCompany){
      var distributorCompanyView = ioc.adminViewList.reversedRemittanceView.getView(botToken, foundOwnerOfDistributorCompany, ownerTelegramSystemRefId.messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
      ioc.notifyManager.updateView(distributorCompanyView);

      var view = ioc.adminViewList.reversedRemittanceView.getView(botToken, foundOwnerOfDistributorCompany, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
      ioc.notifyManager.replyMessage(view)
      .then(function(sendMessageResponse){
        var succeedSendMessageResponseLogList = [{
          type:'sendReversedRemittance',
          target:'intermediateCompany',
          date: new Date(),
          result:'sent',
          messageId: sendMessageResponse.result.message_id,
        }];

        ioc.userBotRemittanceManager.updateSentTelegramMessageLogList(userBotRequest._id,succeedSendMessageResponseLogList)
        .then(function(updatedUserBotRemittance){
          console.log(updatedUserBotRemittance);
        })
        .catch(function(err){
          reject(err);
        });
      })
      .catch(function(err){
        var failedSendMessageResponseLogList = [{
          type:'sendReversedRemittance',
          target:'intermediateCompany',
          date: new Date(),
          result:'failed',
          error: JSON.stringify(err),
        }];

        ioc.userBotRemittanceManager.updateSentTelegramMessageLogList(userBotRequest._id,failedSendMessageResponseLogList)
        .then(function(updatedUserBotRemittance){
          reject(err);
        })
        .catch(function(dbErr){
          reject(dbErr);
        });

      });
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });

}

function showDeliveredRemittanceToIntermediateCompany(userBotRequest) {
  var botToken = userBotRequest.distributorCompany.telegramBotToken;
  var messageId = userBotRequest.messageId;
  var intermediateCompanyUser = userBotRequest.user;
  var distributorCompany = userBotRequest.distributorCompany;
  var price = userBotRequest.price;
  var currency = userBotRequest.currency;
  var wagePrice = userBotRequest.wage.wagePrice;
  var wageCurrency = userBotRequest.wage.currency;
  var receiverTitle = userBotRequest.receiverTitle;
  var requestCoreRefId = userBotRequest.requestCoreRefId;

  userBotRequest.sentTelegramMessageLogList.forEach(function(sentTelegramMessageLog){
    var view = ioc.customerViewList.deliveredRemittanceView.getView(botToken, sentTelegramMessageLog.messageId, intermediateCompanyUser, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
    ioc.notifyManager.updateView(view);
  });

  var view = ioc.customerViewList.deliveredRemittanceView.getView(botToken, messageId, intermediateCompanyUser, distributorCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
  ioc.notifyManager.replyMessage(view)
    .then(function(sendMessageResponse){

      var succeedSendDeliveredRemittanceMessageResponseLogList = [{
        type:'sendDeliveredRemittance',
        target:'intermediateCompany',
        date: new Date(),
        result:'sent',
        messageId: sendMessageResponse.result.message_id,
      }];

      ioc.userBotRemittanceManager.updateSentTelegramMessageLogList(userBotRequest._id,succeedSendDeliveredRemittanceMessageResponseLogList)
        .then(function(updatedUserBotRemittance){
          console.log(updatedUserBotRemittance);
        })
        .catch(function(err){
          reject(err);
        });
    })
    .catch(function(err){
      var failedSendDeliveredRemittanceMessageResponseLogList = [{
        type:'sendDeliveredRemittance',
        target:'intermediateCompany',
        date: new Date(),
        result:'failed',
        error: JSON.stringify(err),
      }];

      ioc.userBotRemittanceManager.updateSentTelegramMessageLogList(userBotRequest._id,failedSendDeliveredRemittanceMessageResponseLogList)
        .then(function(updatedUserBotRemittance){
          reject(err);
        })
        .catch(function(dbError){
          reject(dbError);
        });

    });

}

function showDeliveredRemittanceToDistributor(userBotRequest) {
  return new Promise(function(resolve, reject) {
    var botToken = userBotRequest.distributorCompany.telegramBotToken;
    var messageId = userBotRequest.distributorCompanyMessageId;
    var intermediateCompany = userBotRequest.intermediateCompany;
    var price = userBotRequest.price;
    var currency = userBotRequest.currency;
    var receiverTitle = userBotRequest.receiverTitle;
    var wagePrice = userBotRequest.wage.wagePrice;
    var wageCurrency = userBotRequest.wage.currency;
    var requestCoreRefId = userBotRequest.requestCoreRefId;
    var ownerTelegramSystemRefId = userBotRequest.distributorCompany.owner.telegramSystemRefId;

    ioc.userManager.get(ownerTelegramSystemRefId)
      .then(function(foundOwnerOfDistributorCompany){
        var distributorCompanyView = ioc.adminViewList.deliveredRemittanceView.getView(botToken, foundOwnerOfDistributorCompany, messageId, intermediateCompany, price, currency, wagePrice, wageCurrency, receiverTitle, requestCoreRefId);
        ioc.notifyManager.updateView(distributorCompanyView);
      })
      .catch(function(err){
        console.log(err);
        reject(err);
      });
  });
}

function notifyAggreedRemittanceReciept(remittance){
  let intermediateCompanyBotToken = remittance.intermediateCompany.telegramBotToken;
  let disterbutorCompanyOwnerTelegramSystemRefId = remittance.distributorCompany.owner.telegramSystemRefId;

  return new Promise(function(resolve, reject) {
    ioc.userManager.get(disterbutorCompanyOwnerTelegramSystemRefId)
      .then(function(foundOwnerOfDistributorCompany){
        var distributorCompanyView = ioc.adminViewList.pendingDeliveryRemittanceDistributorView.getView(intermediateCompanyBotToken, foundOwnerOfDistributorCompany, undefined, remittance.intermediateCompany, remittance.price, remittance.currency, remittance.distributorCompanyWagePrice, remittance.distributorCompanyWageCurrency, remittance.receiver.title, undefined);
        ioc.notifyManager.sendMessage(distributorCompanyView)
          .then(function(response){
            resolve(response);
          })
          .catch(function(err){
            reject(err);
          })
      })
      .catch(function(err){
        console.log(err);
        reject(err);
      });
  });




}

module.exports = exports = function(options){
  this.notifyRequest = notifyRequest;
  this.wagedRequest = wagedRequest;
  this.rejectedRequest = rejectedRequest;
  this.reversedRemittance = reversedRemittance;
  this.deliveredRemittance = deliveredRemittance;
  this.notifyAggreedRemittanceReciept = notifyAggreedRemittanceReciept;
};
