const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Localstrategy = require('passport-local');
//Create local strategy
const localOptions = {
    usernameField: 'email'
};
const localLogin = new Localstrategy(localOptions, function(email, password, done){
    //Verify username and password, if it's correct, call done with user, or else call done with false
    User.findOne({email: email}, function(err, user){
        if(err) { return done(err);}

        if(!user) { return done(null, false);}

        // compare passwords - is 'password' equal to user.password
        user.comparePassword(password, function(err, isMatch){
            if(err) {return done(err);}

            if(!isMatch) { return done(null, false);}

            return done(null, user);
        })
    })
});


//Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create a JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload, done){
    //See if the Userid in payload exists in our DB, if it does, call done with user otherwise call done without a user object
    User.findById(payload.sub, function(err, user){
        if(err) { return done(err, false);}

        if(user){
            done(null, user);
        }
        else{
            done(null, false);
        }

    });
});

//Tell passport to use this stratefy
passport.use(jwtLogin);
passport.use(localLogin);