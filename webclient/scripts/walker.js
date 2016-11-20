var walker = (function($, fbase) {
  
  var firebaseConfig = {
    apiKey: "AIzaSyDE4EuRBm56SDJXxJS9omvsIDL5yFhQkck",
    authDomain: "walker-firebase.firebaseapp.com",
    databaseURL: "https://walker-firebase.firebaseio.com",
    storageBucket: "walker-firebase.appspot.com",
    messagingSenderId: "545290483394"
  };

  fbase.initializeApp(firebaseConfig);

  return {
    viewModel: {
      currentUser: undefined
    },

    watchForUpdates: function() {

    },

    loginViaGoogle: function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithPopup(provider).then(function(result) { 
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
})(jQuery, firebase);

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle();
    walker.updateUI();
  });
});
