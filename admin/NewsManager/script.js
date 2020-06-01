var maxValue = 3; //setting for max car allowed on screen 


function loadCurrentDateOnStrip() {
    var x = new Date();
    document.getElementsByClassName("newsPostDate")[0].innerHTML = nerdDate(x);
}
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
//change stuffs in preview
function changeContentColor(value) {
    //change color
    const newsBoxElements = document.getElementsByClassName("newsBox")
    for (var i= 0;i < newsBoxElements.length;i++) {
        newsBoxElements[i].style['border-color'] = value;
    }
}
function changeContentTitle(value) {
    //change title
    const newsTextElements = document.getElementsByClassName("newsText")
    for (var i= 0;i < newsTextElements.length;i++) {
        newsTextElements[i].innerHTML = value;
    }
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
function submitContent() {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var contentColor = document.getElementById("contentBGColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var currDate = new Date();
    var newsDB = firebase.firestore().collection("news");
    submitInProgress(true)
    newsDB.add({
        text: contentTitle,
        color: contentColor,
        link: contentLink,
        date: nerdDate(currDate),
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
    }).then((newsRef)=>{
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

function saveEditNews(id) {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var contentColor = document.getElementById("contentBGColor").value;
    var contentLink = document.getElementById("contentLink").value;
    var news = firebase.firestore().collection("news").doc(id);
    submitInProgress(true)
    news.update({
        text: contentTitle,
        color: contentColor,
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

function loadAvailableNews(maxLimit) {
    document.getElementById("adminManageAvailableContentContainer").innerHTML = " "
    document.getElementById("availableNewsLoader").style.display = "block";
    var newsDB = firebase.firestore().collection("news").orderBy("timestamp", "desc").limit(maxLimit);
    newsDB.get().then(function(querySnapshot) {
        document.getElementById("availableNewsLoader").style.display = "none";
        querySnapshot.forEach(function(doc) {
            var news = doc.data()
            var text = escape(news['text'])
            var contentTitle = "title";
            if (news.text.length > 60) {
                contentTitle = news.text.slice(0,60) + "...";
            }
            else {
                contentTitle = news.text;
            }
            var newsElement = `<div class="adminManageAvailableContent">
                                        <span class="adminManageAvailableContentTitle">${contentTitle}</span><br>
                                        <button onclick="editNews('${doc.id}','${text}','${news.color}','${news.link}')" class="adminManageAvailableContentOptionBTN">Edit</button>
                                        <button onclick="deleteNews('${doc.id}','${contentTitle}')" class="adminManageAvailableContentOptionBTN">Delete</button>
                                        <button class="adminManageAvailableContentOptionBTN">About</button>
                                    </div>`
            document.getElementById("adminManageAvailableContentContainer").innerHTML += newsElement
        });
    });
}

function deleteNews(id,title) {
    //delete element
    var popMsgElement = document.getElementById("adminNoticePOPMsg")
    var newsDB = firebase.firestore().collection("news");
    var heading = "Delete"
    var msg = "Delete News<br>'"+unescape(title)+"' ?"
    document.getElementById("confirmPOP").style.display = "inline"
    var confirmBTN = document.getElementById("confirmPOP");
    confirmBTN.onclick = function(){
        document.getElementById("confirmPopLoader").style.display = "block";
        document.getElementById("popFooter").style.display = "none"
        newsDB.doc(id).delete().then(function() {
            popMsgElement.innerHTML +="<br><b><i>Deleted Successfully</i></b>";
            loadAvailableContentWithSettings()
            closeErrorPop()
        }).catch(function(error) {
            closeErrorPop();
            var msg = "Error<br>"+error.message;
            var title = "Error";
            showPopUp(title,msg)
        });
    }
    showPopUp(heading,msg);
    
}
function editNews(id,text,color,link) {
    //edit
    document.getElementById("contentTitle").value = unescape(text);
    document.getElementById("contentBGColor").value = color;
    document.getElementById("contentLink").value = link;
    changeContentTitle(unescape(text));
    changeContentColor(color);
    var saveEditBTN = document.getElementById("submitEditContentBTN")
    saveEditBTN.onclick = function(){
        saveEditNews(id);
    }
    saveEditBTN.style.display = "inline";
    document.getElementById("addNewNewsBTN").style.display = "inline";
    document.getElementById("submitContentBTN").style.display = "none";
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
    document.getElementById("addNewNewsBTN").style.display = "none";
    document.getElementById("submitEditContentBTN").style.display = "none";
    document.getElementById("submitContentBTN").style.display = "inline";
    var defaultText = `ACES refers to the Association of Computer Engineering Students from the prestigious School of Engineering, Cochin University of Science and technology (CUSAT).`;
    var defaultColor = `rgb(11, 207, 4)`;
    changeContentTitle(defaultText);
    changeContentColor(defaultColor);
    document.getElementById("contentTitle").value = defaultText;
    document.getElementById("contentBGColor").value = defaultColor;
    document.getElementById("contentLink").value = "#";
}
function loadAvailableContentWithSettings() {
    var newsSettingRef = firebase.firestore().collection("settings").doc("newsSettings");
    newsSettingRef.get().then(function(newsSetting) {
        if (newsSetting.exists) {
            var settings = newsSetting.data();
            maxValue = settings.maxValue;
            document.getElementById("adminManageContentSettingValue").value = maxValue; //show current max value in settings
            loadAvailableNews(maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document! Running with default value");
            loadAvailableNews(3)
        }
    })
}
function loadMoreAvailableContent() {
    maxValue += 5;
    loadAvailableNews(maxValue);
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