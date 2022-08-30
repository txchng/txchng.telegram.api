const axios = require('axios')
const ObjectsToCsv = require('objects-to-csv')
var FormData = require('form-data');
var fs = require('fs');
var xl = require('excel4node');

//admin view files
var distributorCompanyRequestReceiptView = require('../views/distributorCompany/requestReceipt.view');
var actionSelectDistributorViewFile = require('../views/distributorCompany/actionSelectDistributor.view.js');
var wageRequestDistributorCompanyViewFile = require('../views/distributorCompany/wageRequestDistributorCompany.view.js');
var deliveredRemittanceDistributorViewFile = require('../views/distributorCompany/deliveredRemittanceDistributor.view.js');
var reversedRemittanceDistributorViewFile = require('../views/distributorCompany/reversedRemittanceDistributor.view.js');
var pendingDeliveryRemittanceDistributorViewFile = require('../views/distributorCompany/pendingDeliveryRemittanceDistributor.view');
var accpetedRequestDistributorViewFile = require('../views/distributorCompany/accpetedRequestDistributor.view.js');
var rejectedRequestDistributorViewFile = require('../views/distributorCompany/rejectedRequestDistributor.view.js');
var canceledWagedRequestDistributorCompanyViewFile  = require('../views/distributorCompany/canceledWagedRequestDistributorCompany.view.js');

// Customer View files
var intermediateCompanyRequestReceiptView = require('../views/intermediateCompany/requestReceipt.View');
var actionSelectViewFile = require('../views/intermediateCompany/actionSelect.view');
var remittancePriceViewFile = require('../views/intermediateCompany/remittancePrice.view');
var remittanceCurrencySelectViewFile = require('../views/intermediateCompany/remittanceCurrencySelect.view');
var receiverTitleViewFile = require('../views/intermediateCompany/receiverTitle.view.js');
var cancelRequestViewFile = require('../views/intermediateCompany/cancelRequest.view.js');
var pendingRequestViewFile = require('../views/intermediateCompany/pendingRequest.view.js');
var confirmRequestViewFile = require('../views/intermediateCompany/confirmRequest.view.js');
var deliveredRemittanceViewFile = require('../views/intermediateCompany/deliveredRemittanceView.js');
var reversedRemittanceViewFile = require('../views/intermediateCompany/reversedRemittanceIntermidiate.view.js');
var wagedRequestViewFile = require('../views/intermediateCompany/wagedRequest.view.js');
var pendingDeliveryRemittanceIntermediateCompanyViewFile = require('../views/intermediateCompany/pendingDeliveryRemittanceIntermediateCompany.view.js');
var canceledWagedRequestIntermediateCompanyViewFile  = require('../views/intermediateCompany/canceledWagedRequestIntermediateCompany.view.js');
var rejectedRequestViewFile = require('../views/intermediateCompany/rejectedRequest.view.js');

// models
var DB = require('../models/db');
const UserModel = require('../models/user.model.js');
const UserBotRemittanceModel = require('../models/userBotRemittance.model.js');

// provider Files
const tlgrmProviderFile = require('../providers/tlgrm.prvd');

// provider Object
var tlgrmProvider = new tlgrmProviderFile({ axios: axios , formData: FormData, fs: fs});

// manager Files
const userManagerFile = require('./user.manager');
const userBotRemittanceManagerFile = require('./userBotRemittance.manager');
const coreApiManagerFile = require('./coreApi.manager');
const notifyManagerFile = require('./notify.manager');


// manager Objects
var userManager = new userManagerFile({ userModel: UserModel });
var userBotRemittanceManager = new userBotRemittanceManagerFile({ userBotRemittanceModel: UserBotRemittanceModel });
var coreApiManager = new coreApiManagerFile({ axios: axios });
var notifyManager = new notifyManagerFile({ tlgrmProvider: tlgrmProvider ,objectsToCsv: ObjectsToCsv, xl: xl});





