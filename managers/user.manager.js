var User;

function create(telegramId, firstname, lastname, username, language_code){
  var newUser = new User({
    telegramId: telegramId,
    firstname: firstname,
    lastname: lastname,
    username: username,
    language_code: language_code,
  });

  return newUser.save();
}

function findOrCreate_telegramId(telegramId, firstname, lastname, username, language_code){
  return new Promise(function(resolve, reject) {
    var query = { telegramId: telegramId };
    User.findOne(query)
    .then(function(user){
      if(user){
        resolve(user);
      }else{
        create(telegramId, firstname, lastname, username, language_code)
          .then(function(createdUser){
            resolve(createdUser);
          })
          .catch(function(err){
            reject(err);
          });
      }
    })
    .catch(function(err){
      reject(err);
    });
  });
}

function get(userId) {
  var query = { _id: userId };
  return User.findOne(query);
}

exports = module.exports = function(options){
  User = options.userModel;

  this.create = create;
  this.findOrCreate_telegramId = findOrCreate_telegramId;
  this.get = get;
};
