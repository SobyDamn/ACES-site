var availableUser = null;
function checkAdminAuthentication(from) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User logged in already or has just logged in.
          availableUser = user;
          checkAdminStatus(user,from);
        } 
        else {
          // User not logged in or has just logged out.
          availableUser = null;
          showLoginForm();
        }
    });
}

function checkAdminStatus(user,from) {
    var userRefs = firebase.firestore().collection("users").doc(user.uid);
    userRefs.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            if (userDetails.admin) {
                //user is admin leave him alone
                return;
            }
            else {
                //send back to home
                if (from == "home") {
                    window.location = "../adminAuthentication/?authFail=permissionDenied"
                }
                else {
                    window.location = "../../adminAuthentication/?authFail=permissionDenied"
                }
            }
        }
        else {
            if (from == "home") {
                window.location = "../adminAuthentication/?authFail=unavailable"
            }
            else {
                window.location = "../../adminAuthentication/?authFail=unavailable"
            }
        }
    })
}