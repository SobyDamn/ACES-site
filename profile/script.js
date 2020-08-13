const urlParams = new URLSearchParams(window.location.search)
const qUid = urlParams.get('id')
const userName = urlParams.get('name')
var currentUser = null;

document.addEventListener("DOMContentLoaded", function(event) { 
    //if content loaded show the authentication status
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

  })

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
            requestPrivateData(uid);
            createProfileContactLinks("small",userDetails["Linkedin"],smallprofileCardLinkedinElelment)
            createProfileContactLinks("big",userDetails["Linkedin"],mainProfileUserLinkedInElement)
            createProfileContactLinks("big",userDetails["Site"],mainProfileUserWebsiteElement)
            smallProfileCardNameElement.innerHTML = userDetails["Name"];
            smallProfileCardBranchElement.innerText = userDetails["Branch"];
            smallProfileCardBatchElement.innerText = userDetails["Batch"];
            smallProfileCardEmailElement.innerText = userDetails["Email"];
            mainProfileNameElement.innerHTML = userDetails["Name"];
            mainProfileUserBranchElement.innerText = userDetails["Branch"];
            mainProfileUserBatchElement.innerText = userDetails["Batch"];
            mainProfileUserEmailElement.innerText = userDetails["Email"];
            mainProfileUserCompanyElement.innerText = checkDataAvailable(userDetails["Company"]);
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
function createProfileContactLinks(type,value,element) {
    if (value != "") {
        if (type == "small") {
            element.innerText = fetchLinkedinUsername(value);
            element.href = value;
        }
        else {
            element.innerText = value
            element.href = value;
        }
    }
    else {
        if (type == "small") {
            element.innerText = "----"
        }
        else {
            element.innerText = "Not Avaialble"
        }
    }
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

function requestPrivateData(uid) {
    if (currentUser != null) {
        if (currentUser.uid == uid) {
            //fetchData
            fetchPrivateData(uid);
        }
        else {
            var requestedUserRefs = firebase.firestore().collection("users").doc(currentUser.uid);
            requestedUserRefs.get().then(doc=>{
                if (doc.exists) {
                    var reqUserDetails = doc.data();
                    if (reqUserDetails.admin != undefined) {
                        if (reqUserDetails.admin) {
                            fetchPrivateData(uid);
                            return;
                        }
                        
                    }
                    if(reqUserDetails.adminVerified != undefined) {
                        if (reqUserDetails.adminVerified) {
                            fetchPrivateData(uid);
                            return;
                        }
                    }

                }
            })
        }
    }
}
function fetchPrivateData(uid) {
    var userPrivateData = firebase.firestore().collection("users-pvt-data").doc(uid);
    document.getElementById("userContactField").style.display = "flex"
    const mainProfileUserPhoneElement = document.getElementById("mainProfileUserPhone");
    userPrivateData.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            mainProfileUserPhoneElement.innerText = checkDataAvailable(userDetails["Contact"]);
            profilePageStatus("showProfile"); //show profile stop loader
        }
    })
}
function fetchLinkedinUsername(value) {
    var x = value.split("/")
    if (x.length <=2) {
        return "/Visit"
    }
    else {
        var username = x[x.length-1];
        if (username.length > 8) {
            username = username.slice(0,8) + "..."
            return username
        }
        else if(username.length < 2) {
            return "/Visit"
        }
        else {
            return username
        }
    }
}