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
      this.viewModel.currentUser = {
        uid: user.uid,
        displayName: user.providerData[0].displayName,
        profilePicture: user.providerData[0].photoURL
      };
      var userRef = walker.database.ref('users/' + user.uid);
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
      var provider = new fbase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      fbase.auth().signInWithPopup(provider).
        then(function(result) {
          walker.assignUser(result.user);
          callback();
        }).
        catch(function(reason) {
          console.error("error: ", reason);
        })
    },

    updateUI: function() {
      // bind with Handlebars
      var src = document.getElementById('maincontent_t').innerHTML;
      var template = hb.compile(src);
      var output = template(walker.viewModel);

      var placeholder = document.getElementById('maincontent');
      placeholder.innerHTML = output;

      // create chart with circliful
      $('#daily-goal').circliful({
        animationStep: 5,
        foregroundBorderWidth: 40,
        backgroundBorderWidth: 40,
        foregroundColor: 'green',
        percent: 72
      });
    }
  }  
})(jQuery, firebase, Handlebars);

$(document).ready(function() {

  var now = new Date();
  console.log(now.toLocaleDateString('en-US'));
  console.log(now.getHours());

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle(walker.updateUI);
  });
});
