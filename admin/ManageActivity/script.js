var selectedImage = null;
var maxValue = 3; //setting for max car allowed on screen 

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
function colorPickerContentChange(value) {
    changeContentColor(value);
    document.getElementById("contentBGColor").value = value;
}
function titleTextColorPickerChange(value) {
    //change titl text color
    const activityBoxTitleElements = document.getElementsByClassName("activityBoxTitle")
    for (var i= 0;i < activityBoxTitleElements.length;i++) {
        activityBoxTitleElements[i].style.color = value;
    }
}
function descriptionTextColorPickerChange(value) {
    //change desc text color
    const activityBoxDescriptionElements = document.getElementsByClassName("activityBoxAbout")
    for (var i= 0;i < activityBoxDescriptionElements.length;i++) {
        activityBoxDescriptionElements[i].style.color = value;
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
            document.getElementById("nonImageContentData").style.display = "inline";
            document.getElementById("nonImageContentData").style.animation = "fadeIn 0.4s"
            break;
        case "activityBoxType2":
            document.getElementById("activityBoxType1").style.display = "none";
            document.getElementById("activityBoxType3").style.display = "none";
            document.getElementById("activityBoxType2").style.display = "flex";
            document.getElementById("activityBoxType2").style.animation = "fadeIn 0.2s"
            document.getElementById("nonImageContentData").style.display = "inline";
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
    var contentTitleColor = document.getElementById("contentTitleColor").value;
    var contentDescriptionColor = document.getElementById("contentTextColor").value;
    var contentDetailBGColor = document.getElementById("contentBGColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var contentBoxType = document.getElementById("contentBoxType").value;
    var activityDB = firebase.firestore().collection("activity");
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
            textColor: contentDescriptionColor,
            titleColor: contentTitleColor,
            addedBy:availableUser.displayName,
            addedOn:nerdDate(new Date()),
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        }).then((activityRef)=>{
            uploadActivityImage(activityRef.id)
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
            showPopUp("Error",error.message);
        })
    }
}

function saveEditActivity(id) {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var contentDescription = document.getElementById("contentDescription").value;
    var contentDetailBGColor = document.getElementById("contentBGColor").value;
    var contentTitleColor = document.getElementById("contentTitleColor").value;
    var contentDescriptionColor = document.getElementById("contentTextColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var contentBoxType = document.getElementById("contentBoxType").value;
    var activity = firebase.firestore().collection("activity").doc(id);
    submitInProgress(true)
    if (selectedImage == null) {
        activity.update({
            title: contentTitle,
            description: contentDescription,
            background: contentDetailBGColor,
            link: contentLink,
            type: contentBoxType,
            textColor: contentDescriptionColor,
            titleColor: contentTitleColor,
        }).then(()=>{
            submitInProgress(false);
            document.getElementsByClassName("adminManageContentOption")[0].click();
            loadAvailableContentWithSettings();
            resetContentForm();
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
            showPopUp("Error",error.message);
        })
    }
    else {
        var contentImageURL = selectedImage.name
        //submit
        activity.update({
            title: contentTitle,
            description: contentDescription,
            background: contentDetailBGColor,
            link: contentLink,
            type: contentBoxType,
            image: contentImageURL,
            textColor: contentDescriptionColor,
            titleColor: contentTitleColor,
        }).then(()=>{
            uploadActivityImage(id)
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
            showPopUp("Error",error.message);
        })
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
            selectedImage =null;
            setTimeout(()=>{
                submitInProgress(false);
                document.getElementsByClassName("adminManageContentOption")[0].click();
                document.getElementById("contentUploadStatus").style.display = "none";
                loadAvailableContentWithSettings();
                resetContentForm();
                //window.location = ""
            },1000)
        }
    })
}
function loadAvailableActivities(maxLimit) {
    document.getElementById("adminManageAvailableContentContainer").innerHTML = " "
    document.getElementById("availableActivityLoader").style.display = "block";
    var activityDB = firebase.firestore().collection("activity").orderBy("timestamp", "desc").limit(maxLimit);
    activityDB.get().then(function(querySnapshot) {
        document.getElementById("availableActivityLoader").style.display = "none";
        querySnapshot.forEach(function(doc) {
            var activity = doc.data()
            var description = escape(activity['description'])
            var title = escape(activity['title'])
            var activityElement = `<div class="adminManageAvailableContent">
                                        <span class="adminManageAvailableContentTitle">${activity.title}</span><br>
                                        <button onclick="editActivity('${doc.id}','${title}','${description}','${activity.link}','${activity.background}','${activity.type}','${activity.image}','${activity.textColor}','${activity.titleColor}')" class="adminManageAvailableContentOptionBTN">Edit</button>
                                        <button onclick="deleteActivity('${doc.id}','${title}','${activity.image}')" class="adminManageAvailableContentOptionBTN">Delete</button>
                                        <button class="adminManageAvailableContentOptionBTN">
                                            <span class="adminManageAvailableContentAboutBTN">About
                                                <div class="adminManageAvailableAboutContent">
                                                    <h3>About</h3>
                                                    <span>AddedBy:- ${doc.data()['addedBy']}</span>
                                                    <br>
                                                    <span>AddedOn:- ${doc.data()['addedOn']}</span>
                                                </div>
                                            </span>
                                        </button>
                                    </div>`
            document.getElementById("adminManageAvailableContentContainer").innerHTML += activityElement
        });
    });
}

