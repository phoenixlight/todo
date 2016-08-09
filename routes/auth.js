module.exports = function(app, passport) {


app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginFailure'
  })
);

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res) {
  console.log(req.user);
  res.send('Successfully authenticated');
  // console.log(req.user);/
  // res.render('./client/todo.html');
});



};