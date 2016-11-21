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

    assignUser: function(user) {
      this.currentUser = user;
      console.log(user);
      usersRef = this.database.child('users');
      usersRef.child(user.uid).once('value', function(snapshot) {
        if(snapshot.val() === null) {
          usersRef.put(user.uid, {
            uid: user.uid
          });
        }
      })
    },

    watchForUpdates: function() {
      if(this.viewModel.currentUser) {
        var stepsCountsRef = this.database.ref('steps-data/' + currentUser);
        stepsCountsRef.on("value", function(snapshot) {
          console.log(JSON.stringify(snapshot));
        });
      }
    },

    loginViaGoogle: (function() {
      var provider = new fbase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      fbase.auth().signInWithPopup(provider).then(function(result) { 
        this.assignUser(result.user);
      }).catch(function(error) {
        console.log("error: ", error);
      })
    }),

    updateUI: function() {
      if(this.viewModel.currentUser) {
        // Update UI
      }
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
    walker.updateUI();
    console.log(walker.viewModel);
  });
});
