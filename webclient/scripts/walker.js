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

    getDateId: function() {
      var now = new Date();
      return (now.getYear() + 1900) * 10000 + now.getMonth() * 100 + now.getDate();
    },

    assignUser: function(user) {
      walker.viewModel.currentUser = {
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

    trackTodaysData: function() {
      var user = walker.viewModel.currentUser;
      var dateId = walker.getDateId();

      var stepsRef = walker.database.ref('steps-data/' + user.uid + '/' + dateId);
      stepsRef.on('value', function(snapshot) {
        var snapVal = snapshot.val();
        if(snapVal === null) {
          stepsRef.set(walker.viewModel.today);
        } else {
          walker.viewModel.today = snapVal;
          walker.updateUI();
        }
      });
    },

    viewModel: {
      currentUser: undefined,
      stepCounts: [],
      stepGoals:  [],
      today: {
        stepsCount: 0,
        stepsGoal:  10000
      }
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
      var today = walker.viewModel.today;
      var pct = Math.min(100.0 * today.stepsCount / today.stepsGoal, 100.0);
      $('#daily-goal').circliful({
        animationStep: 5,
        foregroundBorderWidth: 10,
        backgroundBorderWidth: 10,
        foregroundColor: 'green',
        percent: pct
      });
    }
  }  
})(jQuery, firebase, Handlebars);

$(document).ready(function() {

  $('#loginLink').click(function(event) {
    event.preventDefault();
    walker.loginViaGoogle(walker.trackTodaysData);
  });

  $('#steps-count').keyup(function(event) {

  });

});
