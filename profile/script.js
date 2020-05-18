var currUser;
var selectedImage = null;
//check authentication
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User logged in already or has just logged in.
      currUser = user
      console.log(user.uid);
      checkCurrentProfile(user);
    } else {
      // User not logged in or has just logged out.
      currUser = null;
      console.log("Not logged in")
    }
  });

function checkCurrentProfile(user) {
    //if profile already exists allow them to edit showing the current values
    var name = document.getElementById("user_name");
    var uid = user.uid;
    var branch = document.getElementById("user_branch");
    var phone = document.getElementById("user_phone");
    var company = document.getElementById("user_company");
    var location = document.getElementById("user_location");
    var site = document.getElementById("user_site");
    var linkedin = document.getElementById("user_linkedin");
    var batch = document.getElementById("user_batch");
    var db = firebase.firestore();
    var profileRef = db.collection("users").doc(uid);
    profileRef.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            name.value = userDetails["Name"];
            branch.value = userDetails["Branch"];
            phone.value = userDetails["Contact"];
            company.value = userDetails["Company"];
            location.value = userDetails["Location"];
            site.value = userDetails["Site"];
            linkedin.value = userDetails["Linkedin"];
            batch.value = userDetails["Batch"];
            //show current image
            fetchImage(userDetails["profileImage"],uid);
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}
function saveProfileData() {
    var uid = currUser.uid;
    if (selectedImage != null) {
        //upload profile picture and then update file
        var storageRef = firebase.storage().ref("users/"+uid+"/"+selectedImage.name);
        var uploadImage = storageRef.put(selectedImage);
        uploadImage.on('state_changed',(snapshot) => {
            document.getElementById("selectImageStatus").innerHTML = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) + "% Uploaded"
            if (Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) >= 100) {
                //uploading completed
                document.getElementById("selectImageStatus").innerHTML = "Uploaded!"
                saveProfileDetails(uid);
            }
          });

    }
    else {
        //update profile details as image is not updating
        saveProfileDetails(uid);

    }
}
function saveProfileDetails(uid) {
    var name = document.getElementById("user_name").value;
    var email = currUser.email;
    var branch = document.getElementById("user_branch").value;
    var batch = document.getElementById("user_batch").value;
    var phone = document.getElementById("user_phone").value;
    var company = document.getElementById("user_company").value;
    var location = document.getElementById("user_location").value;
    var site = document.getElementById("user_site").value;
    var linkedin = document.getElementById("user_linkedin").value;
    var userProfile = firebase.firestore().collection("users").doc(uid);
    var profileImage;
    userProfile.get().then((doc)=>{
        if (doc.exists) {
            //document exists then update the profile
            currUser.updateProfile({
                //update profile name in auth
                displayName: name
            }).then(()=>{
                userProfile.update({
                    Name: name,
                    Email: email,
                    Branch: branch,
                    Contact: phone,
                    Company: company,
                    Location: location,
                    Site: site,
                    Linkedin: linkedin,
                    Batch: batch
                }).then(()=>{
                    currUser.updateProfile({
                        //update profile name in auth
                        displayName: name
                    })
                    if (selectedImage != null) {
                        userProfile.update({
                            profileImage: selectedImage.name
                        })
                    }
                    window.location = "../index.html"
                }).catch((err)=>{
                    //error in saving
                    console.log(err)
                })
            })
        } else {
            //if it does't exists then create the profile
            currUser.updateProfile({
                //update profile name in auth
                displayName: name
            }).then(()=>{
                userProfile.set({
                    Name: name,
                    Email: email,
                    Branch: branch,
                    Contact: phone,
                    Company: company,
                    Location: location,
                    Site: site,
                    Linkedin: linkedin,
                    Batch: batch,
                }).then(()=>{
                    if (selectedImage != null) {
                        userProfile.update({
                            //guessing profile pic is not compulsory
                            profileImage: selectedImage.name
                        })
                    }
                    window.location = "../index.html"
                }).catch((err)=>{
                    //error in saving
                    console.log(err)
                })
            })
        }
    }).catch(function(error) {
        console.log(error);
    });
    
}

function loadSelectedImage(event) {
    selectedImage = event.target.files[0];
    console.log(selectedImage.name)
    var showSelectedImage = document.getElementById("showImage")
    showSelectedImage.src = URL.createObjectURL(event.target.files[0]);
}
function selectFile() {
    console.log("hello")
    var selectFileElement = document.getElementById("user_selected_file")
    selectFileElement.click();
}
function fetchImage(fileName,uid) {
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        var currentProfileImage = document.getElementById("showImage")
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            currentProfileImage.src = url;
        }).catch((err)=> {
            // Handle any errors
            console.log(err)
        });
    }
}