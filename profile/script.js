const urlParams = new URLSearchParams(window.location.search)
const qUid = urlParams.get('id')
const userName = urlParams.get('name')
var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User logged in already or has just logged in.
      currentUser = user;
      showProfile()
    } 
    else {
      // User not logged in or has just logged out.
      currentUser = null;
      if (qUid == null) {
          profilePageStatus("authUnavailablle")
          showLoginForm()
      }
      else {
        showProfile()
      }
    }
  });

function showProfile() {
    if (qUid != null) {
        if (currentUser !=null) {
            if (qUid == currentUser.uid) {
                //querying self profile show
                document.getElementById("editProfileBTNHolder").style.display = "block";
                document.getElementById("profilePageTitle").innerText = "View Profile";
                showRequestedProfile(currentUser.uid);
            }
            else {
                //querying user
                document.getElementById("editProfileBTNHolder").style.display = "none";
                document.getElementById("profilePageTitle").innerText = "Profile - "+userName;
                showRequestedProfile(qUid);
            }
        }
        else {
            //querying user
            document.getElementById("editProfileBTNHolder").style.display = "none";
            document.getElementById("profilePageTitle").innerText = "Profile - "+userName;
            showRequestedProfile(qUid);
        }
    }
    else {
        //querying self profile show
        document.getElementById("editProfileBTNHolder").style.display = "block";
        document.getElementById("profilePageTitle").innerText = "View Profile";
        showRequestedProfile(currentUser.uid);
    }

}
function showRequestedProfile(uid) {
    const smallProfileCardNameElement = document.getElementById("smallProfileCardName");
    const smallProfileCardBranchElement = document.getElementById("smallProfileCardBranch");
    const smallProfileCardBatchElement = document.getElementById("smallProfileCardBatch");
    const smallProfileCardEmailElement = document.getElementById("profileCardEmail");
    const smallprofileCardLinkedinElelment = document.getElementById("profileCardLinkedin");
    const mainProfileNameElement = document.getElementById("profileName");
    const mainProfileUserBranchElement = document.getElementById("mainProfileUserBranch");
    const mainProfileUserBatchElement = document.getElementById("mainProfileUserBatch");
    const mainProfileUserCompanyElement = document.getElementById("mainProfileUserCompany");
    const mainProfileUserLinkedInElement = document.getElementById("mainProfileUserLinkedIn");
    const mainProfileUserEmailElement = document.getElementById("mainProfileUserEmail");
    const mainProfileUserPhoneElement = document.getElementById("mainProfileUserPhone");
    const mainProfileUserWebsiteElement = document.getElementById("mainProfileUserWebsite");
    const mainProfileUserLocationElement = document.getElementById("mainProfileUserLocation");
    var db = firebase.firestore();
    var profileRef = db.collection("users").doc(uid);
    profileRef.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            smallProfileCardNameElement.innerText = userDetails["Name"];
            smallProfileCardBranchElement.innerText = userDetails["Branch"];
            smallProfileCardBatchElement.innerText = userDetails["Batch"];
            smallProfileCardEmailElement.innerText = userDetails["Email"];
            smallprofileCardLinkedinElelment.innerText = checkDataAvailable(userDetails["Linkedin"]);
            mainProfileNameElement.innerText = userDetails["Name"];
            mainProfileUserBranchElement.innerText = userDetails["Branch"];
            mainProfileUserBatchElement.innerText = userDetails["Batch"];
            mainProfileUserEmailElement.innerText = userDetails["Email"];
            mainProfileUserLinkedInElement.innerText = checkDataAvailable(userDetails["Linkedin"]);
            mainProfileUserPhoneElement.innerText = checkDataAvailable(userDetails["Contact"]);
            mainProfileUserCompanyElement.innerText = checkDataAvailable(userDetails["Company"]);
            mainProfileUserWebsiteElement.innerText = checkDataAvailable(userDetails["Site"]);
            mainProfileUserLocationElement.innerText = checkDataAvailable(userDetails["Location"]);
            profilePageStatus("showProfile"); //show profile stop loader
            //show current image in smol profile card
            fetchImageForSmallProfileCard(userDetails["profileImage"],uid);
        } else {
            // doc.data() will be undefined in this case
            profilePageStatus("unavailable"); //profile not available
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function checkDataAvailable(data) {
    if (data == "") {
        return "Not Available";
    }
    else {
        return data;
    }
}

function profilePageStatus(profile) {
    if (profile == "unavailable") {
        //profile not found page
        document.getElementById("profileLoader").style.display = "none";
        document.getElementById("authUnavailableStatus").style.display = "none";
        document.getElementById("displayProfileDetail").style.display = "none";
        document.getElementById("profileNotAvailable").style.display = "block";
    }
    else if (profile=="authUnavailablle") {
        //self profile needs login
        document.getElementById("profileLoader").style.display = "none";
        document.getElementById("profileNotAvailable").style.display = "none";
        document.getElementById("displayProfileDetail").style.display = "none";
        document.getElementById("authUnavailableStatus").style.display = "block";
    }
    else {
        //show requested profile
        document.getElementById("profileLoader").style.display = "none";
        document.getElementById("profileNotAvailable").style.display = "none";
        document.getElementById("authUnavailableStatus").style.display = "none";
        document.getElementById("displayProfileDetail").style.display = "block";
    }
}
function editmyProfile() {
    window.location = "../edit-profile"
}

function fetchImageForSmallProfileCard(fileName,uid) {
    var profileCardImageElement = document.getElementById("profileCardImage")
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            profileCardImageElement.src = url;
            document.getElementById("smallProfileCardImageLoader").style.display = "none";
            profileCardImageElement.style.display = "block";
        }).catch((err)=> {
            // Handle any errors
            console.log(err)
        });
    }
    else {
        document.getElementById("smallProfileCardImageLoader").style.display = "none";
        profileCardImageElement.style.display = "block";
    }
}