const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Teacher = require('../models/index').Teacher; // Adjust the path based on your file structure


passport.use(new LocalStrategy({
    usernameField: 'code',
    passwordField: 'password'
  },
    function(code, password, done) {
      console.log('USING PASSPORT SETUP');
      console.log(code);
      console.log(password);
        Teacher.findOne({ where: { code: code } })
            .then(user => {
                console.log(user);
                if (!user) {
                    return done(null, false, { message: 'Incorrect code.' });
                }

                bcrypt.compare(password, user.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        console.log(password);
                        console.log(user.password);
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            })
            .catch(err => done(err));
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findByPk(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});
