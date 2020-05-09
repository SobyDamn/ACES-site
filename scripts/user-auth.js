function checkAuth() {
    //check user authentication
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User logged in already or has just logged in.
          console.log(user.uid);
        } else {
          // User not logged in or has just logged out.
          console.log("Not logged in")
        }
      });
}
function login() {
    //Login user
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user)=> {
            if (user) {
                console.log("logged in Success");
                console.log(user.user.uid);
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
            console.log(user);
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