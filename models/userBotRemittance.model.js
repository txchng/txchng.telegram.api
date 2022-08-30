var mongoose = require('mongoose');

var UserBotRemittanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  botToken: String,
  distributorCompany: mongoose.Schema.Types.Mixed,
  intermediateCompany: mongoose.Schema.Types.Mixed,
  currency: mongoose.Schema.Types.Mixed,
  price:  Number,
  receiverTitle: String,
  wage: mongoose.Schema.Types.Mixed,
  stateCode: { type: Number, default: 1 },
  createAt: { type: Date, default: Date.now },
  status: { type: String, default: 'new' }, //new, trashed, confirmed, accepted , waged, rejected, timeout, delivered, reverse
  messageId: Number, // for intermidiate company
  distributorCompanyMessageId: Number,
  requestCoreRefId: mongoose.Schema.Types.ObjectId,
  requestCoreRef: mongoose.Schema.Types.Mixed,
  remittanceCoreRefId: mongoose.Schema.Types.ObjectId,
  remittanceCoreRef: mongoose.Schema.Types.Mixed,
  sentTelegramMessageLogList: [mongoose.Schema.Types.Mixed],
});

module.exports = mongoose.model('UserBotRemittance', UserBotRemittanceSchema);

// intermidiateCompany[new] -> intermidiateCompany[trashed] X
//                         \-> intermidiateCompany[confirmed] -> distributorCompany[rejected] X
//                                                           \-> distributorCompany[waged] -> intermidiateCompany[canceled] X
//                                                                                        \-> intermidiateCompany[accepted] -> distributorCompany[delivered] X
//                                                                                                                         \-> system[timeout] X
//                                                                                                                         \-> distributorCompany[reverse] X
