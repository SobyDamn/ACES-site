var currUser = null
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User logged in already or has just logged in.
      currUser = user;
    } 
    else {
      // User not logged in or has just logged out.
    }
  });

function manageAdminship(id,name,email,branch,currentStatus) {
    //manage admins
    if (currUser) {
        if (currentStatus != undefined) {
            if (currentStatus) {
                //if it's true make it false
                changeAdminshipStatus(id,name,email,branch,false);
            }
            else {
                //make it true
                changeAdminshipStatus(id,name,email,branch,true);
            }
        }
        else {
            //make it true
            //curr status undefined
            changeAdminshipStatus(id,name,email,branch,true);
        }
    }
    else {
        closeErrorPop();
        showPopUp("Unauthorized","Please login to perform this action")
    }
}
function changeAdminshipStatus(id,name,email,branch,status) {
    var userProfile = firebase.firestore().collection("users").doc(id);
    var confirmPOP = document.getElementById("confirmPOP")
    var confirmPopLoader = document.getElementById("confirmPopLoader")
    var currDate = new Date();
    var title = "Confirm Action";
    var msg = "";
    var successMsg = "";
    if (status) {
        msg = `Are you sure want to <b>Add</b> this user as <b>ADMIN</b>?<br>'${name}'<br>${email}<br>${branch}`;
        confirmPOP.style.background = "rgb(28, 47, 156)"
        successMsg = `<b>${name}</b> is now Admin`
    }
    else {
        msg = `Are you sure want to <b>Remove</b> this user as <b>ADMIN</b>?<br>'${name}'<br>${email}<br>${branch}`;
        successMsg = `<b>${name}</b> is no longer Admin`;
    }
    confirmPOP.style.display = "inline";
    confirmPOP.onclick = function() {
        document.getElementById("popFooter").style.display = "none"
        confirmPopLoader.style.display = "block";
        userProfile.update({
            admin:status,
            adminOn:nerdDate(currDate),
            adminBy:currUser.displayName,
            adminByEmail:currUser.email,
        }).then(function() {
            closeErrorPop();
            var title = "Done!";
            showPopUp(title,successMsg);
        })
        .catch(function(error) {
            closeErrorPop();
            var title = "Error";
            var msg = error.message;
            showPopUp(title,msg);
        });
    }
    showPopUp(title,msg);
}
function deleteUser(id,name,email,branch,image) {
    //delete user
    var title = "Delete User";
    var msg = `Are you sure you want to <b>Delete</b> profile of '${name}'?`;
    var successMsg = `User profile for '${name}' has been deleted successfully.`;
    var userProfile = firebase.firestore().collection("users").doc(id);
    var userPvtProfile = firebase.firestore().collection("users").doc(id);
    var confirmPOP = document.getElementById("confirmPOP");
    var confirmPopLoader = document.getElementById("confirmPopLoader");
    var popMsgElement = document.getElementById("adminNoticePOPMsg");
    confirmPOP.style.display = "inline";
    confirmPOP.onclick = function() {
        if (currUser != null) {
            if (currUser.uid !=id) {
                confirmPopLoader.style.display = "block";
                document.getElementById("popFooter").style.display = "none"
                popMsgElement.innerHTML +="<br><b><i>Deleting Profile..</i></b>";
                userProfile.delete().then(()=>{
                    popMsgElement.innerHTML +="<br><b><i>Deleting Contacts..</i></b>";
                    userPvtProfile.delete().then(()=>{
                        if (image != undefined) {
                            var imageRef = firebase.storage().ref().child("users/"+id+"/"+image);
                            popMsgElement.innerHTML +="<br><b><i>Deleting Files..</i></b>";
                            imageRef.delete().then(()=>{
                                closeErrorPop();
                                var title = "Done!";
                                showPopUp(title,successMsg);
                            }).catch((error)=>{
                                closeErrorPop();
                                showPopUp("Error",error.message)
                            })
                        }
                        else {
                            //close pop and show success msg
                            closeErrorPop();
                            var title = "Done!";
                            showPopUp(title,successMsg);
                        }
                    }).catch((error)=>{
                        closeErrorPop();
                        showPopUp("Error",error.message)
                    })
                }).catch((error)=>{
                    closeErrorPop();
                    showPopUp("Error",error.message)
                })
            }
            else {
                closeErrorPop();
                showPopUp("Error","Can't Delete your own profile")
            }
        }
        else {
            closeErrorPop();
            showPopUp("Unauthorized","Please login to perform this action")
        }
    }
    showPopUp(title,msg)

}
function manageAdminVerificationStatus(id,name,email,branch,currentStatus) {
    //manage admins
    if (currUser) {
        if (currentStatus != undefined) {
            if (currentStatus) {
                //if it's true make it false
                changeAdminVerifyStatus(id,name,email,branch,false);
            }
            else {
                //make it true
                changeAdminVerifyStatus(id,name,email,branch,true);
            }
        }
        else {
            //make it true
            //curr status undefined
            changeAdminVerifyStatus(id,name,email,branch,true);
        }
    }
    else {
        closeErrorPop();
        showPopUp("Unauthorized","Please login to perform this action")
    }
}
function changeAdminVerifyStatus(id,name,email,branch,status) {
    var userProfile = firebase.firestore().collection("users").doc(id);
    var confirmPOP = document.getElementById("confirmPOP")
    var confirmPopLoader = document.getElementById("confirmPopLoader")
    var currDate = new Date();
    var title = "Confirm Action";
    var msg = "";
    var successMsg = "";
    if (status) {
        msg = `Are you sure you want to <b>Verify</b> this user?<br>'${name}'<br>${email}<br>${branch}`;
        confirmPOP.style.background = "rgb(28, 47, 156)"
        successMsg = `<b>${name}</b> is now Verified.`
    }
    else {
        msg = `Are you sure you want to <b>Remove Verification</b> of this user<br>'${name}'<br>${email}<br>${branch}`;
        successMsg = `Verification of <b>${name}</b> has been removed.`;
    }
    confirmPOP.style.display = "inline";
    confirmPOP.onclick = function() {
        document.getElementById("popFooter").style.display = "none"
        confirmPopLoader.style.display = "block";
        userProfile.update({
            adminVerified:status,
            adminVerifiedOn:nerdDate(currDate),
            adminVerifiedBy:currUser.displayName,
            adminVerifiedByEmail:currUser.email,
        }).then(function() {
            closeErrorPop();
            var title = "Done!";
            showPopUp(title,successMsg);
        })
        .catch(function(error) {
            closeErrorPop();
            var title = "Error";
            var msg = error.message;
            showPopUp(title,msg);
        });
    }
    showPopUp(title,msg);
}

