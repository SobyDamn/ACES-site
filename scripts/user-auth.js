var currUser;
//check user authentication
firebase.auth().onAuthStateChanged(function(user) {
    var nameElement = document.getElementById("userName");
    if (user) {
      // User logged in already or has just logged in.
      currUser = user
      if (user.displayName != null) {
          nameElement.style.display = "inline";
          nameElement.innerText = "Hi! "+ user.displayName;
      }
      else {
        nameElement.style.display = "inline";
        nameElement.innerHTML = `<a href="../profile">Complete Your Profile</a>`
      }
    } else {
      // User not logged in or has just logged out.
      currUser = null;
      nameElement.style.display = "none";
      console.log("Not logged in")
    }
  });
function login() {
    //Login user
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user)=> {
            if (user) {
                console.log("logged in Success");
                closeLoginPop();
            }
        })
        .catch(function(error) {
          console.log("Login Failed!", error);
        })
}

function registerUser() {
    //register user
    var email = document.getElementById("register_email").value;
    var password = document.getElementById("register_password").value;
    var cPassword = document.getElementById("register_cPassword").value;
    if (password == cPassword) {
        //register
        firebase.auth().createUserWithEmailAndPassword(email, password).then((user)=> {
            //save user's profile
            window.location = "../profile"
          }).catch((err)=>{
              console.log("Error \n"+err)
          })
    }
    else {
        //error passwords are different
        console.log("Password different error")
    }
}
function logout(){
    //logout user
    firebase.auth().signOut().then(()=>{
        //logged out
        console.log("Logged out")
    }).catch((err)=>{
        //errr in logging out
        console.log("Error in logout\n"+err)
    })
}
function showProfile() {
    //show user's profile
}
function showLoginForm() {
    var modal = document.getElementById("loginPOP");
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
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