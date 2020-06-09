var userAvail = null;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User logged in already or has just logged in.
      userAvail = user;
    } 
    else {
      // User not logged in or has just logged out.
      userAvail = null;
    }
  });
function login() {
    //Login user
    document.getElementById("loginErrorHolder").style.display="none";
    document.getElementById("loginBTN").style.display = "none";
    document.getElementById("loginAuthLoader").style.display = "block"
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user)=> {
            if (user) {
                document.getElementById("loginBTN").style.display = "inline-block";
                document.getElementById("loginAuthLoader").style.display = "none"
                closeLoginPop();
            }
        })
        .catch(function(error) {
          showError(error.message,"loginError");
          document.getElementById("loginBTN").style.display = "inline-block";
          document.getElementById("loginAuthLoader").style.display = "none";
        })
}
function registerUser(from) {
    //register user
    document.getElementById("regErrorHolder").style.display="none";
    document.getElementById("registerBTN").style.display = "none";
    document.getElementById("regAuthLoader").style.display = "block"
    var email = document.getElementById("register_email").value;
    var password = document.getElementById("register_password").value;
    var cPassword = document.getElementById("register_cPassword").value;
    if (password == cPassword) {
        //register
        firebase.auth().createUserWithEmailAndPassword(email, password).then((user)=> {
            //save user's profile
            document.getElementById("registerBTN").style.display = "inline-block";
            document.getElementById("regAuthLoader").style.display = "none";
            if (from=="home") {
                window.location = "edit-profile"
            }
            else if (from=="secondChild") {
                window.location = "../edit-profile"
            }
            else {
                window.location = "../../edit-profile"
            }
          }).catch((err)=>{
            showError(err.message,"regError");
            document.getElementById("registerBTN").style.display = "inline-block";
            document.getElementById("regAuthLoader").style.display = "none";
          })
    }
    else {
        //error passwords are different
        document.getElementById("registerBTN").style.display = "inline-block";
        document.getElementById("regAuthLoader").style.display = "none";
        showError("Password is different","regError");
    }
}
function showError(err,type) {
    if (type=="regError") {
        document.getElementById("regErrorHolder").style.display="block";
        document.getElementById("regErrorText").innerText = err;
    }
    else if (type=="loginError") {
        document.getElementById("loginErrorHolder").style.display="block";
        document.getElementById("loginErrorText").innerText = err;
    }
}
function openAdminPanel(from) {
    if (userAvail !=null) {
        if (from == "home") {
            window.location = "adminAuthentication";
        }
        else {
            window.location = "../adminAuthentication";
        }
    }
    else {
        showLoginForm();
    }
}