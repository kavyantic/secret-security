var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local')

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done("No user found with this username", false); }
      console.log(user.password+" "+password);
      console.log(user.passport==password)
      if (!(user.password == password)) { return done("Password did not match", false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  

// passport.use(new LocalStrategy({
//   usernameField: 'user[email]',
//   passwordField: 'user[password]'
// }, function(email, password, done) {
//   User.findOne({email: email}).then(function(user){
//     if(!user || !user.validPassword(password)){
//       return done(null, false, {errors: {'email or password': 'is invalid'}});
//     }

//     return done(null, user);
//   }).catch(done);
// }));

