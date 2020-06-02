var maxValue = 3; //setting for max card allowed on screen will come from db this is default

function loadDateOnStrip(value) {
    if (value == null) {
        var x = new Date();
        changeContentDate(x)
    }
    else {
        changeContentDate(value)
    }
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

function changeContentDate(value) {
    document.getElementsByClassName("oppurtunityLastDateDay")[0].innerHTML = nerdDate(value)[0];
    document.getElementsByClassName("oppurtunityLastDateMonth")[0].innerHTML = nerdDate(value)[1];
    document.getElementsByClassName("oppurtunityLastDateYear")[0].innerHTML = nerdDate(value)[2];
}

function changeContentTitle(value) {
    //change title
    const oppurtunityTextElements = document.getElementsByClassName("oppurtunityText")
    for (var i= 0;i < oppurtunityTextElements.length;i++) {
        oppurtunityTextElements[i].innerHTML = value;
    }
}
function nerdDate(x) {
    var date = new Date(x)
    var monthsArray = new Array('Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    var outPutDate = `${day} ${monthsArray[month]},${year}`
    var nerdDay;
    if (day < 10 ) {
        nerdDay = `0${day}`;
    }
    else {
        nerdDay = day;
    }
    var dateValues = new Array(nerdDay,monthsArray[month],year)
    return dateValues;
}

function submitContent() {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var lastDate = document.getElementById("contentDateField").value;
    var contentLink = document.getElementById("contentLink").value;
    var oppurtunityDB = firebase.firestore().collection("oppurtunity");
    submitInProgress(true)
    oppurtunityDB.add({
        text: contentTitle,
        lastDate: lastDate,
        link: contentLink,
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
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

function saveEditOppurtunity(id) {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var lastDate = document.getElementById("contentDateField").value;
    var contentLink = document.getElementById("contentLink").value;
    var oppurtunity = firebase.firestore().collection("oppurtunity").doc(id);
    submitInProgress(true)
    oppurtunity.update({
        text: contentTitle,
        lastDate: lastDate,
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

function loadAvailableOppurtunity(maxLimit) {
    document.getElementById("adminManageAvailableContentContainer").innerHTML = " "
    document.getElementById("availableOppurtunityLoader").style.display = "block";
    var oppurtunityDB = firebase.firestore().collection("oppurtunity").orderBy("timestamp", "desc").limit(maxLimit);
    oppurtunityDB.get().then(function(querySnapshot) {
        document.getElementById("availableOppurtunityLoader").style.display = "none";
        querySnapshot.forEach(function(doc) {
            var oppurtunity = doc.data()
            var text = escape(oppurtunity['text'])
            var contentTitle = "title";
            if (oppurtunity.text.length > 100) {
                contentTitle = oppurtunity.text.slice(0,60) + "...";
            }
            else {
                contentTitle = oppurtunity.text;
            }
            var oppurtunityElement = `<div class="adminManageAvailableContent">
                                        <span class="adminManageAvailableContentTitle">${contentTitle}</span><br>
                                        <button onclick="editOppurtunity('${doc.id}','${text}','${oppurtunity.lastDate}','${oppurtunity.link}')" class="adminManageAvailableContentOptionBTN">Edit</button>
                                        <button onclick="deleteOppurtunity('${doc.id}','${escape(contentTitle)}')" class="adminManageAvailableContentOptionBTN">Delete</button>
                                        <button class="adminManageAvailableContentOptionBTN">About</button>
                                    </div>`
            document.getElementById("adminManageAvailableContentContainer").innerHTML += oppurtunityElement
        });
    });
}

function deleteOppurtunity(id,title) {
    //delete element
    var popMsgElement = document.getElementById("adminNoticePOPMsg")
    var oppurtunityDB = firebase.firestore().collection("oppurtunity");
    var heading = "Delete"
    var msg = "Delete Oppurtunity<br>'"+unescape(title)+"' ?"
    document.getElementById("confirmPOP").style.display = "inline"
    var confirmBTN = document.getElementById("confirmPOP");
    confirmBTN.onclick = function(){
        document.getElementById("confirmPopLoader").style.display = "block";
        document.getElementById("popFooter").style.display = "none"
        oppurtunityDB.doc(id).delete().then(function() {
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
function editOppurtunity(id,text,lastDate,link) {
    //edit
    loadDateOnStrip(lastDate)
    document.getElementById("contentTitle").value = unescape(text);
    document.getElementById("contentDateField").value = lastDate;
    document.getElementById("contentLink").value = link;
    changeContentTitle(unescape(text));
    var saveEditBTN = document.getElementById("submitEditContentBTN")
    saveEditBTN.onclick = function(){
        saveEditOppurtunity(id);
    }
    saveEditBTN.style.display = "inline";
    document.getElementById("addNewOppurtunityBTN").style.display = "inline";
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
    document.getElementById("addNewOppurtunityBTN").style.display = "none";
    document.getElementById("submitEditContentBTN").style.display = "none";
    document.getElementById("submitContentBTN").style.display = "inline";
    var defaultText = `I don't kknow how long a single line can be, Expecting it to be this long!`;
    changeContentTitle(defaultText);
    loadDateOnStrip(null);
    document.getElementById("contentTitle").value = defaultText;
    document.getElementById("contentDateField").value = "";
    document.getElementById("contentLink").value = "#";
}
function loadAvailableContentWithSettings() {
    var oppurtunitySettingRef = firebase.firestore().collection("settings").doc("oppurtunitySettings");
    oppurtunitySettingRef.get().then(function(oppurtunitySetting) {
        if (oppurtunitySetting.exists) {
            var settings = oppurtunitySetting.data();
            maxValue = settings.maxValue;
            document.getElementById("adminManageContentSettingValue").value = maxValue; //show current max value in settings
            loadAvailableOppurtunity(maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document! Running with default value");
            loadAvailableOppurtunity(3)
        }
    })
}
function loadMoreAvailableContent() {
    maxValue += 5;
    loadAvailableOppurtunity(maxValue);
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