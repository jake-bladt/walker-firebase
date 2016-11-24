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
      var self = this;
      this.viewModel.currentUser = {
        uid: user.uid,
        displayName: user.providerData[0].displayName,
        profilePicture: user.providerData[0].photoURL
      };
      var userRef = self.database.ref('users/' + user.uid);
      userRef.once('value', function(snapshot) {
        if(snapshot.val() === null) {
          userRef.set(walker.viewModel.currentUser);
        }
      })
    },

    viewModel: {
      currentUser: undefined,
      stepCounts: [],
      stepGoals:  []
    },

    loginViaGoogle: function(callback) {
      var self = this;
      var provider = new fbase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      fbase.auth().signInWithPopup(provider).
        then(function(result) {
          self.assignUser(result.user);
          callback();
        }).
        catch(function(reason) {
          console.error("error: ", reason);
        })
    },

    updateUI: function() {
      var self = this;
      var src = document.getElementById('maincontent_t').innerHTML;
      var template = hb.compile(src);
      var output = template(self.viewModel);

      var placeholder = document.getElementById('maincontent');
      placeholder.innerHTML = output;

    }
  }  
})(jQuery, firebase, Handlebars);

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle(walker.updateUI);
  });
});
