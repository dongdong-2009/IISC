var keystone = require('keystone');
var session = require('keystone/lib/session');
var User = keystone.list('User');
var UserModel = keystone.list('User').model;
var bcrypt = require('bcrypt-nodejs');

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res);
  var locals = res.locals;
  
  // Set locals
  locals.section = 'password';
  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.userSubmitted = false;
  
  view.on('post', { action: 'changePassword' }, function(next) {

    if(!req.body.password_origin) {
      req.flash('error', "The origin password is required");
      return next();
    }
    if(!req.body.password_new) {
      req.flash('error', "The new password is required");
      return next();
    }
    if(!req.body.password_confirm) {
      req.flash('error', "The confirm password is required");
      return next();
    }
    if(req.body.password_new != req.body.password_confirm) {
      req.flash('error', "The new password and confirm password must be the same");
      return next();
    }
    if(req.body.password_new.length < 6){
      req.flash('error', "The new password at least 6 characters");
      return next();
    }
    var newPwdTrim = req.body.password_new.trimLeft().trimRight();
    var conPwdTrim = req.body.password_confirm.trimLeft().trimRight();
    if(newPwdTrim != req.body.password_new || conPwdTrim != req.body.password_confirm){
      req.flash('error', "The password can not be start or end with space blank");
      return next();
    }
    // compare if the origin password is input correctly.
    bcrypt.compare(req.body.password_origin, locals.user.password, function(error,result){
      // compare error
      if(error){
        req.flash('error', "Error occurred");
        return next();
      }
      if(!result){
        req.flash('error', "The origin password is not correct");
        return next();
      }
      bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          req.flash('error', "Error happened");
          return next();
        }
        bcrypt.hash(req.body.password_new, salt, function () {}, function(err, hash) {
          if (err) {
            req.flash('error', "Error happened");
            return next();
          }
          UserModel.update({_id:locals.user.id},{password:hash},function(err){
            if (err) {
              req.flash('error', "DB Update Error");  
              return next();
            }else {
              req.flash('success', "Password changed successfully");
              return next();
            }
          });
        });
      });
    });
  });

  view.render('password');  
};