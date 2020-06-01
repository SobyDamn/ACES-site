function loadNewsletterWithSettings() {
    var newsSettingsRef = firebase.firestore().collection("settings").doc("newsSettings");
    newsSettingsRef.get().then(function(newsSetting) {
        if (newsSetting.exists) {
            var settings = newsSetting.data();
            loadNews(settings.maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No Setting document! Running with default value");
            loadNews(3)
        }
    })
}

function loadNews(maxLimit) {
    document.getElementById("newsStripsContainer").innerHTML = ``;
    var newsDB = firebase.firestore().collection("news").orderBy("timestamp", "desc").limit(maxLimit);
    var i = 0;
    newsDB.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var news = doc.data()
            document.getElementById("newsStripsContainer").innerHTML += newsStripGenerator(i,news.text,news.color,news.date,news.link)
            i++;
        });
    });
}
function openNews(url) {
    window.open(url);
}
function newsStripGenerator(elementId,text,color,date,link) {
    var newsBox = `<div onclick="openNews('${link}')" style="border-color:${color}" class="newsBox">
                        <div class="newsTextContainer">
                            <span class="newsText">
                                ${text}
                            </span>
                        </div>
                        <span class="newsPostDate">
                            ${date}
                        </span>
                    </div>`
    return newsBox;
}
