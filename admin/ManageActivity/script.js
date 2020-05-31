var selectedImage = null;


/**
 * First arg to show and next two argument to hide
 * next three argument //decorate first and remove decoration from last two
 * last three arg is int
 */
function viewSelectedContentOption(view,hide1,hide2,selectedELement,nonSelectedElement1,nonSelectedElement2) {
    //show selected option content
    document.getElementById(hide1).style.display = "none";
    document.getElementById(hide2).style.display = "none";
    document.getElementById(view).style.display = "block";
    document.getElementById(view).style.animation = "fadeIn 0.4s"
    //decorate selected option
    document.getElementsByClassName("adminManageContentOption")[nonSelectedElement1].style.color = "rgb(46, 44, 44)";
    document.getElementsByClassName("adminManageContentOption")[nonSelectedElement1].style["border-bottom"] = "none"
    document.getElementsByClassName("adminManageContentOption")[nonSelectedElement2].style.color = "rgb(46, 44, 44)";
    document.getElementsByClassName("adminManageContentOption")[nonSelectedElement2].style["border-bottom"] = "none"
    document.getElementsByClassName("adminManageContentOption")[selectedELement].style.color = "rgb(25, 12, 204)";
    document.getElementsByClassName("adminManageContentOption")[selectedELement].style["border-bottom"] = "2px solid rgb(25, 12, 204)";
}

//select image file
function selectImage() {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var selectFileElement = document.getElementById("selectContentImage")
    selectFileElement.click();
}

function loadSelectedImage(event) {
    selectedImage = event.target.files[0];
    var activityBoxImageElement = document.getElementsByClassName("activityBoxImage")
    for (var i=0;i<activityBoxImageElement.length ; i++) {
        activityBoxImageElement[i].src = URL.createObjectURL(event.target.files[0]);
    }
}

