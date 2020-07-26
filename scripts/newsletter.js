function loadNewsletterWithSettings() {
    var newsSettingsRef = firebase.firestore().collection("settings").doc("newsSettings");
    var opportunitySettingsRef = firebase.firestore().collection("settings").doc("opportunitySettings");
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
    opportunitySettingsRef.get().then(function(opportunitySetting) {
        if (opportunitySetting.exists) {
            var settings = opportunitySetting.data();
            loadOpportunity(settings.maxValue)
        } else {
            // doc.data() will be undefined in this case
            console.log("No Setting document! Running with default value");
            loadOpportunity(3)
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
    var newsBox = `<div onclick="openNewsletter('${link}')" style="border-color:${color}" class="newsBox">
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
function loadOpportunity(maxLimit) {
    document.getElementById("opportunityBoxContainer").innerHTML = ``;
    var newsDB = firebase.firestore().collection("opportunity").orderBy("timestamp", "desc").limit(maxLimit);
    var i = 0;
    newsDB.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var opportunity = doc.data()
            document.getElementById("opportunityBoxContainer").innerHTML += opportunityBoxGenerator(opportunity.text,opportunity.lastDate,opportunity.link)
            i++;
        });
    });
}
function opportunityBoxGenerator(text,lastDate,link) {
    var opportunityBox = `<div onclick="openNewsletter('${link}')" class="opportunityBox">
                            <div class="opportunityDeadlineContainer">
                                <div class="opportunityDeadlineDateContainer">
                                    <span>
                                        <h4 class="opportunityLastDateHeading">Last Date</h4>
                                        <div class="opportunityLastDateDay">${nerdDate(lastDate)[0]}</div>
                                        <div class="opportunityLastDateMonth">${nerdDate(lastDate)[1]}</div>
                                        <div class="opportunityLastDateYear">${nerdDate(lastDate)[2]}</div>
                                    </span>
                                </div>
                            </div>
                            <div class="opportunityTextContainerArea">
                                <div class="opportunityTextContainer">
                                    <span class="opportunityText">
                                        ${text}
                                    </span>
                                </div>
                            </div>
                        </div>`
    return opportunityBox;
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

function openNewsletter(url) {
    if (url != "#" && url != "") {
        window.open(url);
    }
}
