var walker = (function($, fbase) {
  
  return {
    viewModel: (function() {

      return {
        currentUser: fbase.auth().currentUser
      };
    })(),
    loginViaGoogle: function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithPopup(provider).then(function(result) { 
        console.log("user: ", result.user);
      }).catch(function(error) {
        console.log("error: ", error);
      });
    }
  }
})(jQuery, firebase);

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle();
  });
});