//change stuffs in preview
function changeContentColor(value) {
    const activityBoxDetailsElements = document.getElementsByClassName("activityBoxDetails")
    for (var i= 0;i < activityBoxDetailsElements.length;i++) {
        activityBoxDetailsElements[i].style.background = value;
    }
}
function changeContentTitle(value) {
    //change title
    const activityBoxTitleElements = document.getElementsByClassName("activityBoxTitle")
    for (var i= 0;i < activityBoxTitleElements.length;i++) {
        activityBoxTitleElements[i].innerHTML = value;
    }
}
function changeContentDescription(value) {
    //change description
    console.log(value)
    const activityBoxDescriptionElements = document.getElementsByClassName("activityBoxAbout")
    for (var i= 0;i < activityBoxDescriptionElements.length;i++) {
        activityBoxDescriptionElements[i].innerHTML = value;
    }
}
function changeActivityBoxType(value) {
    //show the requested box
    switch(value) {
        case "activityBoxType1":
            document.getElementById("activityBoxType2").style.display = "none";
            document.getElementById("activityBoxType3").style.display = "none";
            document.getElementById("activityBoxType1").style.display = "flex";
            document.getElementById("activityBoxType1").style.animation = "fadeIn 0.2s"
            document.getElementById("nonImageContentData").style.display = "block";
            document.getElementById("nonImageContentData").style.animation = "fadeIn 0.4s"
            break;
        case "activityBoxType2":
            document.getElementById("activityBoxType1").style.display = "none";
            document.getElementById("activityBoxType3").style.display = "none";
            document.getElementById("activityBoxType2").style.display = "flex";
            document.getElementById("activityBoxType2").style.animation = "fadeIn 0.2s"
            document.getElementById("nonImageContentData").style.display = "block";
            document.getElementById("nonImageContentData").style.animation = "fadeIn 0.4s"
            break;
        case "activityBoxType3":
            document.getElementById("activityBoxType2").style.display = "none";
            document.getElementById("activityBoxType1").style.display = "none";
            document.getElementById("activityBoxType3").style.display = "flex";
            document.getElementById("activityBoxType3").style.animation = "fadeIn 0.2s"
            document.getElementById("nonImageContentData").style.display = "none";
            break;
    }
}
function submitContent() {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var contentDescription = document.getElementById("contentDescription").value;
    var contentDetailBGColor = document.getElementById("contentBGColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var contentBoxType = document.getElementById("contentBoxType").value;
    var activityDB = firebase.firestore().collection("activity");
    var currDate = new Date()
    submitInProgress(true)
    if (selectedImage == null) {
        document.getElementById("contentSubmitErrorHolder").style.display = "block";
        document.getElementById("contentSubmitErrorText").innerText = "Please Select an Image!"
        submitInProgress(false);
    }
    else {
        var contentImageURL = selectedImage.name
        //submit
        activityDB.add({
            title: contentTitle,
            description: contentDescription,
            background: contentDetailBGColor,
            link: contentLink,
            type: contentBoxType,
            image: contentImageURL,
            addedOn: currDate.toDateString(),
        }).then((activityRef)=>{
            uploadActivityImage(activityRef.id)
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
        })
    }
}
function submitInProgress(value) {
    //show loader if submission is in process or hide if not
    var button = document.getElementById("submitContentBTN");
    var loader = document.getElementById("submitContentLoader");
    if (value) {
        button.style.display = "none";
        loader.style.display = "block";
    }
    else {
        button.style.display = "inline";
        loader.style.display = "none";
    }
}

function uploadActivityImage(id) {
    var storageRef = firebase.storage().ref("activity/"+id+"/"+selectedImage.name);
    var uploadImage = storageRef.put(selectedImage);
    uploadImage.on('state_changed',(snapshot) => {
        document.getElementById("contentUploadStatus").style.display = "block";
        document.getElementById("contentUploadStatus").innerHTML = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) + "% Uploaded"
        if (Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) >= 100) {
            //uploading completed
            document.getElementById("contentUploadStatus").innerHTML = "Added Successfully!"
            setTimeout(()=>{
                submitInProgress(false);
                window.location = ""
            },1000)
        }
    })
}
function loadAvailableActivities() {
    document.getElementById("adminManageAvailableContentContainer").innerHTML = " "
    document.getElementById("availableActivityLoader").style.display = "block";
    var activityDB = firebase.firestore().collection("activity");
    activityDB.get().then(function(querySnapshot) {
        document.getElementById("availableActivityLoader").style.display = "none";
        querySnapshot.forEach(function(doc) {
            var activity = doc.data()
            var description = escape(activity['description'])
            var title = escape(activity['title'])
            var activityElement = `<div class="adminManageAvailableContent">
                                        <span class="adminManageAvailableContentTitle">${activity.title}</span><br>
                                        <button onclick="editActivity('${doc.id}','${title}','${description}','${activity.link}','${activity.background}','${activity.type}','${activity.image}')" class="adminManageAvailableContentOptionBTN">Edit</button>
                                        <button onclick="deleteActivity('${doc.id}','${title}','${activity.image}')" class="adminManageAvailableContentOptionBTN">Delete</button>
                                        <button class="adminManageAvailableContentOptionBTN">About</button>
                                    </div>`
            document.getElementById("adminManageAvailableContentContainer").innerHTML += activityElement
        });
    });
}
function deleteActivity(id,title,imageURL) {
    //delete element
    var popMsgElement = document.getElementById("popContent")
    var activityDB = firebase.firestore().collection("activity");
    var imageRef = firebase.storage().ref().child("activity/"+id+"/"+imageURL);
    var heading = "Delete"
    var msg = "Delete Activity<br>'"+unescape(title)+"' ?"
    document.getElementById("confirmPOP").style.display = "inline"
    var confirmBTN = document.getElementById("confirmPOP");
    confirmBTN.onclick = function(){
        document.getElementById("confirmPopLoader").style.display = "block";
        document.getElementById("popFooter").style.display = "none"
        //Delete document and then stored image
        activityDB.doc(id).delete().then(function() {
            popMsgElement.innerHTML +="<br><b><i>Deleting Files..</i></b>";
            imageRef.delete().then(function() {
                // File deleted successfully
                loadAvailableActivities()
                closeErrorPop()
              }).catch(function(error) {
                // Uh-oh, an error occurred!
                console.log("err in del",error)
                closeErrorPop()
                var msg = error.message;
                var title = "Error";
                showPopUp(title,msg)
              });
        }).catch(function(error) {
            console.error("Error removing document: ", error);
            closeErrorPop()
            var msg = "Error<br>"+error.message;
            var title = "Error";
            showPopUp(title,msg)
        });
    }
    showPopUp(heading,msg);
    
}
function editActivity(id,title,description,link,bgColor,activityType,image) {
    //edit
    console.log(unescape(description))
    document.getElementById("contentTitle").value = unescape(title);
    document.getElementById("contentDescription").value = unescape(description);
    document.getElementById("contentBGColor").value = bgColor;
    document.getElementById("contentLink").value = link;
    document.getElementById("contentBoxType").value = activityType;
    changeActivityBoxType(activityType);
    changeContentDescription(unescape(description));
    changeContentTitle(unescape(title));
    changeContentColor(bgColor);
    fetchPreviewImage(id,image);
    document.getElementsByClassName("adminManageContentOption")[1].click();
}
function closeErrorPop() {
    var modal = document.getElementById("noticePOP");
    modal.style.display = "none";
    document.getElementById("confirmPOP").style.display = "none"
}

function showPopUp(type,message) {
    document.getElementById("confirmPopLoader").style.display = "none";
    document.getElementById("popFooter").style.display = "block"
    document.getElementById("popHeading").innerHTML = type;
    document.getElementById("popContent").innerHTML = message;
    var modal = document.getElementById("noticePOP");
    modal.style.display = "block";
    /*window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("confirmPOP").style.display = "none"
      }
    }*/
}
function fetchPreviewImage(id,fileName) {
    var storageRef = firebase.storage().ref();
    var activityBoxImageElement = document.getElementsByClassName("activityBoxImage")
    storageRef.child("activity/"+id+"/"+fileName).getDownloadURL().then((url)=> {
        for (var i=0;i<activityBoxImageElement.length ; i++) {
            activityBoxImageElement[i].src = url;
        }
    }).catch((err)=> {
        // Handle any errors
        console.log(err)
    });
}