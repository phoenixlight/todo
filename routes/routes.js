module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req,res) {
      res.render('index.ejs'); //load the index file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================

  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs',{ 
        message: req.flash('loginMessage') 
      });
  });

  //process the login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login', //redirect to /login if err
      failureFlash : true // allow flash messages
    }));


  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    // res.sendFile(__dirname + '/client/login.html');
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected. must be logged in to visit
  // we will use route middleware to verify this 
  app.get('/profile', isLoggedIn, function(req, res) {
      res.render('todo2.ejs', {
        //getting user info out of session and pass to template
        user: req.user._id, 
        username: req.user.username,
        password: req.user.password,
        todos: req.user.todos
      });
  });


  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}