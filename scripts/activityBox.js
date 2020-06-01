function loadActivitiesWithSettings() {
    var activitySettingsRef = firebase.firestore().collection("settings").doc("activitySettings");
    activitySettingsRef.get().then(function(activitySetting) {
        if (activitySetting.exists) {
            var settings = activitySetting.data();
            loadActivities(settings.maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No Setting document! Running with default value");
            loadActivities(3)
        }
    })
}
function loadActivities(maxLimit) {
    document.getElementById("activityBoxContainer").innerHTML = ``;
    var activityDB = firebase.firestore().collection("activity").orderBy("timestamp", "desc").limit(maxLimit);
    var i = 0;
    activityDB.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var activity = doc.data()
            document.getElementById("activityBoxContainer").innerHTML += activityBoxGenerator(doc.id,i,activity.type,activity.title,activity.description,activity.link,activity.background,activity.image)
            i++;
        });
    });
}
function openActivity(url) {
    window.open(url);
}

function activityBoxGenerator(id,elementId,type,title,description,link,background,imageURL) {
    fetchPreviewImage(id,imageURL,elementId);
    if (type == "activityBoxType1") {
        var activityBoxType1 = `<div id="activityBoxType1" onclick="openActivity('${link}')" class="activityBox">
                            <div class="activityBoxImageContainer">
                                <img class="activityBoxImage"/>
                            </div>
                            <div style="background: ${background}" class="activityBoxDetails">
                                <h3 class="activityBoxTitle">
                                    ${title}
                                </h3>
                                <span class="activityBoxAbout">
                                    ${description}
                                </span>
                            </div>
                        </div>`
        return activityBoxType1;
    }
    else if(type == "activityBoxType2") {
        var activityBoxType2 = `<div id="activityBoxType2" onclick="openActivity('${link}')" class="activityBox">
                            <div class="activityBoxImageContainer">
                                <img class="activityBoxImage"/>
                            </div>
                            <div style="background: ${background}" class="activityBoxDetails">
                                <h3 class="activityBoxTitle">
                                    ${title}
                                </h3>
                                <span class="activityBoxAbout">
                                    ${description}
                                </span>
                            </div>
                        </div>`
        return activityBoxType2;
    }
    else if(type == "activityBoxType3") {
        var activityBoxImage = `<div id="activityBoxType3" onclick="openActivity('${link}')" class="activityBox">
                                <img class="activityBoxImage"/>
                            </div>`
        return activityBoxImage;
    }
}

function fetchPreviewImage(id,fileName,elementId) {
    var storageRef = firebase.storage().ref();
    var activityBoxImageElement = document.getElementsByClassName("activityBoxImage")
    storageRef.child("activity/"+id+"/"+fileName).getDownloadURL().then((url)=> {
        activityBoxImageElement[elementId].src = url;
    }).catch((error)=> {
        // Handle any errors
        console.log(error)
    });
}