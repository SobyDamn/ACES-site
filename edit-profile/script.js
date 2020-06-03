var currUser;
var selectedImage = null;
//check authentication
firebase.auth().onAuthStateChanged(function(user) {
    var nameElement = document.getElementById("userName");
    if (user) {
      // User logged in already or has just logged in.
      checkCurrentProfile(user);
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
          //use logged out
        nameElement.style.display = "inline";
        nameElement.innerHTML = `<a href="edit-profile">Complete Your Profile</a>`
      }
    } 
    else {
      // User not logged in or has just logged out.
      document.getElementById("spin_loader").style.display = "none";
      document.getElementById("userSignedIN").style.display = "none";
      document.getElementById("userSignedOut").style.display = "block";
      var profileImageInHeader = document.getElementById("showImageInHeader")
      document.getElementById("showImageInNoImage").style.display = "inline"
      currUser = null;
      nameElement.style.display = "none";
      window.location = "../index.html"
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
            userTypeSavedValue(userDetails["UserType"]);
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
    document.getElementById("saveProfileLoader").style.display = "block";
    document.getElementById("save_userProfleBTN").style.display = "none";
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
    var checkRequiredField = new Promise((res,rej)=>{
        if (name == "") {
            rej("Please Fill the required field *\n Name is required")
        }
        else if (batch == "") {
            rej("Please Fill the required field *\n Batch is required")
        }
        else {
            res()
        }
        
    })
    var userTypeVal = userType();
    var userProfile = firebase.firestore().collection("users").doc(uid);
    checkRequiredField.then(()=>{
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
                        Batch: batch,
                        Email: currUser.email,
                        UserType: userTypeVal,
                        query: userSearchQueryGenerator(name,email,company),
                    }).then(()=>{
                        if (selectedImage != null) {
                            userProfile.update({
                                profileImage: selectedImage.name
                            })
                            currUser.updateProfile({
                                //update profile image in auth
                                photoURL: selectedImage.name
                            })
                        }
                        document.getElementById("saveProfileLoader").style.display = "none";
                        document.getElementById("save_userProfleBTN").style.display = "block";
                        window.location = "../index.html"
                    }).catch((err)=>{
                        //error in saving
                        document.getElementById("saveProfileLoader").style.display = "none";
                        document.getElementById("save_userProfleBTN").style.display = "block";
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
                        Email: currUser.email,
                        UserType: userTypeVal,
                        query: userSearchQueryGenerator(name,email,company),
                    }).then(()=>{
                        if (selectedImage != null) {
                            userProfile.update({
                                //guessing profile pic is not compulsory
                                profileImage: selectedImage.name
                            })
                            currUser.updateProfile({
                                //update profile image in auth
                                photoURL: selectedImage.name
                            })
                        }
                        document.getElementById("saveProfileLoader").style.display = "none";
                        document.getElementById("save_userProfleBTN").style.display = "block";
                        window.location = "../index.html"
                    }).catch((err)=>{
                        //error in saving
                        document.getElementById("saveProfileLoader").style.display = "none";
                        document.getElementById("save_userProfleBTN").style.display = "block";
                        console.log(err)
                    })
                })
            }
        }).catch(function(error) {
            document.getElementById("saveProfileLoader").style.display = "none";
            document.getElementById("save_userProfleBTN").style.display = "block";
            console.log(error);
        });
    }).catch((err)=>{
        showErrorNotice("Field Required",err)
        document.getElementById("saveProfileLoader").style.display = "none";
        document.getElementById("save_userProfleBTN").style.display = "block";
    })
}

function loadSelectedImage(event) {
    selectedImage = event.target.files[0];
    console.log(selectedImage.name)
    var showSelectedImage = document.getElementById("showImage")
    showSelectedImage.src = URL.createObjectURL(event.target.files[0]);
}
function selectFile() {
    var selectFileElement = document.getElementById("user_selected_file")
    selectFileElement.click();
}
function fetchImage(fileName,uid) {
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        var currentProfileImage = document.getElementById("showImage")
        var profileImageInHeader = document.getElementById("showImageInHeader")
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            currentProfileImage.style.display = "inline-block";
            profileImageInHeader.style.display = "inline-block";
            document.getElementById("showImageInNoImage").style.display = "none";
            currentProfileImage.src = url;
            profileImageInHeader.src = url;
        }).catch((err)=> {
            // Handle any errors
            console.log(err)
        });
    }
}

function userType() {
    var userTypeOption = document.getElementsByName("userType");
    for (var i=0; i<userTypeOption.length;i++) {
        if(userTypeOption[i].checked) {
            return userTypeOption[i].value;
        }
    }
}
function userTypeSavedValue(value) {
    var userTypeOption = document.getElementsByName("userType");
    for (var i=0; i<userTypeOption.length;i++) {
        if(userTypeOption[i].value == value) {
            userTypeOption[i].checked = true;
        }
    }
}
function showErrorNotice(title,msg) {
    var modal = document.getElementById("errorNotice");
    document.getElementById("errorNoticeMsg").innerText = msg;
    document.getElementById("errorNoticeHeading").innerText = title;
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}
function closeErrorNotice() {
    var modal = document.getElementById("errorNotice");
    modal.style.display = "none";
}
function userSearchQueryGenerator(name,email,company) {
    //will generate array of search query
    var queryValArray = name.toLowerCase().split(" ");
    queryValArray.push(email.toLowerCase());
    var companyQuery = company.toLowerCase().split(" ");
    for (var i = 0;i <companyQuery.length;i++) {
        queryValArray.push(companyQuery[i])
    }
    return queryValArray;
}

