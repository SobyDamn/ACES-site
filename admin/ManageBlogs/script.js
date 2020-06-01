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
    var blogBoxImageElement = document.getElementsByClassName("blogBoxImg")
    for (var i=0;i<blogBoxImageElement.length ; i++) {
        blogBoxImageElement[i].src = URL.createObjectURL(event.target.files[0]);
    }
}
//change stuffs in preview
function changeContentColor(value) {
    //change color
    const blogBoxDetailsElements = document.getElementsByClassName("blogBoxDetails")
    for (var i= 0;i < blogBoxDetailsElements.length;i++) {
        blogBoxDetailsElements[i].style.background = value;
    }
}
function changeContentTitle(value) {
    //change title
    const blogBoxTitleElements = document.getElementsByClassName("blogBoxTitle")
    for (var i= 0;i < blogBoxTitleElements.length;i++) {
        blogBoxTitleElements[i].innerHTML = value;
    }
}
function changeContentDescription(value) {
    //change description

    const blogBoxDescriptionElements = document.getElementsByClassName("blogBoxAbout")
    for (var i= 0;i < blogBoxDescriptionElements.length;i++) {
        blogBoxDescriptionElements[i].innerHTML = value;
    }
}

function submitContent() {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var contentDescription = document.getElementById("contentDescription").value;
    var contentDetailBGColor = document.getElementById("contentBGColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var blogDB = firebase.firestore().collection("blog");
    submitInProgress(true)
    if (selectedImage == null) {
        document.getElementById("contentSubmitErrorHolder").style.display = "block";
        document.getElementById("contentSubmitErrorText").innerText = "Please Select an Image!"
        submitInProgress(false);
    }
    else {
        var contentImageURL = selectedImage.name
        //submit
        blogDB.add({
            title: contentTitle,
            description: contentDescription,
            background: contentDetailBGColor,
            link: contentLink,
            image: contentImageURL,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        }).then((blogRef)=>{
            uploadBlogImage(blogRef.id)
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
        })
    }
}

function saveEditBlog(id) {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var contentDescription = document.getElementById("contentDescription").value;
    var contentDetailBGColor = document.getElementById("contentBGColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var blog = firebase.firestore().collection("blog").doc(id);
    submitInProgress(true)
    if (selectedImage == null) {
        blog.update({
            title: contentTitle,
            description: contentDescription,
            background: contentDetailBGColor,
            link: contentLink,
        }).then(()=>{
            submitInProgress(false);
            document.getElementsByClassName("adminManageContentOption")[0].click();
            loadAvailableContentWithSettings();
            resetContentForm();
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
        })
    }
    else {
        var contentImageURL = selectedImage.name
        //submit
        blog.update({
            title: contentTitle,
            description: contentDescription,
            background: contentDetailBGColor,
            link: contentLink,
            image: contentImageURL,
        }).then(()=>{
            uploadBlogImage(id)
        }).catch((error)=>{
            submitInProgress(false)
            document.getElementById("contentSubmitErrorHolder").style.display = "block";
            document.getElementById("contentSubmitErrorText").innerText = error;
        })
    }
}

function uploadBlogImage(id) {
    var storageRef = firebase.storage().ref("blog/"+id+"/"+selectedImage.name);
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
    document.getElementById("availableBlogLoader").style.display = "block";
    var blogDB = firebase.firestore().collection("blog").orderBy("timestamp", "desc").limit(maxLimit);
    blogDB.get().then(function(querySnapshot) {
        document.getElementById("availableBlogLoader").style.display = "none";
        querySnapshot.forEach(function(doc) {
            var blog = doc.data()
            var description = escape(blog['description'])
            var title = escape(blog['title'])
            var blogElement = `<div class="adminManageAvailableContent">
                                        <span class="adminManageAvailableContentTitle">${blog.title}</span><br>
                                        <button onclick="editBlog('${doc.id}','${title}','${description}','${blog.link}','${blog.background}','${blog.image}')" class="adminManageAvailableContentOptionBTN">Edit</button>
                                        <button onclick="deleteBlog('${doc.id}','${title}','${blog.image}')" class="adminManageAvailableContentOptionBTN">Delete</button>
                                        <button class="adminManageAvailableContentOptionBTN">About</button>
                                    </div>`
            document.getElementById("adminManageAvailableContentContainer").innerHTML += blogElement
        });
    });
}

function deleteBlog(id,title,imageURL) {
    //delete element
    var popMsgElement = document.getElementById("adminNoticePOPMsg")
    var blogDB = firebase.firestore().collection("blog");
    var imageRef = firebase.storage().ref().child("blog/"+id+"/"+imageURL);
    var heading = "Delete"
    var msg = "Delete Blog<br>'"+unescape(title)+"' ?"
    document.getElementById("confirmPOP").style.display = "inline"
    var confirmBTN = document.getElementById("confirmPOP");
    confirmBTN.onclick = function(){
        document.getElementById("confirmPopLoader").style.display = "block";
        document.getElementById("popFooter").style.display = "none"
        //Delete document and then stored image
        blogDB.doc(id).delete().then(function() {
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
function editBlog(id,title,description,link,bgColor,image) {
    //edit
    document.getElementById("contentTitle").value = unescape(title);
    document.getElementById("contentDescription").value = unescape(description);
    document.getElementById("contentBGColor").value = bgColor;
    document.getElementById("contentLink").value = link;
    changeContentDescription(unescape(description));
    changeContentTitle(unescape(title));
    changeContentColor(bgColor);
    fetchPreviewImage(id,image);
    var saveEditBTN = document.getElementById("submitEditContentBTN")
    saveEditBTN.onclick = function(){
        saveEditBlog(id);
    }
    saveEditBTN.style.display = "inline";
    document.getElementById("addNewBlogBTN").style.display = "inline";
    document.getElementById("submitContentBTN").style.display = "none";
    document.getElementsByClassName("adminManageContentOption")[1].click();
}
function fetchPreviewImage(id,fileName) {
    var storageRef = firebase.storage().ref();
    var blogBoxImageElement = document.getElementsByClassName("blogBoxImg")
    storageRef.child("blog/"+id+"/"+fileName).getDownloadURL().then((url)=> {
        for (var i=0;i<blogBoxImageElement.length ; i++) {
            blogBoxImageElement[i].src = url;
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
    document.getElementById("addNewBlogBTN").style.display = "none";
    document.getElementById("submitEditContentBTN").style.display = "none";
    document.getElementById("submitContentBTN").style.display = "inline";
    var defaultDesc = `ACES refers to the Association of Computer Engineering Students from the prestigious School of Engineering, Cochin University of Science and technology (CUSAT).`
    var defaultTitle = `ACES`;
    var defaultBGColor = `rgb(6, 110, 93)`;
    changeContentDescription(defaultDesc);
    changeContentTitle(defaultTitle);
    changeContentColor(defaultBGColor);
    document.getElementById("contentTitle").value = defaultTitle;
    document.getElementById("contentDescription").value = defaultDesc;
    document.getElementById("contentBGColor").value = defaultBGColor;
    document.getElementById("contentLink").value = "#";
    var blogBoxImageElement = document.getElementsByClassName("blogBoxImg");
    blogBoxImageElement[0].src = "../../resource/img/aces-blue-bg-landscape.jpg";
}
function loadAvailableContentWithSettings() {
    var blogSettingsRef = firebase.firestore().collection("settings").doc("blogSettings");
    blogSettingsRef.get().then(function(blogSetting) {
        if (blogSetting.exists) {
            var settings = blogSetting.data();
            
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