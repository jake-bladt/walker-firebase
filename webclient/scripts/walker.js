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
      this.viewModel.currentUser = user;
      console.log("uid: ", this.viewModel.currentUser.uid);
      var usersRef = this.database.ref('users'); 
      var userRef = usersRef.child(user.uid);
      userRef.once('value', function(snapshot) {
        if(snapshot.val() === null) {
          usersRef.put(user.uid, {
            uid: user.uid
          });
        }
      })
    },

    viewModel: {
      currentUser: undefined,
      stepCounts: [],
      stepGoals:  []
    },

    loginViaGoogle: function() {
      var provider = new fbase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      fbase.auth().signInWithPopup(provider).
        then(function(result) {
          walker.assignUser(result.user);
        }).
        catch(function(reason) {
          console.log("error: ", reason);
        })
    }
  }  
})(jQuery, firebase, Handlebars);

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle();
  });
});
