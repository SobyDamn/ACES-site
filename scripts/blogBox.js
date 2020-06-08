function loadBlogsWithSettings() {
    var activitySettingsRef = firebase.firestore().collection("settings").doc("blogSettings");
    activitySettingsRef.get().then(function(activitySetting) {
        if (activitySetting.exists) {
            var settings = activitySetting.data();
            loadBlogs(settings.maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No Setting document! Running with default value");
            loadBlogs(3)
        }
    })
}
function loadBlogs(maxLimit) {
    document.getElementById("blogBoxContainer").innerHTML = ``;
    var activityDB = firebase.firestore().collection("blog").orderBy("timestamp", "desc").limit(maxLimit);
    var i = 0;
    activityDB.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var blog = doc.data()
            document.getElementById("blogBoxContainer").innerHTML += blogBoxGenerator(doc.id,i,blog.title,blog.description,blog.link,blog.background,blog.image,blog.textColor,blog.titleColor)
            i++;
        });
    });
}

function blogBoxGenerator(id,elementId,title,description,link,background,imageURL,textColor,titleColor) {
    fetchBlogPreviewImage(id,imageURL,elementId);
    var blogBoxElement = `<div onclick="openBlogs('${link}')" class="blogBox">
                            <div class="blogBoxImgContainer">
                                <img class="blogBoxImg" src="resource/img/aces-default-image-preview-landscape.jpg"/>
                            </div>
                            <div style="background: ${background}" class="blogBoxDetails">
                                <h3 style="color: ${titleColor}" class="blogBoxTitle">
                                    ${title}
                                </h3>
                                <span style="color: ${textColor}" class="blogBoxAbout">
                                    ${description}
                                </span>
                            </div>
                            <a class="blogBoxVisitLink" style="display:none" href="${link}">Read More</a>
                        </div>`
    return blogBoxElement;
}

function fetchBlogPreviewImage(id,fileName,elementId) {
    var storageRef = firebase.storage().ref();
    var blogBoxImageElement = document.getElementsByClassName("blogBoxImg")
    storageRef.child("blog/"+id+"/"+fileName).getDownloadURL().then((url)=> {
        blogBoxImageElement[elementId].src = url;
    }).catch((error)=> {
        // Handle any errors
        console.log(error)
    });
}
function openBlogs(url) {
    window.open(url);
}