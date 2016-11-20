var walker = (function($, fbase, hb) {
  
  var firebaseConfig = {
    apiKey: "AIzaSyDE4EuRBm56SDJXxJS9omvsIDL5yFhQkck",
    authDomain: "walker-firebase.firebaseapp.com",
    databaseURL: "https://walker-firebase.firebaseio.com",
    storageBucket: "walker-firebase.appspot.com",
    messagingSenderId: "545290483394"
  };

  fbase.initializeApp(firebaseConfig);

  var initialViewModel =  {
      currentUser: undefined,
      stepCounts: [],
      stepGoals:  []
    };

  return {
    database: fbase.database(),

    viewModel: function() { return initialViewModel; },

    watchForUpdates: function() {
      if(this.viewModel.currentUser) {
        var stepsCountsRef = this.database.ref('steps-data/' + currentUser);
        stepsCountsRef.on("value", function(snapshot) {
          console.log(JSON.stringify(snapshot));
        });
      }
    },

    loginViaGoogle: function() {
      var provider = new fbase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      fbase.auth().signInWithPopup(provider).then(function(result) { 
        console.log("user: ", result.user);
        this.viewModel.currentUser = result.user;
      }).catch(function(error) {
        console.log("error: ", error);
        this.viewModel.currentUser = undefined;
      });
    },

    updateUI: function() {
      if(this.viewModel.currentUser) {
        // Update UI
      }
    }
  }
})(jQuery, firebase, Handlebars);

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle();
    walker.updateUI();
  });
});
