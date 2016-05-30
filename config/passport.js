var LocalStrategy = require("passport-local").Strategy;
var User          = require("../models/user");

module.exports = function(passport) {

  passport.use('local-signup', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  }, function(req, email, password, done) {

    User.findOne({ 'local.email' : email }, function(err, user) {
      if (err) return done(err, false, { message: "Something went wrong." });

      if (user) return done(null, false, { message: "Please choose another email." });

      var newUser            = new User();
      newUser.local.email    = email;
      newUser.local.username = req.body.username;
      newUser.local.fullname = req.body.fullname;
      newUser.local.image    = req.body.image;
      newUser.local.password = User.encrypt(password);

      newUser.save(function(err, user) {
        console.log(err);
        if (err) return done(err, false, { message: "Something went wrong." });

        return done(null, user);
      });
    });
  }));
};