function closeErrorPop() {
    var modal = document.getElementById("noticePOP");
    modal.style.display = "none";
    document.getElementById("confirmPOP").style.background = "rgb(202, 23, 23)"
    document.getElementById("confirmPOP").style.display = "none"
}
function showPopUp(type,message) {
    document.getElementById("confirmPopLoader").style.display = "none";
    document.getElementById("popFooter").style.display = "block"
    document.getElementById("adminNoticePOPHeading").innerHTML = type;
    document.getElementById("adminNoticePOPMsg").innerHTML = message;
    var modal = document.getElementById("noticePOP");
    modal.style.display = "block";
    /*window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("confirmPOP").style.display = "none"
      }
    }*/
}

function nerdDate(x) {
    var date = new Date(x)
    var monthsArray = new Array('Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    var outPutDate = `${day} ${monthsArray[month]},${year}`
    return outPutDate;
}
function emailService(btn) {
    document.getElementById("emailListDetail").style.display = "none";
    document.getElementById("emailListContainer").style.display = "none"
    document.getElementById("emailListContainer").style.animation = "fadeOut 0.3s"
    btn.style.display = "none"
    document.getElementById("emailListLoader").style.display = "block"
    const emails = document.getElementsByClassName("userEmailList");
    var fetchEmails = new Promise((res,rej)=>{
        var emailList = "";
        for (var i=0; i <emails.length;i++) {
            emailList += `${emails[i].innerHTML},`
        }
        res(emailList)
    })
    fetchEmails.then((emailList)=>{
        document.getElementById("emailListDetail").style.display = "block";
        document.getElementById("emailListDetail").innerText = `Total Emails :- ${emails.length}`;
        document.getElementById("emailListContainer").style.animation = "fadeIn 0.3s"
        document.getElementById("emailListContainer").style.display = "inline"
        document.getElementById("emailListContainer").value = emailList
        var a = document.createElement('a');
        a.href = `mailto:${emailList}`;
        a.click();
        a.remove();
        btn.style.display = "inline"
        document.getElementById("emailListLoader").style.display = "none"
    })
}