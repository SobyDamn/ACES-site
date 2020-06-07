var currUser;
var selectedImage = null;
//check authentication
firebase.auth().onAuthStateChanged(function(user) {
    checkAuthentication(user);
    var nameElement = document.getElementById("userName");
    if (user) {
      // User logged in already or has just logged in.
        checkCurrentProfile(user);
        if (user.photoURL) {
            //display photo if exists
            fetchProfileImage(user.photoURL,user.uid)
        }
        currUser = user
    } 
    else {
      // User not logged in or has just logged out.
      currUser = null;
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
    var userPrivateData = firebase.firestore().collection("users-pvt-data").doc(uid);
    userPrivateData.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            phone.value = userDetails["Contact"];
        }
    })
    profileRef.get().then((doc)=>{
        if (doc.exists) {
            var userDetails = doc.data();
            name.value = userDetails["Name"];
            branch.value = userDetails["Branch"];
            company.value = userDetails["Company"];
            location.value = userDetails["Location"];
            site.value = userDetails["Site"];
            linkedin.value = userDetails["Linkedin"];
            batch.value = userDetails["Batch"];
            //show current image
            fetchProfileImage(userDetails["profileImage"],uid);
        } else {
            // doc.data() will be undefined in this case
        }
    }).catch(function(error) {
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
            document.getElementById("selectedImageUploadStatus").innerHTML = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) + "% Uploaded"
            if (Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) >= 100) {
                //uploading completed
                document.getElementById("selectedImageUploadStatus").innerHTML = "Uploaded!"
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
                        Company: company,
                        Location: location,
                        Site: site,
                        Linkedin: linkedin,
                        Batch: batch,
                        Email: currUser.email,
                        query: userSearchQueryGenerator(name,email,company),
                    }).then(()=>{
                        updatePrivateData(uid,name,email,phone);
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
                        document.getElementById("save_userProfleBTN").style.display = "inline-block";
                        window.location = "../index.html"
                    }).catch((err)=>{
                        //error in saving
                        document.getElementById("saveProfileLoader").style.display = "none";
                        document.getElementById("save_userProfleBTN").style.display = "inline-block";
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
                        Company: company,
                        Location: location,
                        Site: site,
                        Linkedin: linkedin,
                        Batch: batch,
                        Email: currUser.email,
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        query: userSearchQueryGenerator(name,email,company),
                    }).then(()=>{
                        setPrivateData(uid,name,email,phone);
                    })
                    .then(()=>{
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
                        document.getElementById("save_userProfleBTN").style.display = "inline-block";
                        window.location = "../index.html"
                    }).catch((err)=>{
                        //error in saving
                        document.getElementById("saveProfileLoader").style.display = "none";
                        document.getElementById("save_userProfleBTN").style.display = "inline-block";
                    })
                })
            }
        }).catch(function(error) {
            document.getElementById("saveProfileLoader").style.display = "none";
            document.getElementById("save_userProfleBTN").style.display = "inline-block";
        });
    }).catch((err)=>{
        showErrorNotice("Field Required",err)
        document.getElementById("saveProfileLoader").style.display = "none";
        document.getElementById("save_userProfleBTN").style.display = "inline-block";
    })
}

function loadSelectedImage(event) {
    selectedImage = event.target.files[0];
    var showSelectedImage = document.getElementById("showImage")
    showSelectedImage.src = URL.createObjectURL(event.target.files[0]);
}
function selectFile() {
    var selectFileElement = document.getElementById("user_selected_file")
    selectFileElement.click();
}
function fetchProfileImage(fileName,uid) {
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        var currentProfileImage = document.getElementById("showImage")
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            currentProfileImage.style.display = "inline-block";
            currentProfileImage.src = url;
        }).catch((err)=> {
            // Handle any errors
        });
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

function updatePrivateData(id,name,email,contact) {
    var userPrivateData = firebase.firestore().collection("users-pvt-data").doc(id);
    userPrivateData.update({
        Name: name,
        Email: email,
        Contact: contact,
    }).catch(function(error) {
        document.getElementById("saveProfileLoader").style.display = "none";
        document.getElementById("save_userProfleBTN").style.display = "inline-block";
        showErrorNotice("Error",error.message);
    });
}
function setPrivateData(id,name,email,contact) {
    var userPrivateData = firebase.firestore().collection("users-pvt-data").doc(id);
    userPrivateData.set({
        Name: name,
        Email: email,
        Contact: contact,
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(function(error) {
        document.getElementById("saveProfileLoader").style.display = "none";
        document.getElementById("save_userProfleBTN").style.display = "inline-block";
        showErrorNotice("Error",error.message);
    });
}
function checkAuthentication(user) {
    if (user) {
        if (!user.emailVerified) {
            showEmailVerificationPOP(user,user.email);
        }
        else {
            return;
        }
    }
    else {
        showLoginForm();
    }
}

function showEmailVerificationPOP(user,email) {
    var popUp = document.getElementById("verifyEmailPOP");
    var popHeadingElement = document.getElementById("verifyEmailPOPHeading");
    var popMessageElement = document.getElementById("verifyEmailPOPMsg");
    var popLoader = document.getElementById("verifyEmailPOPLoader");
    var popFooter = document.getElementById("verifyEmailPOPFooter");
    var verifyBTN = document.getElementById("confirmVerifyEmailPOP");
    popMessageElement.innerHTML = `Please verify your email<br>'${email}' is not yet verified!`;
    verifyBTN.onclick = function() {
        popFooter.style.display = "none";
        popLoader.style.display = "block";
        user.sendEmailVerification().then(()=>{
            popMessageElement.innerHTML = `Verification link has been sent to <b>${email}</b>`;
            popFooter.style.display = "none";
            popLoader.style.display = "none";
        }).catch(error=>{
            showErrorNotice("Error",error.message)
            popUp.style.display = "none";
        })
    }
    popUp.style.display = "block";
}