// Admin View Objects
var distributorCompanyRequestReceipt = new distributorCompanyRequestReceiptView();
var actionSelectDistributorView = new actionSelectDistributorViewFile();
var wageRequestDistributorCompanyView = new wageRequestDistributorCompanyViewFile({ requestReceiptView: distributorCompanyRequestReceipt });
var accpetedRequestDistributorView = new accpetedRequestDistributorViewFile({ requestReceiptView: distributorCompanyRequestReceipt });
var rejectedRequestDistributorView = new rejectedRequestDistributorViewFile({ requestReceiptView: distributorCompanyRequestReceipt });
var deliveredRemittanceDistributorView = new deliveredRemittanceDistributorViewFile({ requestReceiptView: distributorCompanyRequestReceipt });
var reversedRemittanceDistributorView = new reversedRemittanceDistributorViewFile({ requestReceiptView: distributorCompanyRequestReceipt });
var pendingDeliveryRemittanceDistributorView = new pendingDeliveryRemittanceDistributorViewFile({ requestReceiptView: distributorCompanyRequestReceipt });
var canceledWagedRequestDistributorCompanyView = new canceledWagedRequestDistributorCompanyViewFile({ requestReceiptView: distributorCompanyRequestReceipt });

// Customer View Objects
var intermediateCompanyRequestReceiptView = new intermediateCompanyRequestReceiptView();
var actionSelectView = new actionSelectViewFile();
var remittancePriceView = new remittancePriceViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var remittanceCurrencySelectView = new remittanceCurrencySelectViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var receiverTitleView = new receiverTitleViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var cancelRequestView = new cancelRequestViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var confirmRequestView = new confirmRequestViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var pendingRequestView = new pendingRequestViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var wagedRequestView = new wagedRequestViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var deliveredRemittanceView = new deliveredRemittanceViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var reversedRemittanceView = new reversedRemittanceViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var pendingDeliveryRemittanceIntermediateCompanyView = new pendingDeliveryRemittanceIntermediateCompanyViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var canceledWagedRequestIntermediateCompanyView = new canceledWagedRequestIntermediateCompanyViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });
var rejectedRequestView = new rejectedRequestViewFile({ requestReceiptView: intermediateCompanyRequestReceiptView });

exports = module.exports = function(){
  this.userManager = userManager;
  this.userBotRemittanceManager = userBotRemittanceManager;
  this.coreApiManager = coreApiManager;
  this.notifyManager = notifyManager;






  this.adminViewList = {};
  this.adminViewList.actionSelectDistributorView = actionSelectDistributorView;
  this.adminViewList.wageRequest = wageRequestDistributorCompanyView;
  this.adminViewList.deliveredRemittanceView = deliveredRemittanceDistributorView;
  this.adminViewList.reversedRemittanceView = reversedRemittanceDistributorView;
  this.adminViewList.pendingDeliveryRemittanceDistributorView = pendingDeliveryRemittanceDistributorView;
  this.adminViewList.accpetedRequest = accpetedRequestDistributorView;
  this.adminViewList.canceledWagedRequest = canceledWagedRequestDistributorCompanyView;
  this.adminViewList.rejectedRequest = rejectedRequestDistributorView;

  this.customerViewList = {};
  this.customerViewList.actionSelect = actionSelectView;
  this.customerViewList.remittancePrice = remittancePriceView;
  this.customerViewList.remittanceCurrencySelect = remittanceCurrencySelectView;
  this.customerViewList.receiverTitle = receiverTitleView;
  this.customerViewList.cancelRequest = cancelRequestView;
  this.customerViewList.pendingRequest = pendingRequestView;
  this.customerViewList.confirmRequest = confirmRequestView;
  this.customerViewList.deliveredRemittanceView = deliveredRemittanceView;
  this.customerViewList.reversedRemittanceView = reversedRemittanceView;
  this.customerViewList.pendingDeliveryRemittanceView = pendingDeliveryRemittanceIntermediateCompanyView;
  this.customerViewList.wagedRequestView = wagedRequestView;
  this.customerViewList.canceledWagedRequest = canceledWagedRequestIntermediateCompanyView;
  this.customerViewList.rejectedRequest = rejectedRequestView;


};
