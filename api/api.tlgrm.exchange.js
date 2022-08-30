const API_PORT = 8004;
const API_PACKAGE_NAME = 'exchange.tlgrm.api';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

const managerFile = require('../managers/api.manager');
var manager = new managerFile({});

app.get('/isAlive',function(req, res){
  res.json({ type: true, message: API_PACKAGE_NAME +' is alive!' });
});

app.post('/notify/request', function(req, res){
  console.log('we are here now');
  var destributorCompany = req.body.destributorCompany;
  var destributorCompanyOwner = req.body.destributorCompanyOwner;
  var intermediateCompany = req.body.intermediateCompany;
  var price = req.body.price;
  var currency = req.body.currency;
  var receiverTitle = req.body.receiverTitle;
  var requestCoreRefId = req.body.requestCoreRefId;

  manager.notifyRequest(destributorCompany, destributorCompanyOwner, intermediateCompany, price, currency, receiverTitle, requestCoreRefId)
    .then(function(sendResult){
      console.log(sendResult);
      res.json({result: sendResult});
    })
    .catch(function(err){
      processError(res ,err);
    });
});

app.post('/notify/wagedRequest', function(req, res){
  var requestCoreRef = req.body.request;
  console.log('!!!!! we are here for wagedRequest');
  console.log(requestCoreRef);
  manager.wagedRequest(requestCoreRef)
    .then(function(result){
      processSuccess(res, {type: true});
    })
    .catch(function(err){
      processError(res ,err);
    });
});

app.post('/notify/rejectedRequest', function(req, res){
  var requestCoreRef = req.body.request;
  console.log('!!!!! we are here for rejected Request');
  console.log(requestCoreRef);
  manager.rejectedRequest(requestCoreRef)
    .then(function(result){
      processSuccess(res, {type: true});
    })
    .catch(function(err){
      processError(res ,err);
    });
});

app.post('/notify/reversedRemittance', function(req, res){
  var remittanceCoreRef = req.body.remittance;
  manager.reversedRemittance(remittanceCoreRef)
    .then(function(result){
      processSuccess(res, {type: true});
    })
    .catch(function(err){
      processError(res ,err);
    });
});

app.post('/notify/deliveredRemittance', function(req, res){
  var remittanceCoreRef = req.body.remittance;
  manager.deliveredRemittance(remittanceCoreRef)
    .then(function(result){
      processSuccess(res, {type: true});
    })
    .catch(function(err){
      processError(res ,err);
    });
});

app.post('/notify/AggreedRemittanceReciept', function(req, res){
  let remittance = req.body.remittance;// {intermediateCompany: {name ,telegramBotToken} , distibutorCompany: {telegramSystemRefId},  pice,currency:{name, code},distributorCompanyWagePrice, distributorCompanyWageCurrency:{name, code},receiver:{title}}

  console.log(remittance);

  manager.notifyAggreedRemittanceReciept(remittance)
    .then(function(result){
      processSuccess(res, {type: true});
    })
    .catch(function(err){
      processError(res ,err);
    });



})

function processSuccess(res,data){
  res.json(data);
}

function processError(res ,err) {
  console.log(err);
  res.status(400).json({ err: err });
}

app.listen(API_PORT,function(){
  console.log('Init ' + API_PACKAGE_NAME + ' on: ' + API_PORT);
});
