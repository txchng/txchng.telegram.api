var tlgrmProvider;
var objectsToCsv;
var xl;

function notifyNewRequesToOwner(view){
  return tlgrmProvider.sendMessage(view.botToken, view.user.telegramId, view.message, view.options.reply_markup);
}

function sendNewRemittance(view){
  return tlgrmProvider.sendMessage(view.botToken, view.user.telegramId, view.message, view.options.reply_markup);
}

function updateConfirmedRemittanceStatus(view) {
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, view.options.reply_markup);
}

function updateConfirmedRequsetStatusForDistributor(view){
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, view.options.reply_markup);
}

function updateRejectedRequsetStatusForDistributor(view){
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, view.options.reply_markup);
}

function updateDevileredRemiitanceStatusForDistributor(view){
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, view.options.reply_markup);
}

function updateDevileredRemiitanceStatusForIntermiditeCompany(view){
  tlgrmProvider.replyMessage(view.botToken, view.user.telegramId, view.message, view.options.reply_markup, view.messageId);
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, {});
}

function updatePenddingDeliveryRemittanceForIntermediateCompanyUser(view){
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, view.options.reply_markup);
}

function updateWagedRequestToIntermidiateCompany(view){
  return new Promise(function(resolve, reject) {
    var result = [];
    tlgrmProvider.replyMessage(view.botToken, view.user.telegramId, view.message, view.options.reply_markup, view.messageId)
    .then(function(sendReplayResponse){
      var succeedSendResultItem = {
        type:'sendWagedRequest',
        target:'intermediateCompany',
        date: new Date(),
        result:'sent',
        messageId: sendReplayResponse.result.message_id,
      };
      result.push(succeedSendResultItem);
      tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, {})
        .then(function(editMessageResponse){
          var succeedEditResultItem = {
            type:'updatedWagedRequest',
            target:'intermediateCompany',
            date: new Date(),
            result:'sent',
            messageId: view.messageId,
          };
          result.push(succeedEditResultItem);
          resolve(result);
        })
        .catch(function(err){
          var failedEditResultItem = {
            type:'updatedWagedRequest',
            target:'intermediateCompany',
            date: new Date(),
            result:'failed',
            error: JSON.stringify(err),
          };
          result.push(failedEditResultItem);
          resolve(result);
        });
    })
    .catch(function(err){
      var failedSendResultItem = {
        type:'sendWagedRequest',
        target:'intermediateCompany',
        date: new Date(),
        result:'failed',
        error: JSON.stringify(err),
      };
      result.push(failedSendResultItem);
      resolve(result);
    });
  });
}

function updateView(view){
  return tlgrmProvider.editMessageText(view.botToken, view.user.telegramId, view.messageId, view.message, view.options.reply_markup);
}

function sendMessage(view) {
  return tlgrmProvider.sendMessage(view.botToken, view.user.telegramId, view.message, view.options.reply_markup);
}

function replyMessage(view) {
  return tlgrmProvider.replyMessage(view.botToken, view.user.telegramId, view.message, view.options.reply_markup, view.messageId);
}

function answerCallBackQuery(botToken, callback_query_id, text){
  return tlgrmProvider.answerCallbackQuery(botToken, callback_query_id, text);
}

function sendRemittanceList(botToken, user, remittanceList){
  var clearData = remittanceList.map(function(remittance){
    return {
      _id: remittance._id,
      intermediateCompanyName:remittance.intermediateCompany.name,
      price: remittance.price,
      currency: remittance.currency.ar_name,
      currencyCode: remittance.currency.code,
      receiverTitle: remittance.receiver.user.title,
      requestDate: remittance.requestAt,
      status: remittance.status,
      wagePrice: remittance.distributorCompanyWagePrice,
      wageCurrency: remittance.distributorCompanyWageCurrency.ar_name,
      wageCurrencyCode: remittance.distributorCompanyWageCurrency.code,
    };
  });
  console.log(clearData);
  var filePath = '/projects/exchange/tlgrm/reportTemp/remittanceList'+new Date().valueOf()+'.xlsx';
  createExcelFile(clearData, filePath)
    .then(function(status){
        return tlgrmProvider.sendDocument(botToken, user.telegramId, filePath);
    })
    .catch(function(err){
      console.log(err);
      reject(err);
    });
}

