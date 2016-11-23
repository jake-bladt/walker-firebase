var walker = (function($, fbase, hb) {
  
  var firebaseConfig = {
    apiKey: "AIzaSyDE4EuRBm56SDJXxJS9omvsIDL5yFhQkck",
    authDomain: "walker-firebase.firebaseapp.com",
    databaseURL: "https://walker-firebase.firebaseio.com",
    storageBucket: "walker-firebase.appspot.com",
    messagingSenderId: "545290483394"
  };

  fbase.initializeApp(firebaseConfig);

  return {
    database: fbase.database(),

    loginViaGoogle: function() {
      var provider = new fbase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      fbase.auth().signInWithPopup(provider).
        then(function(result) { 
          this.viewModel.currentUser(result.user);
        }).
        catch(function(reason) {
          console.log("error: ", reason);
        })
    }
  }  
})(jQuery, firebase, Handlebars);

walker.viewModel = {
    currentUser: undefined,
    stepCounts: [],
    stepGoals:  []
  };

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle();
    console.log("viewmodel: ", walker.viewModel);
  });
});
