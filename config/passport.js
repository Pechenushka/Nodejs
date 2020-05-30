const passport = require('passport');
const models = require('../database/models/index');
const LocalStrategy =require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    let user=models.User.findAll({raw: true ,where: {id:id}});
    done(null, user);
});


passport.use('local.signup', new LocalStrategy(
    {   usernameField:'email',
        passwordField: 'password',
        passReqToCallback: true
    },  async function (req, email, password,done) {
        console.log('uu');
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
        req.checkBody('password', 'invalid password').notEmpty().isLength({min:3});
        let errors = req.validationErrors();
        if(errors){
            let messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }

        const user = await models.User.findOne({ raw: true, where: { login: email } });

            if (user){
                return done(null, false, {message: 'Email already exist'});
            }

            let newUser = await models.User.create({ login:email,password: password });
            return done(null, newUser);
}));


passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function (req, email, password, done) {
    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    req.checkBody('password', 'invalid password').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        let messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }


    let user = await models.User.findOne({ raw: true, where: { login: email } });

    if (!user){
        return done(null, false, {message: 'No userfound'});
    }

    if(!bcrypt.compareSync(password,user.password)){
        return done(null, false, {message: 'wrong password'});
    }

    return done(null, user);

}));