function deleteActivity(id,title,imageURL) {
    //delete element
    var popMsgElement = document.getElementById("adminNoticePOPMsg")
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
                loadAvailableContentWithSettings()
                closeErrorPop()
              }).catch(function(error) {
                // Uh-oh, an error occurred!
                closeErrorPop()
                var msg = error.message;
                var title = "Error";
                showPopUp(title,msg)
              });
        }).catch(function(error) {
            closeErrorPop();
            var msg = "Error<br>"+error.message;
            var title = "Error";
            showPopUp(title,msg)
        });
    }
    showPopUp(heading,msg);
    
}
function editActivity(id,title,description,link,bgColor,activityType,image,textColor,titleColor) {
    //edit
    document.getElementById("contentTitle").value = unescape(title);
    document.getElementById("contentDescription").value = unescape(description);
    document.getElementById("contentBGColor").value = bgColor;
    document.getElementById("contentLink").value = link;
    document.getElementById("contentBoxType").value = activityType;
    document.getElementById("contentTitleColor").value = titleColor;
    document.getElementById("contentTextColor").value = textColor;
    document.getElementById("contentBackgroundColorPicker").value = bgColor;
    titleTextColorPickerChange(titleColor);
    descriptionTextColorPickerChange(textColor);
    changeActivityBoxType(activityType);
    changeContentDescription(unescape(description));
    changeContentTitle(unescape(title));
    colorPickerContentChange(bgColor);
    fetchPreviewImage(id,image);
    var saveEditBTN = document.getElementById("submitEditContentBTN")
    saveEditBTN.onclick = function(){
        saveEditActivity(id);
    }
    saveEditBTN.style.display = "inline";
    document.getElementById("addNewActivityBTN").style.display = "inline";
    document.getElementById("submitContentBTN").style.display = "none";
    document.getElementsByClassName("adminManageContentOption")[1].click();
}
function fetchPreviewImage(id,fileName) {
    var storageRef = firebase.storage().ref();
    var activityBoxImageElement = document.getElementsByClassName("activityBoxImage")
    storageRef.child("activity/"+id+"/"+fileName).getDownloadURL().then((url)=> {
        for (var i=0;i<activityBoxImageElement.length ; i++) {
            activityBoxImageElement[i].src = url;
        }
    }).catch((error)=> {
        // Handle any errors
        var msg = "Error<br>"+error.message;
        var title = "Error";
        showPopUp(title,msg)
    });
}
function closeErrorPop() {
    var modal = document.getElementById("noticePOP");
    modal.style.display = "none";
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
function submitInProgress(isProcessing) {
    //show loader if submission is in process or hide if not
    var addButton = document.getElementById("submitContentBTN");
    var loader = document.getElementById("submitContentLoader");
    var editButton = document.getElementById("submitEditContentBTN");
    if (isProcessing) {
        addButton.style.display = "none";
        editButton.style.display = "none";
        loader.style.display = "block";
    }
    else {
        addButton.style.display = "inline";
        loader.style.display = "none";
    }
}


//reset form back to normal
function resetContentForm() {
    document.getElementById("addNewActivityBTN").style.display = "none";
    document.getElementById("submitEditContentBTN").style.display = "none";
    document.getElementById("submitContentBTN").style.display = "inline";
    var defaultDesc = `ACES refers to the Association of Computer Engineering Students from the prestigious School of Engineering, Cochin University of Science and technology (CUSAT).`
    var defaultTitle = `ACES`;
    var defaultBoxType = `activityBoxType2`;
    var defaultBGColor = `#ffffff`;
    var defaultTextColor = "#000000";
    var defaultTitleColor = "#000000";
    changeContentDescription(defaultDesc);
    changeActivityBoxType(defaultBoxType);
    changeContentTitle(defaultTitle);
    colorPickerContentChange(defaultBGColor);
    titleTextColorPickerChange(defaultTitleColor);
    descriptionTextColorPickerChange(defaultTextColor);
    changeActivityBoxType("activityBoxType2");
    document.getElementById("contentTitle").value = defaultTitle;
    document.getElementById("contentDescription").value = defaultDesc;
    document.getElementById("contentBackgroundColorPicker").value = defaultBGColor;
    document.getElementById("contentLink").value = "#";
    document.getElementById("contentBoxType").value = "activityBoxType2";
    document.getElementById("contentTitleColor").value = defaultTitleColor;
    document.getElementById("contentTextColor").value = defaultTextColor;
    var activityBoxImageElement = document.getElementsByClassName("activityBoxImage");
    activityBoxImageElement[0].src = "../../resource/img/aces-blue-bg-portrait.jpg";
    activityBoxImageElement[1].src = "../../resource/img/aces-blue-bg-landscape.jpg";
    activityBoxImageElement[2].src = "../../resource/img/preview (1).jpg";
}
function loadAvailableContentWithSettings() {
    var activitySettingsRef = firebase.firestore().collection("settings").doc("activitySettings");
    activitySettingsRef.get().then(function(activitySetting) {
        if (activitySetting.exists) {
            var settings = activitySetting.data();
            
            maxValue = settings.maxValue;
            document.getElementById("adminManageContentSettingValue").value = maxValue; //show current max value in settings
            loadAvailableActivities(maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document! Running with default value");
            loadAvailableActivities(3)
        }
    })
}
function loadMoreAvailableContent() {
    maxValue += 5;
    loadAvailableActivities(maxValue);
}
function saveContentSetting(button,type) {
    var loader = document.getElementById("saveSettingLoader")
    button.style.display = "none";
    loader.style.display = "block"
    var settingMaxValue = document.getElementById("adminManageContentSettingValue").value
    var settingRef = firebase.firestore().collection("settings").doc(type);
    settingRef.update({
        maxValue: parseInt(settingMaxValue),
    }).then(()=>{
        button.style.display = "inline";
        loader.style.display = "none";
        document.getElementsByClassName("adminManageContentOption")[0].click();
        loadAvailableContentWithSettings();
    }).catch((error)=>{
        button.style.display = "inline";
        loader.style.display = "none"
        showPopUp("Error",error.message)
    })
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