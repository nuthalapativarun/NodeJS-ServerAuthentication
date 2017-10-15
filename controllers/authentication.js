const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user){
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timeStamp},config.secret);
}

exports.signin = function(req, res, next){

    //User has already been authenticated, we just need to provide them with a Token
    res.send({token: tokenForUser(req.user)});

}

exports.signup = function(req, res, next){
    console.log("Inside signup");
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error :'You must provide email and password'});
    }

    // See if user with given email exists
    User.findOne({email : email},function(err, existingUser){
        console.log("Inside findone");
        if(err) return next(err);

        //If a user with the email exists, return an error
        if(existingUser){
            return res.status(422).send({error: 'Email already in use'});
        }

        //If the user with an email doesn;t exists, create and save the user record

        const user = new User({email: email, password: password});

        user.save(function(err){
            if(err) { return next(err);}
            //Respond to the request saying that the user is created
            res.json({token: tokenForUser(user)});
        });
    });
    
}