function createExcelFile(remittanceList, filePath){
  return new Promise(function(resolve, reject) {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');

    var myStyle = wb.createStyle({
      font: {
        bold: true,
        color: '#f95444',
      },
    });

    ws.addConditionalFormattingRule('H1:H1000', {
      // apply ws formatting ref 'A1:A10'
      type: 'expression', // the conditional formatting type
      priority: 1, // rule priority order (required)
      formula: 'NOT(ISERROR(SEARCH("accepted", H1)))', // formula that returns nonzero or 0
      style: myStyle, // a style object containing styles to apply
    });
    var style = wb.createStyle({
      alignment: {
        horizontal: 'center',
      },
      font: {
        color: '#000000',
        size: 12,
      },
      border: {
        left: {
            style: 'thin',
            color: '#000000'
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
        outline:true,
      },
      numberFormat: '#,##0.00; (#,##0.00); -',
    });

    var textStyle = wb.createStyle({
      alignment: {
        horizontal: 'center',
      },
      border: {
        left: {
            style: 'thin',
            color: '#000000'
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
        outline:true,
      },
      font: {
        size: 12,
      },
    });

    var headerStyle = wb.createStyle({
      alignment: {
        horizontal: 'center',
      },
      border: {
        left: {
            style: 'medium',
            color: '#000000'
        },
        right: {
            style: 'medium',
            color: '#000000'
        },
        top: {
            style: 'medium',
            color: '#000000'
        },
        bottom: {
            style: 'medium',
            color: '#000000'
        },
        outline:true,
      },
      font: {
        bold: true,
        size: 12,
      },
      fill : {
        type: 'pattern',
        patternType: 'lightUp',
        bgColor: '#98c379',
        fgColor: '#77b54b',
      }
    });

    ws.cell(1, 1).string('id').style(headerStyle)
    ws.row(1).freeze();
    ws.column(1).setWidth(25);
    ws.cell(1, 2).string('intermediateCompanyName').style(headerStyle)
    ws.column(2).setWidth(25);
    ws.cell(1, 3).string('price').style(headerStyle)
    ws.column(3).setWidth(15);
    ws.cell(1, 4).string('currency').style(headerStyle)
    ws.column(4).setWidth(15);
    ws.cell(1, 5).string('currencyCode').style(headerStyle)
    ws.column(5).setWidth(15);
    ws.cell(1, 6).string('receiverTitle').style(headerStyle)
    ws.column(6).setWidth(20);
    ws.cell(1, 7).string('requestDate').style(headerStyle)
    ws.column(7).setWidth(25);
    ws.cell(1, 8).string('status').style(headerStyle)
    ws.column(8).setWidth(10);
    ws.cell(1, 9).string('wagePrice').style(headerStyle)
    ws.column(9).setWidth(10);
    ws.cell(1, 10).string('wageCurrency').style(headerStyle)
    ws.column(10).setWidth(15);
    ws.cell(1, 11).string('wageCurrencyCode').style(headerStyle)
    ws.column(11).setWidth(20);

    for(var rowIndex = 0 ;rowIndex < remittanceList.length ; rowIndex++)
    {
      var cellRowIndex = rowIndex + 2;
      console.log('cellRowIndex');
      console.log(cellRowIndex);
      ws.cell(cellRowIndex, 1).string(remittanceList[rowIndex]._id).style(textStyle)
      ws.cell(cellRowIndex, 2).string(remittanceList[rowIndex].intermediateCompanyName).style(textStyle)
      ws.cell(cellRowIndex, 3).number(remittanceList[rowIndex].price).style(style);
      ws.cell(cellRowIndex, 4).string(remittanceList[rowIndex].currency).style(textStyle)
      ws.cell(cellRowIndex, 5).string(remittanceList[rowIndex].currencyCode).style(textStyle)
      ws.cell(cellRowIndex, 6).string(remittanceList[rowIndex].receiverTitle).style(textStyle)
      ws.cell(cellRowIndex, 7).string(remittanceList[rowIndex].requestDate).style(textStyle)
      ws.cell(cellRowIndex, 8).string(remittanceList[rowIndex].status).style(textStyle)
      ws.cell(cellRowIndex, 9).number(remittanceList[rowIndex].wagePrice).style(style);
      ws.cell(cellRowIndex, 10).string(remittanceList[rowIndex].wageCurrency).style(textStyle)
      ws.cell(cellRowIndex, 11).string(remittanceList[rowIndex].wageCurrencyCode).style(textStyle)
    }
    console.log('finish loop');
    wb.write(filePath,function(err, status){
      if(err){
        reject(err);
      }
      resolve(status)
    });
  });
}

exports = module.exports = function(options) {
  tlgrmProvider = options.tlgrmProvider;
  objectsToCsv = options.objectsToCsv;
  xl = options.xl;

  this.notifyNewRequesToOwner = notifyNewRequesToOwner;
  this.sendNewRemittance = sendNewRemittance;
  this.updateConfirmedRemittanceStatus = updateConfirmedRemittanceStatus;
  this.updateConfirmedRequsetStatusForDistributor = updateConfirmedRequsetStatusForDistributor;
  this.updateRejectedRequsetStatusForDistributor = updateRejectedRequsetStatusForDistributor;
  this.answerCallBackQuery = answerCallBackQuery;
  this.sendMessage = sendMessage;
  this.sendRemittanceList = sendRemittanceList;
  this.updateDevileredRemiitanceStatusForIntermiditeCompany = updateDevileredRemiitanceStatusForIntermiditeCompany;
  this.updateDevileredRemiitanceStatusForDistributor = updateDevileredRemiitanceStatusForDistributor;
  this.updateView = updateView;
  this.sendMessage = sendMessage;
  this.replyMessage = replyMessage;
  this.updatePenddingDeliveryRemittanceForIntermediateCompanyUser = updatePenddingDeliveryRemittanceForIntermediateCompanyUser;
  this.updateWagedRequestToIntermidiateCompany = updateWagedRequestToIntermidiateCompany;
}
