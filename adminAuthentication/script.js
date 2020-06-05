const urlParams = new URLSearchParams(window.location.search)
const authFailType = urlParams.get('authFail')

function checkAuthentication() {
    if (authFailType == null) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User logged in already or has just logged in.
              checkAdminStatus(user);
            } 
            else {
              // User not logged in or has just logged out.
              document.getElementById("checkingAuth").style.display = "none";
              document.getElementById("authFailed").style.display = "block";
              document.getElementById("authTitle").innerText = "Permission Denied";
            }
          });
    }
    else {
        if (authFailType == "permissionDenied") {
            document.getElementById("checkingAuth").style.display = "none";
            document.getElementById("authFailed").style.display = "block";
            document.getElementById("authTitle").innerText = "Permission Denied";
        }
        else {
            document.getElementById("checkingAuth").style.display = "none";
            document.getElementById("authFailedUnavailable").style.display = "block";
            document.getElementById("authTitle").innerText = "Permission Unavailable";
        }
    }
}

function checkAdminStatus(user) {
    var userRefs = firebase.firestore().collection("users").doc(user.uid);
    userRefs.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            if (userDetails.admin) {
                //send to admin panel
                document.getElementById("checkingAuth").style.display = "none";
                document.getElementById("authSuccess").style.display = "block";
                document.getElementById("authTitle").innerText = "Authentication Success!";
                window.location = "../admin";
            }
            else {
                document.getElementById("checkingAuth").style.display = "none";
                document.getElementById("authFailed").style.display = "block";
                document.getElementById("authTitle").innerText = "Permission Denied";
            }
        }
        else {
            document.getElementById("checkingAuth").style.display = "none";
            document.getElementById("authFailed").style.display = "block";
            document.getElementById("authTitle").innerText = "Permission Denied";
        }
    })
}