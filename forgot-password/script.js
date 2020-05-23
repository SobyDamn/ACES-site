firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //user is logged in send back to home in few second
      document.getElementById("forgot_passwordBTN").disabled = true;
      document.getElementById("passResetErrorHolder").style.display = "block";
      document.getElementById("passResetErrorText").innerText = "Please logout to reset the password!\nSending back to HOME"
      setTimeout(()=>{
          window.location = "../index.html"
      },2000)
    }
    else {
      // User not logged in or has just logged out.
      
    }
  });


function resetPassword() {
    document.getElementById("forgotPassLoader").style.display = "block";
    document.getElementById("forgot_passwordBTN").style.display = "none";
    document.getElementById("successReset").style.display = "none";
    document.getElementById("passResetErrorHolder").style.display = "none";
    var email = document.getElementById("reset_email").value
    if (email == "") {
        document.getElementById("forgotPassLoader").style.display = "none";
        document.getElementById("forgot_passwordBTN").style.display = "block";
        document.getElementById("successReset").style.display = "none";
        document.getElementById("passResetErrorHolder").style.display = "block";
        document.getElementById("passResetErrorText").innerText = "Please enter the registered email!"
    }
    else {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            //success
            document.getElementById("forgotPassLoader").style.display = "none";
            document.getElementById("forgot_passwordBTN").style.display = "block";
            document.getElementById("passResetErrorHolder").style.display = "none";
            document.getElementById("successReset").style.display = "block";
            document.getElementById("successResetEmail").innerText = email;
          }).catch((error)=>{
              //error
              document.getElementById("forgotPassLoader").style.display = "none";
              document.getElementById("forgot_passwordBTN").style.display = "block";
              document.getElementById("successReset").style.display = "none";
              document.getElementById("passResetErrorHolder").style.display = "block";
              document.getElementById("passResetErrorText").innerText = error.message
        })
    }
}