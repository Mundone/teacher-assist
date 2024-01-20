const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const sequelize = require("../db").sequelize;
const { Sequelize, DataTypes } = require('sequelize');
const User = require('../models/models')(sequelize, DataTypes).User; // Adjust the path based on your file structure


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(email, password, done) {
      console.log('USING PASSPORT SETUP');
      console.log(email);
      console.log(password);
        User.findOne({ where: { email: email } })
            .then(user => {
                console.log(user);
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
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
