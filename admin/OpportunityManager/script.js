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
    document.getElementsByClassName("opportunityLastDateDay")[0].innerHTML = nerdDate(value)[0];
    document.getElementsByClassName("opportunityLastDateMonth")[0].innerHTML = nerdDate(value)[1];
    document.getElementsByClassName("opportunityLastDateYear")[0].innerHTML = nerdDate(value)[2];
}

function changeContentTitle(value) {
    //change title
    const opportunityTextElements = document.getElementsByClassName("opportunityText")
    for (var i= 0;i < opportunityTextElements.length;i++) {
        opportunityTextElements[i].innerHTML = value;
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
    var opportunityDB = firebase.firestore().collection("opportunity");
    if (lastDate != "") {
        submitInProgress(true)
        opportunityDB.add({
            text: contentTitle,
            lastDate: lastDate,
            link: contentLink,
            addedBy:availableUser.displayName,
            addedOn:nerdDate2(new Date()),
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
            showPopUp("Error",error.message);
        })
    }
    else {
        submitInProgress(false)
        document.getElementById("contentSubmitErrorHolder").style.display = "block";
        document.getElementById("contentSubmitErrorText").innerText = "Please select valid value in date field!";
    }
    
}

function saveEditOpportunity(id) {
    document.getElementById("contentSubmitErrorHolder").style.display = "none";
    var contentTitle = document.getElementById("contentTitle").value;
    var lastDate = document.getElementById("contentDateField").value;
    var contentLink = document.getElementById("contentLink").value;
    var opportunity = firebase.firestore().collection("opportunity").doc(id);
    submitInProgress(true)
    opportunity.update({
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
        showPopUp("Error",error.message);
    })
}

function loadAvailableOpportunity(maxLimit) {
    document.getElementById("adminManageAvailableContentContainer").innerHTML = " "
    document.getElementById("availableOpportunityLoader").style.display = "block";
    var opportunityDB = firebase.firestore().collection("opportunity").orderBy("timestamp", "desc").limit(maxLimit);
    opportunityDB.get().then(function(querySnapshot) {
        document.getElementById("availableOpportunityLoader").style.display = "none";
        querySnapshot.forEach(function(doc) {
            var opportunity = doc.data()
            var text = escape(opportunity['text'])
            var contentTitle = "title";
            if (opportunity.text.length > 100) {
                contentTitle = opportunity.text.slice(0,60) + "...";
            }
            else {
                contentTitle = opportunity.text;
            }
            var opportunityElement = `<div class="adminManageAvailableContent">
                                        <span class="adminManageAvailableContentTitle">${contentTitle}</span><br>
                                        <button onclick="editOpportunity('${doc.id}','${text}','${opportunity.lastDate}','${opportunity.link}')" class="adminManageAvailableContentOptionBTN">Edit</button>
                                        <button onclick="deleteOpportunity('${doc.id}','${escape(contentTitle)}')" class="adminManageAvailableContentOptionBTN">Delete</button>
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
            document.getElementById("adminManageAvailableContentContainer").innerHTML += opportunityElement
        });
    });
}

function deleteOpportunity(id,title) {
    //delete element
    var popMsgElement = document.getElementById("adminNoticePOPMsg")
    var opportunityDB = firebase.firestore().collection("opportunity");
    var heading = "Delete"
    var msg = "Delete Opportunity<br>'"+unescape(title)+"' ?"
    document.getElementById("confirmPOP").style.display = "inline"
    var confirmBTN = document.getElementById("confirmPOP");
    confirmBTN.onclick = function(){
        document.getElementById("confirmPopLoader").style.display = "block";
        document.getElementById("popFooter").style.display = "none"
        opportunityDB.doc(id).delete().then(function() {
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
function editOpportunity(id,text,lastDate,link) {
    //edit
    loadDateOnStrip(lastDate)
    document.getElementById("contentTitle").value = unescape(text);
    document.getElementById("contentDateField").value = lastDate;
    document.getElementById("contentLink").value = link;
    changeContentTitle(unescape(text));
    var saveEditBTN = document.getElementById("submitEditContentBTN")
    saveEditBTN.onclick = function(){
        saveEditOpportunity(id);
    }
    saveEditBTN.style.display = "inline";
    document.getElementById("addNewOpportunityBTN").style.display = "inline";
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
    document.getElementById("addNewOpportunityBTN").style.display = "none";
    document.getElementById("submitEditContentBTN").style.display = "none";
    document.getElementById("submitContentBTN").style.display = "inline";
    var defaultText = `I don't know how long a single line can be, Expecting it to be this long!`;
    changeContentTitle(defaultText);
    loadDateOnStrip(null);
    document.getElementById("contentTitle").value = defaultText;
    document.getElementById("contentDateField").value = "";
    document.getElementById("contentLink").value = "#";
}
function loadAvailableContentWithSettings() {
    var opportunitySettingRef = firebase.firestore().collection("settings").doc("opportunitySettings");
    opportunitySettingRef.get().then(function(opportunitySetting) {
        if (opportunitySetting.exists) {
            var settings = opportunitySetting.data();
            maxValue = settings.maxValue;
            document.getElementById("adminManageContentSettingValue").value = maxValue; //show current max value in settings
            loadAvailableOpportunity(maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document! Running with default value");
            loadAvailableOpportunity(3)
        }
    })
}
function loadMoreAvailableContent() {
    maxValue += 5;
    loadAvailableOpportunity(maxValue);
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
function nerdDate2(x) {
    var date = new Date(x)
    var monthsArray = new Array('Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    var outPutDate = `${day} ${monthsArray[month]},${year}`
    return outPutDate;
}