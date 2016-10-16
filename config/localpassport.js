var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

module.exports = function(passport) {

    //passport need to serialize and deserialize user object for authentication
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //middleware for signup
    passport.use('signup', new LocalStrategy({
            //override username field with email field
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {

            //Due to asynchronous nature, process.nextTick to ensure findOne() method
            //will fire only the data is arrived
            process.nextTick(function() {

                //make sure registered user is not in db yet
                User.findOne({'email' :  email }, function(err, user) {
                    //error handling
                    if (err) return done(err);

                    // check if user already exists
                    if (user) {
                        return done(null, false, req.flash('registerMessage', 'The email is already existed!'));
                    } else {
                        //all good to go
                        var newUser = new User();

                        newUser.name = req.params.name;
                        newUser.email = email;
                        newUser.password = newUser.encryptPassword(password);

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }//end if-else

                });//end findOne()

            });//end process.nextTick()

        }));


    //middleware for signin
    passport.use('signin', new LocalStrategy({
            //override username field with email field
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            //look for user with email = email
            User.findOne({ 'email' :  email }, function(err, user) {
                //error handling
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Incorrect email!'));

                //if password is not matched
                if (!user.validatePassword(password))
                    return done(null, false, req.flash('loginMessage', 'Incorrect password!')); // create the loginMessage and save it to session as flashdata

                //all good to go
                return done(null, user);
            });

        }));

};//end module.exports
