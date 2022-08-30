var UserBotRemittance;

function create(user, botToken, intermediateCompany){
  return new Promise(function(resolve, reject) {
    var newUserBotRemittance = new UserBotRemittance({
      user: user,
      botToken: botToken,
      intermediateCompany: intermediateCompany,
      stateCode: 2,
    });

    newUserBotRemittance.save()
      .then(function(savedUserBotRemiitance){
        savedUserBotRemiitance.populate('user').execPopulate()
          .then(function(populatedUser){
            resolve(populatedUser);
          })
          .catch(function(err){
            reject(err);
          });
      })
      .catch(function(err){
        reject(err);
      });
  });

}

function getOrCreate_user_botToken(user, botToken, intermediateCompany) {
  return new Promise(function(resolve, reject) {

    var query = {
      user: user,
      botToken: botToken,
      status: 'new',
      intermediateCompany: intermediateCompany,
    };

    UserBotRemittance.findOne(query)
      .populate('user')
      .then(function(foundUserBotRemittance){
        if(foundUserBotRemittance){
          resolve(foundUserBotRemittance);
        }else{
          resolve(create(user, botToken, intermediateCompany));
        }
      })
      .catch(function(err){
        reject(err);
      });
  });

}

function setStateCode(userBotRemittanceId, stateCode) {
  var query = {
    _id: userBotRemittanceId,
  };
  var update = { stateCode: stateCode };
  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setDistributorCompany(userBotRemittanceId, distributorCompany) {
  var query = {
    _id: userBotRemittanceId,
  };

  var update = { $set: { distributorCompany: distributorCompany } };

  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setPrice(userBotRemittanceId, price) {
  var query = {
    _id: userBotRemittanceId,
  };
  var update = { price: price };
  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setCurrencyAndState(userBotRemittanceId, currency, stateCode) {
  var query = {
    _id: userBotRemittanceId,
  };
  var update = { currency: currency , stateCode: stateCode };
  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setWageAndState(userBotRemittanceId, wage, stateCode) {
  var query = {
    _id: userBotRemittanceId,
  };

  var update = {  $set: { wage: wage , stateCode: stateCode}  };
  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setReceiverTitleAndState(userBotRemittanceId, receiverTitle, stateCode) {
  var query = {
    _id: userBotRemittanceId,
  };
  var update = {  $set: { receiverTitle: receiverTitle , stateCode: stateCode}  };
  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setConfirmedRemittance(userBotRemittanceId, coreSytemRequest) {
  var query = {
    _id: userBotRemittanceId,
  }
  const update = {  $set: { status: 'confirmed' , stateCode: 1 , requestCoreRefId: coreSytemRequest._id ,requestCoreRef: coreSytemRequest }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function setStatusWithStateCode(userBotRemittanceId, status, stateCode) {
  var query = {
    _id: userBotRemittanceId,
  }
  const update = {  $set: { status: status , stateCode: stateCode}  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function setTelegramMessageId(userBotRemittanceId, messageId) {
  var query = {
    _id: userBotRemittanceId,
  }
  const update = {  $set: { messageId: messageId }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function acceptByDisterbutorCompany(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'confirmed',
  }
  const update = {  $set: { status: 'accepted' }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function rejectByDisterbutorCompany(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'confirmed',
  }
  const update = {  $set: { status: 'rejected' }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function setDistributorCompanyMessageId(requestCoreRefId ,distributorCompanyMessageId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'confirmed',
  }
  var update = {  $set: { distributorCompanyMessageId:  distributorCompanyMessageId }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function deliveredByDistributorCompany(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'accepted',
  }
  const update = {  $set: { status: 'delivered' }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user')
}

function reverseByDistributorCompany(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'accepted',
  };
  const update = {  $set: { status: 'reverse' }  };
  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user');
}

function getByRequestCoreRefIdy(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
  };

  return UserBotRemittance.findOne(query)
  .populate('user');
}

function setWageAndRequestCore(requestCoreRef){
  var query = {
    requestCoreRefId: requestCoreRef._id,
    status : 'confirmed',
  };

  var updateParams = {
    status: 'waged',
    requestCoreRef: requestCoreRef,
    wage: {
      wagePrice: requestCoreRef.distributorCompanyWagePrice,
      currency: requestCoreRef.distributorCompanyWageCurrency,
    },
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user');
}

function setRejectedRequestAndRequestCore(requestCoreRef){
  var query = {
    requestCoreRefId: requestCoreRef._id,
    status : 'confirmed',
  };

  var updateParams = {
    status: 'rejected',
    requestCoreRef: requestCoreRef,
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user');
}

function acceptedWageByIntermidiateCompany(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'waged',
  };

  var updateParams = {
    status: 'accepted',
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance.findOneAndUpdate(query, update, {new: true})
  .populate('user');
}

function canceledWageByIntermidiateCompany(requestCoreRefId) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'waged',
  };

  var updateParams = {
    status: 'canceled',
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function setRemittance(requestCoreRefId, remittanceCoreRef) {
  var query = {
    requestCoreRefId: requestCoreRefId,
    status : 'accepted',
  };

  var updateParams = {
    remittanceCoreRefId: remittanceCoreRef._id,
    remittanceCoreRef: remittanceCoreRef,
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function reverseRemittance(remittanceCoreRef) {
  var query = {
    remittanceCoreRefId: remittanceCoreRef._id,
    status : 'accepted',
  };

  var updateParams = {
    remittanceCoreRef: remittanceCoreRef,
    status : 'reverse',
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function deliveredRemittance(remittanceCoreRef) {
  var query = {
    remittanceCoreRefId: remittanceCoreRef._id,
    status : 'accepted',
  };

  var updateParams = {
    remittanceCoreRef: remittanceCoreRef,
    status : 'delivered',
  };

  var update = {  $set: updateParams  };

  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true})
    .populate('user');
}

function updateSentTelegramMessageLogList(userBotRemittanceId, logItemList){
  var query = {
    _id: userBotRemittanceId,
  };

  var update = {
    $push: { sentTelegramMessageLogList: logItemList }
  };

  return UserBotRemittance
    .findOneAndUpdate(query, update, {new: true});
}

exports = module.exports = function(options){
  UserBotRemittance = options.userBotRemittanceModel;

  this.getOrCreate_user_botToken = getOrCreate_user_botToken;
  this.setStateCode = setStateCode;
  this.setDistributorCompany = setDistributorCompany;
  this.setPrice = setPrice;
  this.setCurrencyAndState = setCurrencyAndState;
  this.setWageAndState = setWageAndState;
  this.setReceiverTitleAndState = setReceiverTitleAndState;
  this.setStatusWithStateCode = setStatusWithStateCode;
  this.setTelegramMessageId = setTelegramMessageId;
  this.setConfirmedRemittance = setConfirmedRemittance;
  this.acceptByDisterbutorCompany = acceptByDisterbutorCompany;
  this.rejectByDisterbutorCompany = rejectByDisterbutorCompany;
  this.setDistributorCompanyMessageId = setDistributorCompanyMessageId;
  this.deliveredByDistributorCompany = deliveredByDistributorCompany;
  this.reverseByDistributorCompany = reverseByDistributorCompany;
  this.getByRequestCoreRefIdy = getByRequestCoreRefIdy;
  this.setWageAndRequestCore = setWageAndRequestCore;
  this.acceptedWageByIntermidiateCompany = acceptedWageByIntermidiateCompany;
  this.canceledWageByIntermidiateCompany = canceledWageByIntermidiateCompany;
  this.setRejectedRequestAndRequestCore = setRejectedRequestAndRequestCore;
  this.setRemittance = setRemittance;
  this.reverseRemittance = reverseRemittance;
  this.deliveredRemittance = deliveredRemittance;
  this.updateSentTelegramMessageLogList = updateSentTelegramMessageLogList;
};
