var walker = (function($, fbase) {
  
  return {
    viewModel: {
      currentUser: undefined
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
    }
  }
})(jQuery, firebase);

$(document).ready(function() {

  $('#loginLink').click(function(e) {
    e.preventDefault();
    walker.loginViaGoogle();
  });
});
