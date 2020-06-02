function loadNewsletterWithSettings() {
    var newsSettingsRef = firebase.firestore().collection("settings").doc("newsSettings");
    var oppurtunitySettingsRef = firebase.firestore().collection("settings").doc("oppurtunitySettings");
    newsSettingsRef.get().then(function(newsSetting) {
        if (newsSetting.exists) {
            var settings = newsSetting.data();
            loadNews(settings.maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No Setting document! Running with default value");
            loadNews(3)
        }
    });
    oppurtunitySettingsRef.get().then(function(oppurtunitySetting) {
        if (oppurtunitySetting.exists) {
            var settings = oppurtunitySetting.data();
            loadOppurtunity(settings.maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No Setting document! Running with default value");
            loadOppurtunity(3)
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
            document.getElementById("newsStripsContainer").innerHTML += newsStripGenerator(news.text,news.color,news.date,news.link)
            i++;
        });
    });
}

function newsStripGenerator(text,color,date,link) {
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
function loadOppurtunity(maxLimit) {
    document.getElementById("oppurtunityBoxContainer").innerHTML = ``;
    var newsDB = firebase.firestore().collection("oppurtunity").orderBy("timestamp", "desc").limit(maxLimit);
    var i = 0;
    newsDB.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var oppurtunity = doc.data()
            document.getElementById("oppurtunityBoxContainer").innerHTML += oppurtunityBoxGenerator(oppurtunity.text,oppurtunity.lastDate,oppurtunity.link)
            i++;
        });
    });
}
function oppurtunityBoxGenerator(text,lastDate,link) {
    var oppurtunityBox = `<div class="oppurtunityBox">
                            <div class="oppurtunityDeadlineContainer">
                                <div class="oppurtunityDeadlineDateContainer">
                                    <span>
                                        <h4 class="oppurtunityLastDateHeading">Last Date</h4>
                                        <div class="oppurtunityLastDateDay">${nerdDate(lastDate)[0]}</div>
                                        <div class="oppurtunityLastDateMonth">${nerdDate(lastDate)[1]}</div>
                                        <div class="oppurtunityLastDateYear">${nerdDate(lastDate)[2]}</div>
                                    </span>
                                </div>
                            </div>
                            <div class="oppurtunityTextContainerArea">
                                <div class="oppurtunityTextContainer">
                                    <span class="oppurtunityText">
                                        ${text}
                                    </span>
                                </div>
                            </div>
                        </div>`
    return oppurtunityBox;
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

function openNews(url) {
    window.open(url);
}
