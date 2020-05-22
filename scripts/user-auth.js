var currUser;
//check user authentication
firebase.auth().onAuthStateChanged(function(user) {
    var nameElement = document.getElementById("userName");
    if (user) {
      // User logged in already or has just logged in.
        document.getElementById("userSignedIN").style.display = "block";
        document.getElementById("userSignedOut").style.display = "none";
        document.getElementById("spin_loader").style.display = "none";
        if (user.photoURL) {
            //display photo if exists
            fetchImage(user.photoURL,user.uid)
        }
        currUser = user
      if (user.displayName != null) {
          nameElement.style.display = "inline";
          nameElement.innerText = "Hi! "+ user.displayName;
      }
      else {
        nameElement.style.display = "inline";
        nameElement.innerHTML = `<a href="../edit-profile">Complete Your Profile</a>`
      }
    } 
    else {
      // User not logged in or has just logged out.
      document.getElementById("showImageInNoImage").style.display = "inline"
      document.getElementById("spin_loader").style.display = "none";
      document.getElementById("userSignedIN").style.display = "none";
      document.getElementById("userSignedOut").style.display = "block";
      currUser = null;
      nameElement.style.display = "none";
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

function registerUser() {
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
            window.location = "../profile"
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
function showLoginForm() {
    var modal = document.getElementById("loginPOP");
    modal.style.display = "block";
    /*window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }*/
}
function closeLoginPop() {
    document.getElementById("loginPOP").style.display = "none";
}
function showRegisterForm() {
    closeLoginPop();
    var modal = document.getElementById("registerPOP");
    modal.style.display = "block";
}
function closeRegisterPOP() {
    var modal = document.getElementById("registerPOP");
    modal.style.display = "none";
}

function fetchImage(fileName,uid) {
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        var currentProfileImage = document.getElementById("showImageInHeader")
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            currentProfileImage.style.display = "inline-block";
            currentProfileImage.src = url;
            document.getElementById("showImageInNoImage").style.display = "none";

        }).catch((err)=> {
            // Handle any errors
            console.log(err)
        });
    }
}

function showError(err,type) {
    if (type=="regError") {
        document.getElementById("regErrorHolder").style.display="flex";
        document.getElementById("regErrorText").innerText = err;
    }
    else if (type=="loginError") {
        document.getElementById("loginErrorHolder").style.display="flex";
        document.getElementById("loginErrorText").innerText = err;
    }
}