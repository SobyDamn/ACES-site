var blogUrl = `https://medium.com/feed/writeabyte`
var maximumCards = 4; // maximum number of small card to be generated
function fetchBlogs() {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${blogUrl}`)
    .then((res) => res.json())
    .then((data) => {
        //Do things
        const res = data.items
        const posts = res.filter(item => item.categories.length > 0) //filtering between blog content and comment
        document.getElementById("blogCardLoader").style.display = "none";
        for(var i = 0;i<posts.length;i++) {
            const post = posts[i];
            if (i==0) {
                //Big blog card for first blog
                generateBigBlogCard(post.link,shortenTitle(post.title),shortenText(post.description,360),post.author,nerdDateFull(post.pubDate),post.thumbnail);
            }
            else if(i <=maximumCards) {
                //generate small cards
                generateSmallBlogCard(post.url,shortenTitle(post.title),post.thumbnail,shortenText(post.description,220))
            }
        }
        })
}
function shortenTitle(title) {
    const maxLen = 29;
    if (title.length <= maxLen) {
        return title
    }
    else {
        return title.slice(0,maxLen-3)+"...";
    }
}
function shortenText(text,maxLength) {
    var startPt1 = text.search("</figure><p>");
    var startPt2 = text.search("<p>");
    if (startPt1 != -1) {
        return text.slice(startPt1+12,startPt1+12+maxLength).replace(/<[^>]*>/g, '');
    }
    else if (startPt2 != -1) {
        return text.slice(startPt2+3,startPt2+3+maxLength).replace(/<[^>]*>/g, '');
    }
    else {
        return text.length > maxLength?
        text.slice(60, maxLength).replace(/<[^>]*>/g, ''):
        text.replace(/<[^>]*>/g, '')
    }
}
function generateBigBlogCard(url,title,text,author,date,image) {
    const cardHolder = document.getElementById("bigBlogBoxContainer");
    const card = `<div onclick="openBlogs('${url}')" id="bigBlogCard">
                        <div id="bigBlogCardImageHolder">
                            <img src="${image}" id="bigBlogCardImage"/>
                        </div>
                        <div id="bigBlogCardDetail">
                            <h3>${title}</h3>
                            <p id="bigBlogCardTextDetails">
                                ${text}...
                            </p>
                            <div id="bigBlogCardAuthorDetails">
                                By ${author}<br>
                                ${date}
                            </div>
                            <a id="bigBlogLink" href="${url}">Read More</a>
                        </div>
                    </div>`
    cardHolder.innerHTML = card;
}
function generateSmallBlogCard (url,title,image,text) {
    var cardHolder = document.getElementById("smallBlogBoxHolder");
    var card = `<div onclick="openBlogs('${url}')" class="blogBox">
                            <div class="blogBoxImgContainer">
                                <img class="blogBoxImg" src="${image}"/>
                            </div>
                            <div  class="blogBoxDetails">
                                <h3 class="blogBoxTitle">
                                    ${title}
                                </h3>
                                <span class="blogBoxAbout">
                                    ${text}...
                                </span>
                            </div>
                            <a href= "${url}" class="blogBoxVisitLink">Read More</a>
                        </div>`
    cardHolder.innerHTML +=card;
}
function nerdDateFull(x) {
    var date = new Date(x)
    var monthsArray = new Array('Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    var outPutDate = `${day} ${monthsArray[month]},${year}`
    return outPutDate;

}
function openBlogs(url) {
    window.open(url);
}