var axios;

function checkAccess(botToken, userId) {
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/userPosition/checkAccess'
    axios.post(url, {
        tlgrmSystemUserId: userId,
        botToken: botToken,
      })
      .then((res) => {
        var access = res.data.access
        resolve(access);
      })
      .catch((error) => {
        console.error(error)
      })

  });
}

function getDisterbutorCompanyCurrencyList(botToken, userId, disterbutorCompanyId) {
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/company/getCurrencyList'
    axios.post(url, {
        botToken: botToken,
        tlgrmSystemUserId: userId,
        disterbutorCompanyId: disterbutorCompanyId,
      })
      .then((res) => {
        var currencyList = res.data.currencyList
        resolve(currencyList);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })

  });
}

function createRemittanceRequest(botToken, userId, distributorCompanyId, price, currencyId, receiverTitle, requestAt) {
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/request/create'
    var params = {
      botToken: botToken,
      tlgrmSystemUserId: userId,
      distributorCompanyId: distributorCompanyId,
      price: price,
      currencyId: currencyId,
      receiverTitle: receiverTitle,
      requestAt: requestAt,
    };
    axios.post(url, params)
      .then((res) => {
        console.log('here is response');
        var request = res.data.request;
        resolve(request);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })
  });
}

function getCompanyByBotToken(userId, botToken){
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/company/getByBotToken'
    var params = {
      tlgrmSystemUserId: userId,
      botToken: botToken,
    };
    console.log(params);
    axios.post(url, params)
      .then((res) => {
        var company = res.data.company;
        resolve(company);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })
  });
}

function sendAcceptWagedRequest(botToken, intermidiateCompanyActorUserId, requestId){
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/request/acceptWaged'
    var params = {
        tlgrmSystemUserId: intermidiateCompanyActorUserId,
        botToken: botToken,
        requestId: requestId,
    };
    console.log(params);
    axios.post(url, params)
      .then((res) => {
        var remittance = res.data.remittance;
        resolve(remittance);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })
  });
}

function sendCanceledWagedRequest(botToken, intermidiateCompanyActorUserId, requestId) {
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/request/canceledWaged'
    var params = {
        tlgrmSystemUserId: intermidiateCompanyActorUserId,
        botToken: botToken,
        requestId: requestId,
    };
    console.log(params);
    axios.post(url, params)
      .then((res) => {
        var request = res.data.request;
        resolve(request);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })
  });
}

function getRemittanceList(botToken, userId) {
  return new Promise(function(resolve, reject) {
    var url = 'http://116.203.75.73:8003/remittance/list';
    var params = {
        tlgrmSystemUserId: userId,
        botToken: botToken,
    };
    console.log(params);
    axios.post(url, params)
      .then((res) => {
        var remittanceList = res.data.remittanceList;
        resolve(remittanceList);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })
  });
}

exports = module.exports = function(options) {
  axios = options.axios;

  this.checkAccess = checkAccess;
  this.getDisterbutorCompanyCurrencyList = getDisterbutorCompanyCurrencyList;
  this.createRemittanceRequest = createRemittanceRequest;
  this.getCompanyByBotToken = getCompanyByBotToken;
  this.getRemittanceList = getRemittanceList;
  this.sendAcceptWagedRequest = sendAcceptWagedRequest;
  this.sendCanceledWagedRequest = sendCanceledWagedRequest;

};
